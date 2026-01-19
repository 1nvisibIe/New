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
        $totalRating = 0;
        $count = 0;

        foreach ($views as $view) {
            if (!$view->card) continue;

            $genres = explode(',', $view->card->genres ?? '');
            $rating = $view->rating ?? 5;  // если нет оценки — нейтрально

            // Нормализованный вес: >5 = положительный, <5 = отрицательный
            $normalizedWeight = ($rating - 5) / 5;  // 10 → +1, 5 → 0, 1 → -0.8

            foreach ($genres as $genre) {
                $genre = trim($genre);
                if ($genre) {
                    $genreScores[$genre] = ($genreScores[$genre] ?? 0) + ($rating / 5 - 1);  // 10 → +1, 5 → 0, 1 → -0.8
                }
            }

            if ($view->card->director) {
                // В цикле foreach
                $directorScores[$view->card->director] = ($directorScores[$view->card->director] ?? 0) + ($normalizedWeight * 1.5);  // ← режиссёр важнее жанра
            }

            $totalRating += $rating;
            $count++;
        }

        // Нормализация жанров: сдвигаем к положительному диапазону (0–1)
        $minGenre = min($genreScores ?: [0]);
        $maxGenre = max($genreScores ?: [0]);
        $rangeGenre = $maxGenre - $minGenre;
        if ($rangeGenre > 0) {
            foreach ($genreScores as $key => $value) {
                $genreScores[$key] = round(($value - $minGenre) / $rangeGenre, 2);
            }
        }

        // То же для режиссёров
        $minDirector = min($directorScores ?: [0]);
        $maxDirector = max($directorScores ?: [0]);
        $rangeDirector = $maxDirector - $minDirector;
        if ($rangeDirector > 0) {
            foreach ($directorScores as $key => $value) {
                $directorScores[$key] = round(($value - $minDirector) / $rangeDirector, 2);
            }
        }

        return [
            'genres' => $genreScores,
            'directors' => $directorScores,
            'average_rating' => $count ? round($totalRating / $count, 1) : 0,
        ];
    }

    // Отношения
    public function cardViews()
    {
        return $this->hasMany(CardView::class);
    }

}
