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
        Schema::create('products', function (Blueprint $table) {
            $table->increments('id');
            $table->string('sku', 100)->unique();
            $table->string('name', 170);
            $table->string('slug', 170)->unique();
            $table->longText('description')->nullable();
            $table->decimal('price', 12, 2);
            $table->decimal('old_price', 12, 2)->nullable();
            $table->integer('stock')->default(0);
            $table->unsignedInteger('brand_id')->nullable();
            $table->boolean('is_active')->default(1);
            $table->integer('views')->default(0)->unsigned();

            $table->timestamps();

            $table->index('brand_id');
            $table->index('is_active');
            $table->index('price');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('products');
    }
};
