<?php

namespace App\Services\Recommendation;

use App\Models\CardView;
use App\Models\User;
use Illuminate\Support\Collection;
use App\Models\RecommendationRule;
use App\Models\CardSimilarity;
use App\Models\Card;
class RuleEngine
{
    public function generateRecommendations(User $user, int $limit = 10): Collection
    {
        $recommendations = collect();

        // 1. Правила БЗ — они в приоритете
        $rules = RecommendationRule::where('is_active', true)->orderBy('priority')->get();
        $profile = $user->calculatePreferences();

        foreach ($rules as $rule) {
            if ($this->matchesCondition($rule->condition, $profile, $user)) {
                $ruleCards = $this->getCardsFromAction($rule->action);

                foreach ($ruleCards as $card) {
                    $card->recommendation_explanation = $rule->explanation ?? 'Рекомендовано по правилу базы знаний';
                    $recommendations->push($card);
                }
            }
        }

        // 2. Похожие — добавляем только если у карточки ещё нет объяснения от правила
        $viewedCardIds = CardView::where('user_id', $user->id)
            ->latest('viewed_at')
            ->take(5)
            ->pluck('card_id');

        if ($viewedCardIds->isNotEmpty()) {
            $similar = CardSimilarity::whereIn('card_id', $viewedCardIds)
                ->orderByDesc('strength')
                ->take(5)
                ->get();

            foreach ($similar as $sim) {
                if ($sim->similarCard && !$sim->similarCard->recommendation_explanation) {
                    $sim->similarCard->recommendation_explanation = 'Похож на недавно просмотренный фильм';
                    $recommendations->push($sim->similarCard);
                }
            }
        }

        // Убираем дубликаты и сортируем
        $unique = $recommendations->unique('id');

        return $unique->take($limit);
    }

    private function matchesCondition(string $condition, array $profile, User $user): bool
    {
        $condition = trim($condition);

        // Пустой профиль
        if ($condition === 'profile empty') {
            return empty($profile) || empty($profile['genres']);
        }

            // Жанр > значение
            if (preg_match("/genre_preference\['([^']+)'\] > ([\d.]+)/", $condition, $matches)) {
                $genre = $matches[1];
                $value = (float)$matches[2];
                return ($profile['genres'][$genre] ?? 0) > $value;
            }

            // Директор = true
            if (preg_match("/director_preference\['([^']+)'\] = true/", $condition, $matches)) {
                $director = $matches[1];
                return !empty($profile['directors'][$director]);
            }

            // Средний рейтинг > значение
            if (preg_match("/average_rating > ([\d.]+)/", $condition, $matches)) {
                $value = (float)$matches[1];
                return ($profile['average_rating'] ?? 0) > $value;
            }

            // Просмотрен конкретный фильм
        if (preg_match("/viewed_movies contains '([^']+)'/", $condition, $matches)) {
            $movieName = $matches[1];

            return CardView::where('user_id', $user->id)
                ->whereHas('card', function($q) use ($movieName) {
                    $q->where('name', 'like', "%$movieName%");
                })
                ->exists();
        }

        return false;
    }

    private function getCardsFromAction(string $action): Collection
    {
        if (str_contains($action, "genre='sci-fi'")) {
            return Card::where('genres', 'like', '%sci-fi%')
                ->where('imdb_rating', '>', 8.0)
                ->where('is_active', true)
                ->take(8)  // было 5 — увеличь до 8–10
                ->get();
        }

        // Для других действий — аналогично
        return collect();
    }
}
