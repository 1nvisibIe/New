<?php

namespace App\Http\Controllers;

use App\Models\Card;
use App\Models\CardView;
use App\Models\User;
use App\Services\Recommendation\RuleEngine;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class RecommendationController extends Controller
{
    public function index()
    {
        $user = Auth::user();

        $recommendations = collect();

        if ($user) {
            $engine = new RuleEngine();
            $recommendations = $engine->generateRecommendations($user, 10);

            // Если профиль пустой (нет просмотров) — показываем популярные
            if ($recommendations->isEmpty()) {
                $recommendations = Card::query()
                    ->where('is_active', true)
                    ->orderByDesc('views')
                    ->take(10)
                    ->get()
                    ->each(function ($card) {
                        $card->recommendation_explanation = 'Популярный фильм среди пользователей';
                    });
            }
        } else {
            // Гость — популярные
            $recommendations = Card::query()
                ->where('is_active', true)
                ->orderByDesc('views')
                ->take(10)
                ->get()
                ->each(function ($card) {
                    $card->recommendation_explanation = 'Популярный фильм среди пользователей';
                });
        }

        return view('client.recommendation', compact('recommendations'));
    }

    // Можно добавить на страницу товара
    public function forCard($cardId)
    {
        $user = Auth::user();
        $recommendations = collect();

        if ($user) {
            $engine = new RuleEngine();
            $recommendations = $engine->generateRecommendations($user, 4);
        }

        return view('cards.show', compact('recommendations')); // или partial
    }

    public function resetHistory(Request $request)
    {
        $user = Auth::user();
        if (!$user) {
            return redirect()->back()->with('error', 'Только авторизованные пользователи могут сбросить историю.');
        }

        // Очистка истории просмотров
        CardView::where('user_id', $user->id)->delete();

        // Обнуление профиля предпочтений
        $user->preferences = json_encode([]); // или null
        $user->save();

        return redirect()->route('recommendation')->with('success', 'История просмотров сброшена. Рекомендации обновлены.');
    }

}
