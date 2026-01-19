<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class CardSimilarity extends Model
{
    protected $fillable = ['card_id', 'similar_card_id', 'relation_type', 'strength'];

    public function card()
    {
        return $this->belongsTo(Card::class, 'card_id');
    }

    public function similarCard()
    {
        return $this->belongsTo(Card::class, 'similar_card_id');
    }
}
