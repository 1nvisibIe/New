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

        $rules = RecommendationRule::where('is_active', true)->orderBy('priority')->get();
        $profile = $user->calculatePreferences();

        foreach ($rules as $rule) {
            if ($this->matchesCondition($rule, $profile, $user)) {
                $ruleCards = $this->getCardsFromAction($rule, $profile);

                foreach ($ruleCards as $card) {
                    $card->recommendation_explanation = $rule->explanation ?? 'Рекомендовано по правилу базы знаний';
                    $recommendations->push($card);
                }
            }
        }

        // ... блок похожих ...

        return $recommendations->unique('id')->sortByDesc('imdb_rating')->take($limit);
    }

    private function matchesCondition(string $condition, array $profile, User $user): bool
    {
        $condition = trim($condition);

        // 1. Пустой профиль
        if ($condition === 'profile empty' || str_contains($condition, 'profile empty')) {
            return empty($profile) || empty($profile['genres']);
        }

        // 2. Genre preference > значение
        if (preg_match("/genre_preference\['([^']+)'\] > ([\d.]+)/", $condition, $matches)) {
            if (count($matches) >= 3) {  // проверка, что есть группа 1 и 2
                $genre = $matches[1];
                $value = (float) $matches[2];
                return ($profile['genres'][$genre] ?? 0) > $value;
            }
            return false;
        }

        // 3. Director preference = true
        if (preg_match("/director_preference\['([^']+)'\] = true/", $condition, $matches)) {
            if (count($matches) >= 2) {
                $director = $matches[1];
                return ($profile['directors'][$director] ?? 0) > 0;
            }
            return false;
        }

        // 4. Liked actors contains 'имя'
        if (preg_match("/liked_actors contains '([^']+)'/", $condition, $matches)) {
            if (count($matches) >= 2) {
                $actor = $matches[1];
                return ($profile['actors'][$actor] ?? 0) > 0;
            }
            return false;
        }

        // 5. Viewed movies contains 'фильм' and liked_rating >= значение
        if (preg_match("/viewed_movies contains '([^']+)' and liked_rating >= ([\d]+)/", $condition, $matches)) {
            if (count($matches) >= 3) {
                $movieName = $matches[1];
                $minRating = (int)$matches[2];

                return CardView::where('user_id', $user->id)
                    ->where('rating', '>=', $minRating)
                    ->whereHas('card', function($q) use ($movieName) {
                        $q->where('name', 'like', "%$movieName%");
                    })
                    ->exists();
            }
            return false;
        }

        // 6. Average rating > значение
        if (preg_match("/average_rating > ([\d.]+)/", $condition, $matches)) {
            if (count($matches) >= 2) {
                $value = (float)$matches[1];
                return ($profile['average_rating'] ?? 0) > $value;
            }
            return false;
        }

        return false;
    }



    private function getCardsFromAction(RecommendationRule $rule, array $profile): Collection
    {
        $action = trim($rule->action);
        $type = $rule->condition_type;

        // 1. Рекомендация по жанру (сценарий 1, 2, 4, 5)
        if (preg_match("/recommend genre='([^']+)'( and imdb_rating > ([\d.]+))?/", $action, $matches)) {
            $genre = $matches[1];
            $minRating = isset($matches[3]) ? (float)$matches[3] : 0;

            return Card::where('genres', 'like', "%$genre%")
                ->where('imdb_rating', '>', $minRating)
                ->where('is_active', true)
                ->orderByDesc('imdb_rating')
                ->take(6)
                ->get();
        }

        // 2. Рекомендация похожих на конкретный фильм (сценарий 1, 2, 4)
        if (preg_match("/recommend similar to card_id=(\d+)/", $action, $matches)) {
            $cardId = (int)$matches[1];

            return CardSimilarity::where('card_id', $cardId)
                ->orderByDesc('strength')
                ->take(8)
                ->get()
                ->pluck('similarCard')
                ->filter(); // убираем null
        }

        // 3. Рекомендация по режиссёру (сценарий 1, 4)
        if (preg_match("/recommend director='([^']+)'/", $action, $matches)) {
            $director = $matches[1];

            return Card::where('director', 'like', "%$director%")
                ->where('is_active', true)
                ->orderByDesc('imdb_rating')
                ->take(6)
                ->get();
        }

        // 4. Рекомендация по актёру (универсально, если добавлен тип 'actor')
        if (preg_match("/recommend actor='([^']+)'/", $action, $matches)) {
            $actor = $matches[1];

            return Card::where('actors', 'like', "%$actor%")
                ->where('is_active', true)
                ->orderByDesc('imdb_rating')
                ->take(6)
                ->get();
        }

        // 5. Топ-10 самых высокооценённых (сценарий 3, 4)
        if (str_contains($action, 'top-10 most highly rated') || str_contains($action, 'top by rating')) {
            return Card::where('is_active', true)
                ->orderByDesc('imdb_rating')
                ->take(10)
                ->get();
        }

        // 6. Самые популярные последние 5 лет (сценарий 3)
        if (str_contains($action, 'most popular movies last 5 years')) {
            return Card::where('is_active', true)
                ->where('release_year', '>', date('Y') - 5)
                ->orderByDesc('views')
                ->take(5)
                ->get();
        }

        // 7. Классика с высоким рейтингом (сценарий 4)
        if (str_contains($action, 'classic cinema with high rating')) {
            return Card::where('is_active', true)
                ->where('release_year', '<', 2000)
                ->orderByDesc('imdb_rating')
                ->take(5)
                ->get();
        }

        // 8. Универсальное действие: топ по просмотрам (fallback)
        if (str_contains($action, 'top by views')) {
            return Card::where('is_active', true)
                ->orderByDesc('views')
                ->take(10)
                ->get();
        }

        // Если действие не распознано — пустая коллекция
        return collect();
    }
}
