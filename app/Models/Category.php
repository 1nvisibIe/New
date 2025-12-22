<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Category extends Model
{


Protected $fillable = ['name','slug','parent_id'];

    public function children():HasMany
    {
        return $this->hasMany(Category::class, 'parent_id','id');
    }

    public function parent():BelongsTo
    {
        return $this->belongsTo(Category::class, 'parent_id','id');
    }

    public function products():HasMany
    {
        return $this->HasMany(Product::class,'category_id','id');
    }

    public function attributes():BelongsToMany
    {
        return $this->belongsToMany(Attribute::class, 'category_attribute','category_id','attribute_id')
            ->withPivot('sort_order')
            ->orderBy('sort_order');
    }
}
