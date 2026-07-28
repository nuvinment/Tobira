<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Card;
use App\Models\Deck;
use Illuminate\Http\Request;

class QuizController extends Controller
{
    /**
     * Cards the current user has already studied at least once, optionally
     * scoped to one deck. Used to build a self-test quiz over material
     * they've completed rather than brand-new content.
     */
    public function cards(Request $request)
    {
        $user = $request->user();
        $deckId = $request->integer('deck_id') ?: null;

        $query = Card::query()
            ->whereHas('deck', function ($q) use ($user) {
                $q->where('is_public', true)->orWhere('user_id', $user->id);
            })
            ->whereHas('reviews', function ($q) use ($user) {
                $q->where('user_id', $user->id);
            });

        if ($deckId) {
            $deck = Deck::findOrFail($deckId);

            if (! $deck->is_public && $deck->user_id !== $user->id && ! $user->hasRole('admin')) {
                abort(403, 'You do not have access to this deck.');
            }

            $query->where('deck_id', $deckId);
        }

        $cards = $query->with('deck:id,title,scenario_tag')
            ->inRandomOrder()
            ->limit(20)
            ->get(['id', 'deck_id', 'front_text', 'back_text', 'furigana']);

        return response()->json($cards);
    }
}
