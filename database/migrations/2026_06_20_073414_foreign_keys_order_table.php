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
        Schema::table('orders', function (Blueprint $table) {
            $table->foreign('user_id', 'fk_orders_user_id')
                ->references('id')
                ->on('users')
                ->onDelete('restrict') // нельзя удалить юзера если есть заказы
                ->onUpdate('cascade');
        });

        Schema::table('order_items', function (Blueprint $table) {
            $table->foreign('order_id', 'fk_order_items_order_id')
                ->references('id')
                ->on('orders')
                ->onDelete('cascade') // удалили заказ — удалились его позиции
                ->onUpdate('cascade');

            $table->foreign('card_id', 'fk_order_items_card_id')
                ->references('id')
                ->on('cards')
                ->onDelete('set null') // удалили карточку — позиция в заказе остаётся
                ->onUpdate('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('order_items', function (Blueprint $table) {
            $table->dropForeign('fk_order_items_order_id');
            $table->dropForeign('fk_order_items_card_id');
        });

        Schema::table('orders', function (Blueprint $table) {
            $table->dropForeign('fk_orders_user_id');
        });
    }
};
