<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;

class User extends Authenticatable
{
    /** @use HasFactory<\Database\Factories\UserFactory> */
    use HasFactory, Notifiable;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'name',
        'email',
        'password',
        'preferences'
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var list<string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
        ];
    }

    public function calculatePreferences(): array
    {
        $views = $this->cardViews()->with('card')->get();

        if ($views->isEmpty()) {
            return [];
        }

        $genreScores = [];
        $directorScores = [];
        $actorScores = [];
        $totalRating = 0;
        $count = 0;

        foreach ($views as $view) {
            if (!$view->card) continue;

            $genres = explode(',', $view->card->genres ?? '');
            $actors = explode(',', $view->card->actors ?? '');
            $rating = $view->rating ?? 5; // если нет оценки — среднее

            // Базовый вес за просмотр + модификатор от оценки
            $baseWeight = 0.3; // +0.3 за сам факт просмотра
            $ratingModifier = ($rating - 5) / 5; // 10 → +1, 5 → 0, 1 → -0.8
            $weight = $baseWeight + $ratingModifier; // итоговый вес

            foreach ($genres as $genre) {
                $genre = trim($genre);
                if ($genre) {
                    $genreScores[$genre] = ($genreScores[$genre] ?? 0) + $weight;
                }
            }

            if ($view->card->director) {
                $directorScores[$view->card->director] = ($directorScores[$view->card->director] ?? 0) + $weight;
            }

            foreach ($actors as $actor) {
                $actor = trim($actor);
                if ($actor) {
                    $actorScores[$actor] = ($actorScores[$actor] ?? 0) + $weight;
                }
            }

            $totalRating += $rating;
            $count++;
        }

        // Нормализация жанров (на максимум)
        $maxGenre = max($genreScores ?: [0]);
        if ($maxGenre > 0) {
            foreach ($genreScores as $key => $value) {
                $genreScores[$key] = round($value / $maxGenre, 2);
            }
        }

        // Нормализация режиссёров и актёров
        $maxDirector = max($directorScores ?: [0]);
        if ($maxDirector > 0) {
            foreach ($directorScores as $key => $value) {
                $directorScores[$key] = round($value / $maxDirector, 2);
            }
        }

        $maxActor = max($actorScores ?: [0]);
        if ($maxActor > 0) {
            foreach ($actorScores as $key => $value) {
                $actorScores[$key] = round($value / $maxActor, 2);
            }
        }

        return [
            'genres' => $genreScores,
            'directors' => $directorScores,
            'actors' => $actorScores,
            'average_rating' => $count ? round($totalRating / $count, 1) : 0,
        ];
    }

    // Отношения
    public function cardViews()
    {
        return $this->hasMany(CardView::class);
    }

}
