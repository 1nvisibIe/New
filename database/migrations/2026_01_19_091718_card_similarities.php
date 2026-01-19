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
        Schema::create('card_similarities', function (Blueprint $table) {
            $table->id();
            $table->foreignId('card_id')->constrained('cards')->onDelete('cascade');
            $table->foreignId('similar_card_id')->constrained('cards')->onDelete('cascade');
            $table->string('relation_type', 50)->default('similar'); // similar, same_genre, same_director и т.д.
            $table->decimal('strength', 4, 3)->default(0.500);
            $table->timestamps();

            $table->unique(['card_id', 'similar_card_id']);
            $table->index(['card_id', 'relation_type']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('card_similarities');
    }
};
