<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Card extends Model
{
    protected $fillable = ['product_id', 'name', 'price',
        'old_price','stock','is_active','description','release_year','director','genres','imdb_rating'];

    public function product(): BelongsTo
    {
        return $this->belongsTo(Product::class,'product_id','id');
    }

    public function cardview(): HasMany
    {
        return $this->HasMany(CardView::class,'card_id','id');
    }
}
