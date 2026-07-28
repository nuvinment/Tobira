<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

class OnboardingController extends Controller
{
    /**
     * Complete the profile after OTP verification. Requires auth:sanctum —
     * the user already has a token from OtpController::verify by this point.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'birthday' => ['required', 'date', 'before:-13 years'],
            'study_purpose' => ['required', 'in:Career,JLPT Exam,Travel,Academic,General Interest'],
            'level' => ['required', 'in:Beginner,Intermediate,Advanced'],
        ]);

        $user = $request->user();
        $user->update($validated);

        return response()->json(['user' => $user]);
    }
}
