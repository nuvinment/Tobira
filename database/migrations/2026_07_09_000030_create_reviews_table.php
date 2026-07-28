<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('reviews', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->foreignId('card_id')->constrained()->cascadeOnDelete();
            $table->unsignedTinyInteger('rating'); // 0=Again,1=Hard,2=Good,3=Easy
            $table->unsignedInteger('interval_days')->default(1);
            $table->decimal('ease_factor', 4, 2)->default(2.50);
            $table->timestamp('next_review_at')->nullable();
            $table->timestamp('reviewed_at')->nullable();
            $table->timestamps();

            // History log: one row per review event, not per card.
            // "Currently due" state is derived from each user+card's most recent row.
            $table->index(['user_id', 'card_id', 'reviewed_at']);
            $table->index(['user_id', 'next_review_at']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('reviews');
    }
};
