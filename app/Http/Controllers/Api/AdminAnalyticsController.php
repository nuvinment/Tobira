<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Deck;
use App\Models\Review;
use App\Models\StudySession;
use App\Models\User;
use Illuminate\Support\Carbon;

class AdminAnalyticsController extends Controller
{
    /**
     * Unique students with at least one study session per day, last 30 days.
     */
    public function dailyActiveUsers()
    {
        $since = Carbon::today()->subDays(29)->toDateString();

        $rows = StudySession::where('session_date', '>=', $since)
            ->selectRaw('session_date, COUNT(DISTINCT user_id) as active_users')
            ->groupBy('session_date')
            ->orderBy('session_date')
            ->get();

        return response()->json($rows->map(fn ($r) => [
            'date' => Carbon::parse($r->session_date)->toDateString(),
            'active_users' => (int) $r->active_users,
        ]));
    }

    /**
     * Per-deck engagement: total reviews, average rating, and the
     * most-failed cards (highest count of "Again" ratings) in that deck.
     */
    public function deckEngagement()
    {
        $decks = Deck::withCount('cards')->get();

        $report = $decks->map(function ($deck) {
            $cardIds = $deck->cards()->pluck('id');

            $reviews = Review::whereIn('card_id', $cardIds);
            $totalReviews = (clone $reviews)->count();
            $avgRating = $totalReviews > 0 ? round((clone $reviews)->avg('rating'), 2) : null;

            $mostFailed = Review::whereIn('card_id', $cardIds)
                ->where('rating', 0)
                ->selectRaw('card_id, COUNT(*) as fail_count')
                ->groupBy('card_id')
                ->orderByDesc('fail_count')
                ->limit(5)
                ->with('card:id,front_text,back_text')
                ->get()
                ->map(fn ($row) => [
                    'card_id' => $row->card_id,
                    'front_text' => $row->card?->front_text,
                    'back_text' => $row->card?->back_text,
                    'fail_count' => $row->fail_count,
                ]);

            return [
                'deck_id' => $deck->id,
                'title' => $deck->title,
                'scenario_tag' => $deck->scenario_tag,
                'cards_count' => $deck->cards_count,
                'total_reviews' => $totalReviews,
                'average_rating' => $avgRating,
                'most_failed_cards' => $mostFailed,
            ];
        });

        return response()->json($report->values());
    }

    /**
     * Per-student summary: streak, total cards reviewed, average mastery %.
     */
    public function userProgress()
    {
        $students = User::role('student')->get();

        $report = $students->map(function ($user) {
            $latestReviewSub = Review::selectRaw('MAX(id) as id')
                ->where('user_id', $user->id)
                ->groupBy('card_id');

            $totalStudied = Review::whereIn('id', $latestReviewSub)->count();
            $mastered = Review::whereIn('id', $latestReviewSub)->where('rating', '>=', 2)->count();
            $masteryPct = $totalStudied > 0 ? round(($mastered / $totalStudied) * 100, 1) : 0.0;

            $totalReviews = Review::where('user_id', $user->id)->count();

            return [
                'user_id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'streak_days' => $this->streakDays($user->id),
                'total_cards_reviewed' => $totalReviews,
                'mastery_percentage' => $masteryPct,
            ];
        });

        return response()->json($report->values());
    }

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
                continue;
            } else {
                break;
            }
        }

        return $streak;
    }
}
