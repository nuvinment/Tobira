<?php

namespace Tests\Feature;

use App\Mail\OtpMail;
use App\Models\User;
use Database\Seeders\RoleSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Mail;
use Tests\TestCase;

class AuthenticationTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        $this->seed(RoleSeeder::class);
    }

    public function test_registration_creates_an_unverified_user_and_sends_an_otp_email(): void
    {
        Mail::fake();

        $response = $this->postJson('/api/register', [
            'name' => 'Kenji Sato',
            'username' => 'kenji_sato',
            'email' => 'kenji@example.com',
            'password' => 'password123',
            'password_confirmation' => 'password123',
        ]);

        $response->assertStatus(201)->assertJsonStructure(['user_id', 'email']);

        $this->assertDatabaseHas('users', [
            'email' => 'kenji@example.com',
            'email_verified' => false,
        ]);

        Mail::assertSent(OtpMail::class);
    }

    public function test_unverified_user_cannot_log_in(): void
    {
        $user = User::factory()->create([
            'email' => 'unverified@example.com',
            'password' => bcrypt('password123'),
            'email_verified' => false,
        ]);
        $user->assignRole('student');

        $response = $this->postJson('/api/login', [
            'login' => 'unverified@example.com',
            'password' => 'password123',
        ]);

        $response->assertStatus(403)->assertJson(['needs_verification' => true]);
    }

    public function test_correct_otp_verifies_the_account_and_issues_a_token(): void
    {
        $user = User::factory()->create([
            'otp' => '123456',
            'otp_expires_at' => now()->addMinutes(10),
            'email_verified' => false,
        ]);
        $user->assignRole('student');

        $response = $this->postJson('/api/otp/verify', [
            'user_id' => $user->id,
            'otp' => '123456',
        ]);

        $response->assertOk()->assertJsonStructure(['user', 'token', 'needs_onboarding']);

        $this->assertDatabaseHas('users', [
            'id' => $user->id,
            'email_verified' => true,
        ]);
    }

    public function test_expired_otp_is_rejected(): void
    {
        $user = User::factory()->create([
            'otp' => '123456',
            'otp_expires_at' => now()->subMinute(),
            'email_verified' => false,
        ]);

        $response = $this->postJson('/api/otp/verify', [
            'user_id' => $user->id,
            'otp' => '123456',
        ]);

        $response->assertStatus(422);
    }

    public function test_verified_user_can_log_in_with_email_or_username(): void
    {
        $user = User::factory()->create([
            'username' => 'kenji_sato',
            'email' => 'kenji@example.com',
            'password' => bcrypt('password123'),
            'email_verified' => true,
        ]);
        $user->assignRole('student');

        $this->postJson('/api/login', ['login' => 'kenji@example.com', 'password' => 'password123'])
            ->assertOk()->assertJsonStructure(['user', 'token']);

        $this->postJson('/api/login', ['login' => 'kenji_sato', 'password' => 'password123'])
            ->assertOk()->assertJsonStructure(['user', 'token']);
    }
}
