<?php

namespace App\Services;

use App\Models\Card;
use App\Models\Review;
use Carbon\Carbon;

/**
 * Implements the SM-2 spaced repetition algorithm (Wozniak, 1990) as
 * described in Tobira's project proposal, section 3.2.
 *
 * Rating scale: Again = 0, Hard = 1, Good = 2, Easy = 3.
 */
class ReviewSchedulerService
{
    /** Ease factor never drops below this floor. */
    public const MIN_EASE_FACTOR = 1.30;

    /** Starting values for a card that has never been reviewed. */
    public const DEFAULT_EASE_FACTOR = 2.50;
    public const DEFAULT_INTERVAL_DAYS = 1;

    /**
     * Record a new review event for the given user + card and return the
     * created Review row (which holds the freshly calculated interval,
     * ease factor, and next_review_at).
     */
    public function schedule(int $userId, Card $card, int $rating): Review
    {
        [$previousInterval, $previousEase] = $this->previousState($userId, $card->id);

        [$newInterval, $newEase] = $this->calculate($rating, $previousInterval, $previousEase);

        $now = Carbon::now();

        return Review::create([
            'user_id' => $userId,
            'card_id' => $card->id,
            'rating' => $rating,
            'interval_days' => $newInterval,
            'ease_factor' => $newEase,
            'reviewed_at' => $now,
            'next_review_at' => $now->copy()->addDays($newInterval),
        ]);
    }

    /**
     * Pure SM-2 calculation, isolated for unit testing with known
     * input/output pairs (see proposal Appendix E).
     *
     * @return array{0: int, 1: float} [newIntervalDays, newEaseFactor]
     */
    public function calculate(int $rating, int $previousIntervalDays, float $previousEaseFactor): array
    {
        switch ($rating) {
            case 0: // Again
                $newEase = $previousEaseFactor - 0.20;
                $newInterval = 1;
                break;

            case 1: // Hard
                $newEase = $previousEaseFactor - 0.15;
                $newInterval = (int) round($previousIntervalDays * 1.2);
                break;

            case 2: // Good
                $newEase = $previousEaseFactor;
                $newInterval = (int) round($previousIntervalDays * $previousEaseFactor);
                break;

            case 3: // Easy
                $newEase = $previousEaseFactor + 0.15;
                $newInterval = (int) round($previousIntervalDays * ($previousEaseFactor + 0.10));
                break;

            default:
                throw new \InvalidArgumentException("Invalid rating [{$rating}]. Must be 0-3.");
        }

        $newEase = max($newEase, self::MIN_EASE_FACTOR);
        $newInterval = max($newInterval, 1);

        return [$newInterval, round($newEase, 2)];
    }

    /**
     * Look up the card's most recent scheduling state for this user,
     * falling back to SM-2 defaults if it has never been reviewed.
     *
     * @return array{0: int, 1: float} [intervalDays, easeFactor]
     */
    protected function previousState(int $userId, int $cardId): array
    {
        $latest = Review::where('user_id', $userId)
            ->where('card_id', $cardId)
            ->latest('reviewed_at')
            ->first();

        if (! $latest) {
            return [self::DEFAULT_INTERVAL_DAYS, self::DEFAULT_EASE_FACTOR];
        }

        return [$latest->interval_days, (float) $latest->ease_factor];
    }
}
