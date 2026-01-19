<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class RecommendationRule extends Model
{
    protected $fillable = ['condition', 'action', 'explanation', 'weight', 'priority', 'is_active'];
}
