<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Attribute extends Model
{
    protected $fillable = ['name', 'slug', 'type', 'unit', 'is_filterable', 'sort_order'];
    public function products():BelongsToMany
    {
        return $this->belongsToMany(Product::class, 'product_attribute_values', 'attribute_id', 'product_id');
    }

    public function categories()
    {
        return $this->belongsToMany(Category::class, 'category_attribute', 'attribute_id','category_id');
    }
}
