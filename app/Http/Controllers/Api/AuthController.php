<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Mail\OtpMail;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Mail;

class AuthController extends Controller
{
    /**
     * Step 1 of registration: collect name/username/email/password only.
     * Creates an unverified user, emails a 6-digit OTP, and does NOT issue
     * a token yet — the user must verify via OtpController::verify first.
     */
    public function register(Request $request)
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'username' => ['required', 'string', 'max:255', 'alpha_dash', 'unique:users,username'],
            'email' => ['required', 'string', 'email', 'max:255', 'unique:users,email'],
            'password' => ['required', 'string', 'min:8', 'confirmed'],
        ]);

        $otp = str_pad((string) random_int(0, 999999), 6, '0', STR_PAD_LEFT);

        $user = User::create([
            'name' => $validated['name'],
            'username' => $validated['username'],
            'email' => $validated['email'],
            'password' => Hash::make($validated['password']),
            'otp' => $otp,
            'otp_expires_at' => now()->addMinutes(10),
            'email_verified' => false,
        ]);

        $user->assignRole('student');

        Mail::to($user->email)->send(new OtpMail($otp, $user->name));

        return response()->json([
            'message' => 'Registered. Please check your email for a verification code.',
            'user_id' => $user->id,
            'email' => $user->email,
        ], 201);
    }

    /**
     * Authenticate and issue a new API token. Accepts either the user's
     * email or username in the same field. Blocks unverified accounts,
     * pointing the SPA back to the OTP step instead.
     */
    public function login(Request $request)
    {
        $validated = $request->validate([
            'login' => ['required', 'string'],
            'password' => ['required', 'string'],
        ]);

        $field = filter_var($validated['login'], FILTER_VALIDATE_EMAIL) ? 'email' : 'username';

        if (! Auth::attempt([$field => $validated['login'], 'password' => $validated['password']])) {
            return response()->json([
                'message' => 'The provided credentials are incorrect.',
            ], 422);
        }

        $user = User::where($field, $validated['login'])->firstOrFail();

        if (! $user->email_verified) {
            return response()->json([
                'message' => 'Please verify your email before logging in.',
                'needs_verification' => true,
                'user_id' => $user->id,
                'email' => $user->email,
            ], 403);
        }

        $token = $user->createToken('tobira-spa')->plainTextToken;

        return response()->json([
            'user' => $user,
            'token' => $token,
            'needs_onboarding' => is_null($user->birthday),
        ]);
    }

    /**
     * Revoke the token used to make this request.
     */
    public function logout(Request $request)
    {
        $request->user()->currentAccessToken()->delete();

        return response()->json(['message' => 'Logged out.']);
    }

    /**
     * Return the currently authenticated user (with role) for the SPA to
     * bootstrap its auth state on load / refresh.
     */
    public function me(Request $request)
    {
        $user = $request->user()->load('roles');

        return response()->json([
            'user' => $user,
            'role' => $user->getRoleNames()->first(),
            'needs_onboarding' => is_null($user->birthday),
        ]);
    }
}
