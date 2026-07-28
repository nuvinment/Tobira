<?php

use App\Http\Controllers\Api\AdminAnalyticsController;
use App\Http\Controllers\Api\AdminUserController;
use App\Http\Controllers\Api\AudioUploadController;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\CardController;
use App\Http\Controllers\Api\DashboardController;
use App\Http\Controllers\Api\DeckController;
use App\Http\Controllers\Api\InterviewController;
use App\Http\Controllers\Api\OnboardingController;
use App\Http\Controllers\Api\OtpController;
use App\Http\Controllers\Api\QuizController;
use App\Http\Controllers\Api\ReviewController;
use Illuminate\Support\Facades\Route;

// --- Public auth endpoints ---
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);
Route::post('/otp/verify', [OtpController::class, 'verify']);
Route::post('/otp/resend', [OtpController::class, 'resend']);

// --- Authenticated endpoints (Bearer token via Sanctum) ---
Route::middleware('auth:sanctum')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/user', [AuthController::class, 'me']);
    Route::post('/onboarding', [OnboardingController::class, 'store']);
    Route::post('/uploads/audio', [AudioUploadController::class, 'store']);
    Route::post('/interview/respond', [InterviewController::class, 'respond']);

    Route::get('/dashboard', [DashboardController::class, 'student']);

    Route::apiResource('decks', DeckController::class);

    // Import/export must be registered before the apiResource below,
    // otherwise "import"/"export" get swallowed by the {card} wildcard.
    Route::post('/decks/{deck}/cards/import', [CardController::class, 'import']);
    Route::get('/decks/{deck}/cards/export', [CardController::class, 'export']);
    Route::apiResource('decks.cards', CardController::class);

    Route::get('/reviews/due', [ReviewController::class, 'due']);
    Route::get('/reviews/history', [ReviewController::class, 'history']);
    Route::post('/reviews', [ReviewController::class, 'store']);

    Route::get('/quiz/cards', [QuizController::class, 'cards']);

    // --- Admin-only: platform analytics + user management ---
    Route::middleware('role:admin')->prefix('admin')->group(function () {
        Route::get('/overview', [AdminUserController::class, 'overview']);
        Route::get('/users', [AdminUserController::class, 'index']);
        Route::patch('/users/{user}/role', [AdminUserController::class, 'updateRole']);
        Route::delete('/users/{user}', [AdminUserController::class, 'destroy']);

        Route::get('/analytics/daily-active-users', [AdminAnalyticsController::class, 'dailyActiveUsers']);
        Route::get('/analytics/deck-engagement', [AdminAnalyticsController::class, 'deckEngagement']);
        Route::get('/analytics/user-progress', [AdminAnalyticsController::class, 'userProgress']);
    });
});
