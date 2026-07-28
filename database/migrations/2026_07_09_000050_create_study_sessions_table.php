<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('study_sessions', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->foreignId('deck_id')->nullable()->constrained()->nullOnDelete();
            $table->unsignedInteger('cards_reviewed')->default(0);
            $table->date('session_date');
            $table->timestamps();

            $table->index(['user_id', 'session_date']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('study_sessions');
    }
};
