<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Card;
use App\Models\Deck;
use App\Models\Review;
use App\Models\StudySession;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Carbon;

class AdminUserController extends Controller
{
    /**
     * Platform-wide totals for the admin dashboard header.
     */
    public function overview()
    {
        return response()->json([
            'total_users' => User::count(),
            'total_students' => User::role('student')->count(),
            'total_admins' => User::role('admin')->count(),
            'total_decks' => Deck::count(),
            'total_cards' => Card::count(),
            'total_reviews' => Review::count(),
            'reviews_today' => Review::whereDate('reviewed_at', Carbon::today())->count(),
            'active_today' => StudySession::whereDate('session_date', Carbon::today())->distinct('user_id')->count('user_id'),
        ]);
    }

    /**
     * List every user account with role and basic activity stats, per
     * proposal 2.2 "Admin — ... view and manage all user accounts".
     */
    public function index()
    {
        $users = User::with('roles:id,name')->orderByDesc('created_at')->get();

        $report = $users->map(function ($user) {
            $totalReviews = Review::where('user_id', $user->id)->count();

            return [
                'id' => $user->id,
                'name' => $user->name,
                'username' => $user->username,
                'email' => $user->email,
                'role' => $user->roles->first()?->name,
                'email_verified' => (bool) $user->email_verified,
                'total_reviews' => $totalReviews,
                'joined_at' => $user->created_at?->toDateString(),
            ];
        });

        return response()->json($report->values());
    }

    /**
     * Promote/demote a user between student and admin.
     */
    public function updateRole(Request $request, User $user)
    {
        $validated = $request->validate([
            'role' => ['required', 'in:student,admin'],
        ]);

        if ($user->id === $request->user()->id) {
            return response()->json(['message' => 'You cannot change your own role.'], 422);
        }

        $user->syncRoles([$validated['role']]);

        return response()->json(['message' => 'Role updated.', 'role' => $validated['role']]);
    }

    /**
     * Remove a user account entirely.
     */
    public function destroy(Request $request, User $user)
    {
        if ($user->id === $request->user()->id) {
            return response()->json(['message' => 'You cannot delete your own account.'], 422);
        }

        if ($user->hasRole('admin') && User::role('admin')->count() <= 1) {
            return response()->json(['message' => 'Cannot delete the last remaining admin.'], 422);
        }

        $user->delete();

        return response()->json(status: 204);
    }
}
