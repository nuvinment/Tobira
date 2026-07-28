<?php

namespace Tests\Feature;

use App\Models\Deck;
use App\Models\User;
use Database\Seeders\RoleSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Str;
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;

class DeckAuthorizationTest extends TestCase
{
    use RefreshDatabase;

    protected User $student;
    protected User $otherStudent;
    protected User $admin;

    protected function setUp(): void
    {
        parent::setUp();
        $this->seed(RoleSeeder::class);

        $this->student = User::factory()->create();
        $this->student->assignRole('student');

        $this->otherStudent = User::factory()->create();
        $this->otherStudent->assignRole('student');

        $this->admin = User::factory()->create();
        $this->admin->assignRole('admin');
    }

    public function test_student_can_create_their_own_private_deck(): void
    {
        Sanctum::actingAs($this->student);

        $response = $this->postJson('/api/decks', [
            'title' => 'My Personal Deck',
            'is_public' => true, // students cannot force public on creation
        ]);

        $response->assertStatus(201);
        $this->assertDatabaseHas('decks', [
            'title' => 'My Personal Deck',
            'user_id' => $this->student->id,
            'is_public' => false, // silently forced to false since only admins can publish
        ]);
    }

    public function test_student_cannot_update_another_students_deck(): void
    {
        $deck = Deck::create([
            'user_id' => $this->otherStudent->id,
            'title' => 'Not Yours',
            'is_public' => false,
        ]);

        Sanctum::actingAs($this->student);

        $this->putJson("/api/decks/{$deck->id}", ['title' => 'Hijacked'])
            ->assertStatus(403);
    }

    public function test_student_cannot_view_another_students_private_deck(): void
    {
        $deck = Deck::create([
            'user_id' => $this->otherStudent->id,
            'title' => 'Private Deck',
            'is_public' => false,
        ]);

        Sanctum::actingAs($this->student);

        $this->getJson("/api/decks/{$deck->id}")->assertStatus(403);
    }

    public function test_public_deck_is_visible_to_any_student(): void
    {
        $deck = Deck::create([
            'user_id' => $this->admin->id,
            'title' => 'Public Deck',
            'is_public' => true,
        ]);

        Sanctum::actingAs($this->student);

        $this->getJson("/api/decks/{$deck->id}")->assertOk();
    }

    public function test_admin_can_update_any_students_deck(): void
    {
        $deck = Deck::create([
            'user_id' => $this->student->id,
            'title' => 'Student Deck',
            'is_public' => false,
        ]);

        Sanctum::actingAs($this->admin);

        $this->putJson("/api/decks/{$deck->id}", ['title' => 'Updated by Admin'])
            ->assertOk();

        $this->assertDatabaseHas('decks', ['id' => $deck->id, 'title' => 'Updated by Admin']);
    }

    public function test_card_front_text_must_contain_japanese_characters(): void
    {
        $deck = Deck::create([
            'user_id' => $this->student->id,
            'title' => 'Test Deck',
            'is_public' => false,
        ]);

        Sanctum::actingAs($this->student);

        $this->postJson("/api/decks/{$deck->id}/cards", [
            'front_text' => 'romaji only',
            'back_text' => 'Some meaning',
        ])->assertStatus(422)->assertJsonValidationErrors('front_text');
    }

    public function test_card_with_valid_japanese_front_text_is_created(): void
    {
        $deck = Deck::create([
            'user_id' => $this->student->id,
            'title' => 'Test Deck',
            'is_public' => false,
        ]);

        Sanctum::actingAs($this->student);

        $this->postJson("/api/decks/{$deck->id}/cards", [
            'front_text' => 'お世話になっております',
            'back_text' => 'Thank you for your support',
        ])->assertStatus(201);
    }
}
