<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Attribute extends Model
{
    public function attributeValues(): HasMany
    {
        return $this->hasMany(AttributeValue::class, 'attribute_id','id')->orderBy('sort_order');
    }

    public function products():BelongsToMany
    {
        return $this->belongsToMany(Product::class, 'product_attribute_values', 'attribute_id', 'product_id');
    }
}
