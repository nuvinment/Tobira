<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('cards', function (Blueprint $table) {
            $table->id();
            $table->foreignId('deck_id')->constrained()->cascadeOnDelete();
            $table->string('front_text'); // Japanese term/phrase
            $table->string('back_text'); // English meaning
            $table->string('furigana')->nullable(); // hiragana reading
            $table->string('keigo_form')->nullable(); // sonkeigo / kenjougo / teineigo
            $table->text('context_sentence')->nullable();
            $table->string('audio_path')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('cards');
    }
};
