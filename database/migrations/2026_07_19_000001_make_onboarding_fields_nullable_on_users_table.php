<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->date('birthday')->nullable()->change();
            $table->enum('study_purpose', [
                'Career',
                'JLPT Exam',
                'Travel',
                'Academic',
                'General Interest',
            ])->nullable()->change();
            $table->enum('level', [
                'Beginner',
                'Intermediate',
                'Advanced',
            ])->nullable()->change();
        });
    }

    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->date('birthday')->nullable(false)->change();
            $table->enum('study_purpose', [
                'Career',
                'JLPT Exam',
                'Travel',
                'Academic',
                'General Interest',
            ])->nullable(false)->change();
            $table->enum('level', [
                'Beginner',
                'Intermediate',
                'Advanced',
            ])->nullable(false)->change();
        });
    }
};
