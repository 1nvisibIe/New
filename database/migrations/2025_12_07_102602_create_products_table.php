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
            $table->unsignedInteger('group_id')->default(0);
            $table->unsignedInteger('category_id')->nullable();
            $table->string('sku', 100)->unique();
            $table->string('name', 255);
            $table->string('slug', 255)->unique();

            $table->unsignedInteger('stock')->default(0);
            $table->decimal('price', 12, 2);

            $table->timestamps();
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
