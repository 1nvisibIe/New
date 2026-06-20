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
        // 1. Products → Categories
        Schema::table('products', function (Blueprint $table) {
            $table->foreign('category_id', 'fk_products_category_id')
                ->references('id')
                ->on('categories')
                ->onDelete('restrict')
                ->onUpdate('cascade');
        });

        // 2. Cards → Products
        Schema::table('cards', function (Blueprint $table) {
            $table->foreign('product_id', 'fk_cards_product_id')
                ->references('id')
                ->on('products')
                ->onDelete('cascade')
                ->onUpdate('cascade');
        });

        // 3. Product Images → Products
        Schema::table('product_images', function (Blueprint $table) {
            $table->foreign('product_id', 'fk_product_images_product_id')
                ->references('id')
                ->on('products')
                ->onDelete('cascade')
                ->onUpdate('cascade');
        });



        // 5. Categories (self-reference) → Categories (parent_id)
        Schema::table('categories', function (Blueprint $table) {
            $table->foreign('parent_id', 'fk_categories_parent_id')
                ->references('id')
                ->on('categories')
                ->onDelete('set null')        // или 'set null', если хочешь
                ->onUpdate('cascade')
                ->nullable();
        });

        // 6. Pivot: product_attribute_values
        Schema::table('product_attribute_values', function (Blueprint $table) {
            $table->foreign('product_id', 'fk_pav_product_id')
                ->references('id')
                ->on('products')
                ->onDelete('cascade')
                ->onUpdate('cascade');

            $table->foreign('attribute_id', 'fk_pav_attribute_id')
                ->references('id')
                ->on('attributes')
                ->onDelete('cascade')
                ->onUpdate('cascade');


        });

        // 7. Pivot: category_attribute
        Schema::table('category_attribute', function (Blueprint $table) {
            $table->foreign('category_id', 'fk_ca_category_id')
                ->references('id')
                ->on('categories')
                ->onDelete('cascade')
                ->onUpdate('cascade');

            $table->foreign('attribute_id', 'fk_ca_attribute_id')
                ->references('id')
                ->on('attributes')
                ->onDelete('cascade')
                ->onUpdate('cascade');
        });
    }

    public function down(): void
    {
        // Удаляем все foreign keys в обратном порядке
        Schema::table('product_attribute_values', function (Blueprint $table) {
            $table->dropForeign('fk_pav_product_id');
            $table->dropForeign('fk_pav_attribute_id');
            $table->dropForeign('fk_pav_attribute_value_id');
        });

        Schema::table('category_attribute', function (Blueprint $table) {
            $table->dropForeign('fk_ca_category_id');
            $table->dropForeign('fk_ca_attribute_id');
        });

        Schema::table('attribute_values', function (Blueprint $table) {
            $table->dropForeign('fk_attribute_values_attribute_id');
        });

        Schema::table('product_images', function (Blueprint $table) {
            $table->dropForeign('fk_product_images_product_id');
        });

        Schema::table('cards', function (Blueprint $table) {
            $table->dropForeign('fk_cards_product_id');
        });

        Schema::table('products', function (Blueprint $table) {
            $table->dropForeign('fk_products_category_id');
        });

        Schema::table('categories', function (Blueprint $table) {
            $table->dropForeign('fk_categories_parent_id');
        });
    }
};
