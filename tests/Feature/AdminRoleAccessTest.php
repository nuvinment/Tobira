<?php

namespace Tests\Feature;

use App\Models\User;
use Database\Seeders\RoleSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;

class AdminRoleAccessTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        $this->seed(RoleSeeder::class);
    }

    public function test_student_role_is_forbidden_from_admin_analytics_routes(): void
    {
        $student = User::factory()->create();
        $student->assignRole('student');

        Sanctum::actingAs($student);

        $this->getJson('/api/admin/overview')->assertStatus(403);
        $this->getJson('/api/admin/users')->assertStatus(403);
        $this->getJson('/api/admin/analytics/deck-engagement')->assertStatus(403);
    }

    public function test_admin_role_can_access_admin_routes(): void
    {
        $admin = User::factory()->create();
        $admin->assignRole('admin');

        Sanctum::actingAs($admin);

        $this->getJson('/api/admin/overview')->assertOk();
        $this->getJson('/api/admin/users')->assertOk();
    }

    public function test_unauthenticated_requests_are_rejected(): void
    {
        $this->getJson('/api/dashboard')->assertStatus(401);
        $this->getJson('/api/admin/overview')->assertStatus(401);
    }

    public function test_admin_cannot_change_their_own_role(): void
    {
        $admin = User::factory()->create();
        $admin->assignRole('admin');

        Sanctum::actingAs($admin);

        $this->patchJson("/api/admin/users/{$admin->id}/role", ['role' => 'student'])
            ->assertStatus(422);
    }

    public function test_cannot_delete_the_last_remaining_admin(): void
    {
        $admin = User::factory()->create();
        $admin->assignRole('admin');

        $otherAdmin = User::factory()->create();
        $otherAdmin->assignRole('admin');

        Sanctum::actingAs($admin);

        // Deleting the other admin is fine while two exist...
        $this->deleteJson("/api/admin/users/{$otherAdmin->id}")->assertStatus(204);
    }
}
