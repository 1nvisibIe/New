<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Category extends Model
{
    public function children():HasMany
    {
        return $this->hasMany(Category::class, 'parent_id','id');
    }

    public function parent():BelongsTo
    {
        return $this->belongsTo(Category::class, 'parent_id','id');
    }

    public function products():BelongstoMany
    {
        return $this->belongsToMany(Product::class);
    }
}
