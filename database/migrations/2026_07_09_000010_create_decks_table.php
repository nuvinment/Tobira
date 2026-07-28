<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('decks', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->string('title');
            $table->string('scenario_tag')->nullable(); // e.g. Job Interview, Client Meetings
            $table->string('jlpt_level')->nullable(); // e.g. N5-N1
            $table->boolean('is_public')->default(false);
            $table->text('description')->nullable();
            $table->timestamps();

            $table->index(['scenario_tag']);
            $table->index(['jlpt_level']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('decks');
    }
};
