<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Deck;
use Illuminate\Http\Request;

class DeckController extends Controller
{
    /**
     * List decks visible to the current user: their own decks (private
     * and public) plus everyone else's public decks. Admins see all decks.
     */
    public function index(Request $request)
    {
        $user = $request->user();

        $query = Deck::query()->with('owner:id,name');

        if (! $user->hasRole('admin')) {
            $query->where(function ($q) use ($user) {
                $q->where('is_public', true)->orWhere('user_id', $user->id);
            });
        }

        if ($request->filled('scenario_tag')) {
            $query->where('scenario_tag', $request->string('scenario_tag'));
        }

        if ($request->filled('jlpt_level')) {
            $query->where('jlpt_level', $request->string('jlpt_level'));
        }

        return $query->withCount('cards')->latest()->paginate(20);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => ['required', 'string', 'max:255'],
            'scenario_tag' => ['nullable', 'string', 'max:100'],
            'jlpt_level' => ['nullable', 'string', 'max:10'],
            'is_public' => ['sometimes', 'boolean'],
            'description' => ['nullable', 'string', 'max:2000'],
        ]);

        $user = $request->user();

        // Only admins may publish a deck as public on creation.
        $validated['is_public'] = $user->hasRole('admin') && ($validated['is_public'] ?? false);
        $validated['user_id'] = $user->id;

        $deck = Deck::create($validated);

        return response()->json($deck, 201);
    }

    public function show(Request $request, Deck $deck)
    {
        $this->authorizeView($request, $deck);

        return $deck->load('cards');
    }

    public function update(Request $request, Deck $deck)
    {
        $this->authorizeOwnerOrAdmin($request, $deck);

        $validated = $request->validate([
            'title' => ['sometimes', 'string', 'max:255'],
            'scenario_tag' => ['nullable', 'string', 'max:100'],
            'jlpt_level' => ['nullable', 'string', 'max:10'],
            'is_public' => ['sometimes', 'boolean'],
            'description' => ['nullable', 'string', 'max:2000'],
        ]);

        if (isset($validated['is_public']) && ! $request->user()->hasRole('admin')) {
            unset($validated['is_public']); // students cannot publish decks publicly
        }

        $deck->update($validated);

        return $deck;
    }

    public function destroy(Request $request, Deck $deck)
    {
        $this->authorizeOwnerOrAdmin($request, $deck);

        $deck->delete();

        return response()->json(status: 204);
    }

    protected function authorizeView(Request $request, Deck $deck): void
    {
        $user = $request->user();

        if (! $deck->is_public && $deck->user_id !== $user->id && ! $user->hasRole('admin')) {
            abort(403, 'You do not have access to this deck.');
        }
    }

    protected function authorizeOwnerOrAdmin(Request $request, Deck $deck): void
    {
        $user = $request->user();

        if ($deck->user_id !== $user->id && ! $user->hasRole('admin')) {
            abort(403, 'You do not have permission to modify this deck.');
        }
    }
}
