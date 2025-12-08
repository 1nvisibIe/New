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
        Schema::create('product_attribute_values', function (Blueprint $table) {

            $table->unsignedInteger('product_id');
            $table->unsignedInteger('attribute_id');
            $table->unsignedInteger('attribute_value_id')->nullable();
            $table->string('custom_value', 170)->nullable();
            $table->unsignedSmallInteger('sort_order')->default(0);

            $table->timestamps();

            $table->unique(['product_id', 'attribute_id']);
            $table->index('product_id');
            $table->index('attribute_id');
            $table->index('attribute_value_id');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('product_attribute_values');
    }
};
