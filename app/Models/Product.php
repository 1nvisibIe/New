<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;


class Product extends Model
{
    public function brand():BelongsTo{
        return $this->BelongsTo(Brand::class,'brand_id','id');
    }

    public function category(): BelongsToMany
    {
        return $this->BelongsToMany(Category::class);
    }

    public function images(): HasMany
    {
        return $this->hasMany(ProductImage::class,'product_id','id')->orderBy('sort_order');
    }

    public function mainImage(): HasOne
    {
        return $this->hasOne(ProductImage::class,'product_id','id')->where('is_main', 1);
    }

    public function attributes():BelongsToMany
    {
        return $this->belongsToMany(Attribute::class, 'product_attribute_values', 'product_id', 'attribute_id')
            ->withPivot('attribute_value_id', 'custom_value')
            ->orderBy('sort_order');
    }

    public function attributeValues():BelongsToMany
    {
        return $this->belongsToMany(AttributeValue::class, 'product_attribute_values', 'product_id', 'attribute_value_id');
    }

}
