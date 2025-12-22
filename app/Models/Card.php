<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Card extends Model
{
    protected $fillable = ['product_id', 'name', 'price',
        'old_price','stock','is_active','description'];

    public function product(): BelongsTo
    {
        return $this->belongsTo(Product::class,'product_id','id');
    }


}
