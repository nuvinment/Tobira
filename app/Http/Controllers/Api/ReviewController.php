<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Card;
use App\Models\Review;
use App\Models\StudySession;
use App\Services\ReviewSchedulerService;
use Illuminate\Http\Request;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\DB;

class ReviewController extends Controller
{
    public function __construct(protected ReviewSchedulerService $scheduler)
    {
    }

    /**
     * Cards due for review right now for the current user, optionally
     * scoped to a single deck. A card with no review history is
     * considered immediately due (new card).
     */
    public function due(Request $request)
    {
        $user = $request->user();
        $deckId = $request->integer('deck_id') ?: null;

        $latestReviewSub = Review::selectRaw('MAX(id) as id')
            ->where('user_id', $user->id)
            ->groupBy('card_id');

        $reviewedCardIds = Review::whereIn('id', $latestReviewSub)
            ->where('next_review_at', '>', Carbon::now())
            ->pluck('card_id');

        $query = Card::query()
            ->whereHas('deck', function ($q) use ($user) {
                $q->where('is_public', true)->orWhere('user_id', $user->id);
            })
            ->whereNotIn('id', $reviewedCardIds);

        if ($deckId) {
            $query->where('deck_id', $deckId);
        }

        return $query->with('deck:id,title,scenario_tag')->limit(50)->get();
    }

    /**
     * Submit a self-rating (0-3) for a card. Runs the SM-2 algorithm,
     * persists the resulting Review row, and bumps today's study session
     * counter for streak/heatmap tracking.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'card_id' => ['required', 'integer', 'exists:cards,id'],
            'rating' => ['required', 'integer', 'min:0', 'max:3'],
        ]);

        $card = Card::with('deck')->findOrFail($validated['card_id']);
        $user = $request->user();

        if (! $card->deck->is_public && $card->deck->user_id !== $user->id && ! $user->hasRole('admin')) {
            abort(403, 'You do not have access to this card.');
        }

        $review = DB::transaction(function () use ($user, $card, $validated) {
            $review = $this->scheduler->schedule($user->id, $card, $validated['rating']);

            $session = StudySession::firstOrNew([
                'user_id' => $user->id,
                'deck_id' => $card->deck_id,
                'session_date' => Carbon::today()->toDateString(),
            ]);
            $session->cards_reviewed = ($session->cards_reviewed ?? 0) + 1;
            $session->save();

            return $review;
        });

        return response()->json($review, 201);
    }

    /**
     * Personal review history: a log of past study sessions with date,
     * deck name, cards reviewed, and average rating given — per proposal
     * Appendix D "Student: Personal review history".
     */
    public function history(Request $request)
    {
        $reviews = Review::where('user_id', $request->user()->id)
            ->with('card.deck:id,title')
            ->orderByDesc('reviewed_at')
            ->get();

        $grouped = $reviews
            ->groupBy(fn ($r) => $r->reviewed_at?->toDateString().'|'.($r->card->deck_id ?? 0))
            ->map(function ($group) {
                $first = $group->first();

                return [
                    'date' => $first->reviewed_at?->toDateString(),
                    'deck_id' => $first->card->deck_id ?? null,
                    'deck_title' => $first->card->deck->title ?? 'Unknown Deck',
                    'cards_reviewed' => $group->count(),
                    'average_rating' => round($group->avg('rating'), 2),
                ];
            })
            ->values()
            ->sortByDesc('date')
            ->values();

        return response()->json($grouped);
    }
}
