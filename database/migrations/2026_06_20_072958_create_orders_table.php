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
        Schema::create('orders', function (Blueprint $table) {
            $table->increments('id');

            // Связь с пользователем — кто оформил заказ
            $table->unsignedBigInteger('user_id');

            // Уникальный номер заказа — буквы и цифры, видят и продавец и покупатель
            $table->string('order_number', 20)->unique();

            // Данные покупателя — снэпшот на момент заказа
            // могли быть изменены вручную при оформлении, отличаться от профиля
            $table->string('customer_name', 150);
            $table->string('customer_phone', 20);
            $table->string('customer_email', 150)->nullable();

            // Адрес доставки — пункт выдачи СДЭК
            $table->string('delivery_address', 500);

            $table->text('comment')->nullable();

            // Статус заказа
            $table->string('status', 30)->default('new');
            // new, processing, shipped, completed, cancelled

            // Стоимость доставки — отдельно для расчёта прибыли
            $table->decimal('delivery_cost', 10, 2)->default(0);

            // Итоговая сумма заказа (сумма всех order_items + доставка)
            $table->decimal('total_amount', 12, 2);

            $table->timestamps();

            $table->index('status');
            $table->index('order_number');
            $table->index('user_id');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('orders');
    }
};
