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
        Schema::create('order_items', function (Blueprint $table) {
            $table->increments('id');

            $table->unsignedInteger('order_id');
            $table->unsignedInteger('card_id')->nullable();
            // nullable — если карточку потом удалят, заказ не сломается

            // Название товара на момент заказа — фиксируем
            // вдруг карточку переименуют или удалят
            $table->string('product_name', 170);

            $table->unsignedInteger('quantity')->default(1);

            // Цена продажи ЗА ЕДИНИЦУ на момент заказа (из cards.price)
            $table->decimal('price', 12, 2);

            // Себестоимость ЗА ЕДИНИЦУ на момент заказа (из products.price)
            $table->decimal('cost_price', 12, 2);

            $table->timestamps();

            $table->index('order_id');
            $table->index('card_id');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('order_items');
    }
};
