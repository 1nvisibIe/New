<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('category_attribute', function (Blueprint $table) {

            $table->unsignedInteger('category_id');
            $table->unsignedInteger('attribute_id');
            $table->unsignedSmallInteger('sort_order')->default(0); // порядок в категории

            $table->unique(['category_id', 'attribute_id']); // одна характеристика на категорию
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('category_attribute');
    }
};
