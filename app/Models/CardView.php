<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class CardView extends Model
{
    protected $fillable = ['user_id', 'card_id', 'rating', 'viewed_at'];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function card()
    {
        return $this->belongsTo(Card::class);
    }
}
