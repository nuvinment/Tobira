<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Mail\OtpMail;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Mail;

class OtpController extends Controller
{
    /**
     * Verify the OTP for a freshly registered (or re-verifying) user.
     * On success, this is the moment the account actually becomes usable:
     * we mark it verified and issue the Sanctum token here.
     */
    public function verify(Request $request)
    {
        $validated = $request->validate([
            'user_id' => ['required', 'integer', 'exists:users,id'],
            'otp' => ['required', 'digits:6'],
        ]);

        $user = User::findOrFail($validated['user_id']);

        if ($user->otp !== $validated['otp']) {
            return response()->json(['message' => 'Invalid verification code.'], 422);
        }

        if (! $user->otp_expires_at || now()->isAfter($user->otp_expires_at)) {
            return response()->json(['message' => 'This code has expired. Please request a new one.'], 422);
        }

        $user->update([
            'email_verified' => true,
            'email_verified_at' => now(),
            'otp' => null,
            'otp_expires_at' => null,
        ]);

        $token = $user->createToken('tobira-spa')->plainTextToken;

        return response()->json([
            'user' => $user,
            'token' => $token,
            'needs_onboarding' => is_null($user->birthday),
        ]);
    }

    /**
     * Issue a fresh OTP for a user who hasn't verified yet.
     */
    public function resend(Request $request)
    {
        $validated = $request->validate([
            'user_id' => ['required', 'integer', 'exists:users,id'],
        ]);

        $user = User::findOrFail($validated['user_id']);

        if ($user->email_verified) {
            return response()->json(['message' => 'This account is already verified.'], 422);
        }

        $otp = str_pad((string) random_int(0, 999999), 6, '0', STR_PAD_LEFT);

        $user->update([
            'otp' => $otp,
            'otp_expires_at' => now()->addMinutes(10),
        ]);

        Mail::to($user->email)->send(new OtpMail($otp, $user->name));

        return response()->json(['message' => 'A new verification code has been sent.']);
    }
}
