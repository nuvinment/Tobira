<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Card extends Model
{
    use HasFactory;

    protected $fillable = [
        'deck_id',
        'front_text',
        'back_text',
        'furigana',
        'keigo_form',
        'context_sentence',
        'audio_path',
    ];

    public function deck(): BelongsTo
    {
        return $this->belongsTo(Deck::class);
    }

    public function reviews(): HasMany
    {
        return $this->hasMany(Review::class);
    }

    /**
     * The most recent review for a given user, or null if never studied.
     */
    public function latestReviewFor(int $userId): ?Review
    {
        return $this->reviews()
            ->where('user_id', $userId)
            ->latest('reviewed_at')
            ->first();
    }
}
