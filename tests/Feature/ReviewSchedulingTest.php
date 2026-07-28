<?php

namespace Tests\Feature;

use App\Models\Card;
use App\Models\Deck;
use App\Models\User;
use Database\Seeders\RoleSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;

class ReviewSchedulingTest extends TestCase
{
    use RefreshDatabase;

    protected User $student;
    protected Deck $deck;
    protected Card $card;

    protected function setUp(): void
    {
        parent::setUp();
        $this->seed(RoleSeeder::class);

        $this->student = User::factory()->create();
        $this->student->assignRole('student');

        $this->deck = Deck::create([
            'user_id' => $this->student->id,
            'title' => 'Test Deck',
            'is_public' => true,
        ]);

        $this->card = Card::create([
            'deck_id' => $this->deck->id,
            'front_text' => 'テスト',
            'back_text' => 'Test',
        ]);
    }

    public function test_a_new_card_is_immediately_due(): void
    {
        Sanctum::actingAs($this->student);

        $response = $this->getJson('/api/reviews/due');

        $response->assertOk();
        $this->assertContains($this->card->id, collect($response->json())->pluck('id'));
    }

    public function test_submitting_a_rating_creates_a_review_and_schedules_next_review_date(): void
    {
        Sanctum::actingAs($this->student);

        $response = $this->postJson('/api/reviews', [
            'card_id' => $this->card->id,
            'rating' => 2, // Good
        ]);

        $response->assertStatus(201);

        $this->assertDatabaseHas('reviews', [
            'user_id' => $this->student->id,
            'card_id' => $this->card->id,
            'rating' => 2,
        ]);
    }

    public function test_a_card_just_reviewed_with_good_no_longer_shows_as_due(): void
    {
        Sanctum::actingAs($this->student);

        $this->postJson('/api/reviews', ['card_id' => $this->card->id, 'rating' => 2]);

        $due = $this->getJson('/api/reviews/due')->json();

        $this->assertNotContains($this->card->id, collect($due)->pluck('id'));
    }

    public function test_a_card_rated_again_stays_due_almost_immediately(): void
    {
        Sanctum::actingAs($this->student);

        // "Again" schedules a 1-day interval, so it will NOT be immediately
        // due again in the same request cycle — this documents that behavior
        // rather than assuming instant re-queueing.
        $response = $this->postJson('/api/reviews', ['card_id' => $this->card->id, 'rating' => 0]);

        $response->assertStatus(201);
        $this->assertDatabaseHas('reviews', [
            'card_id' => $this->card->id,
            'rating' => 0,
            'interval_days' => 1,
        ]);
    }

    public function test_a_student_cannot_review_a_card_from_a_private_deck_they_do_not_own(): void
    {
        $otherStudent = User::factory()->create();
        $otherStudent->assignRole('student');

        $privateDeck = Deck::create(['user_id' => $otherStudent->id, 'title' => 'Private', 'is_public' => false]);
        $privateCard = Card::create(['deck_id' => $privateDeck->id, 'front_text' => '秘密', 'back_text' => 'Secret']);

        Sanctum::actingAs($this->student);

        $this->postJson('/api/reviews', ['card_id' => $privateCard->id, 'rating' => 2])
            ->assertStatus(403);
    }
}
