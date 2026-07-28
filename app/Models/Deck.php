<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Deck extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'title',
        'scenario_tag',
        'jlpt_level',
        'is_public',
        'description',
    ];

    protected function casts(): array
    {
        return [
            'is_public' => 'boolean',
        ];
    }

    public function owner(): BelongsTo
    {
        return $this->belongsTo(User::class, 'user_id');
    }

    public function cards(): HasMany
    {
        return $this->hasMany(Card::class);
    }

    public function studySessions(): HasMany
    {
        return $this->hasMany(StudySession::class);
    }
}
