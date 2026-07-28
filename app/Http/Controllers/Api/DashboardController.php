<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Card;
use App\Models\Review;
use App\Models\StudySession;
use Illuminate\Http\Request;
use Illuminate\Support\Carbon;

class DashboardController extends Controller
{
    public function student(Request $request)
    {
        $user = $request->user();

        return response()->json([
            'due_today' => $this->dueCount($user->id),
            'streak_days' => $this->streakDays($user->id),
            'mastery_percentage' => $this->masteryPercentage($user->id),
            'activity_heatmap' => $this->heatmap($user->id),
        ]);
    }

    protected function dueCount(int $userId): int
    {
        $latestReviewSub = Review::selectRaw('MAX(id) as id')
            ->where('user_id', $userId)
            ->groupBy('card_id');

        $reviewedCardIdsNotDue = Review::whereIn('id', $latestReviewSub)
            ->where('next_review_at', '>', Carbon::now())
            ->pluck('card_id');

        return Card::whereHas('deck', function ($q) use ($userId) {
            $q->where('is_public', true)->orWhere('user_id', $userId);
        })->whereNotIn('id', $reviewedCardIdsNotDue)->count();
    }

    /**
     * Consecutive days (counting back from today) with at least one
     * study session logged.
     */
    protected function streakDays(int $userId): int
    {
        $sessionDates = StudySession::where('user_id', $userId)
            ->orderByDesc('session_date')
            ->pluck('session_date')
            ->map(fn ($d) => Carbon::parse($d)->toDateString())
            ->unique()
            ->values();

        $streak = 0;
        $cursor = Carbon::today();

        foreach ($sessionDates as $date) {
            if ($date === $cursor->toDateString()) {
                $streak++;
                $cursor->subDay();
            } elseif ($date === $cursor->copy()->addDay()->toDateString()) {
                continue; // already counted today, skip duplicates
            } else {
                break;
            }
        }

        return $streak;
    }

    protected function masteryPercentage(int $userId): float
    {
        $latestReviewSub = Review::selectRaw('MAX(id) as id')
            ->where('user_id', $userId)
            ->groupBy('card_id');

        $totalStudied = Review::whereIn('id', $latestReviewSub)->count();

        if ($totalStudied === 0) {
            return 0.0;
        }

        // "Mastered" = last rating was Good or Easy (2 or 3).
        $mastered = Review::whereIn('id', $latestReviewSub)->where('rating', '>=', 2)->count();

        return round(($mastered / $totalStudied) * 100, 1);
    }

    protected function heatmap(int $userId): array
    {
        $since = Carbon::today()->subDays(29)->toDateString();

        return StudySession::where('user_id', $userId)
            ->where('session_date', '>=', $since)
            ->selectRaw('session_date, SUM(cards_reviewed) as total')
            ->groupBy('session_date')
            ->orderBy('session_date')
            ->get()
            ->map(fn ($row) => [
                'date' => Carbon::parse($row->session_date)->toDateString(),
                'count' => (int) $row->total,
            ])
            ->all();
    }
}
