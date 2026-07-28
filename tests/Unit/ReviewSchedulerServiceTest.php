<?php

namespace Tests\Unit;

use App\Services\ReviewSchedulerService;
use PHPUnit\Framework\TestCase;

class ReviewSchedulerServiceTest extends TestCase
{
    protected ReviewSchedulerService $scheduler;

    protected function setUp(): void
    {
        parent::setUp();
        $this->scheduler = new ReviewSchedulerService();
    }

    public function test_again_resets_interval_to_one_day_and_lowers_ease(): void
    {
        [$interval, $ease] = $this->scheduler->calculate(rating: 0, previousIntervalDays: 5, previousEaseFactor: 2.50);

        $this->assertSame(1, $interval);
        $this->assertEquals(2.30, $ease);
    }

    public function test_hard_increases_interval_by_1_2x_and_lowers_ease_slightly(): void
    {
        [$interval, $ease] = $this->scheduler->calculate(rating: 1, previousIntervalDays: 5, previousEaseFactor: 2.50);

        $this->assertSame(6, $interval); // round(5 * 1.2)
        $this->assertEquals(2.35, $ease);
    }

    public function test_good_increases_interval_by_ease_factor_and_leaves_ease_unchanged(): void
    {
        [$interval, $ease] = $this->scheduler->calculate(rating: 2, previousIntervalDays: 5, previousEaseFactor: 2.50);

        $this->assertSame(13, $interval); // round(5 * 2.50)
        $this->assertEquals(2.50, $ease);
    }

    public function test_easy_increases_interval_aggressively_and_raises_ease(): void
    {
        [$interval, $ease] = $this->scheduler->calculate(rating: 3, previousIntervalDays: 5, previousEaseFactor: 2.50);

        $this->assertSame(13, $interval); // round(5 * (2.50 + 0.10))
        $this->assertEquals(2.65, $ease);
    }

    public function test_ease_factor_never_drops_below_the_minimum_floor(): void
    {
        [, $ease] = $this->scheduler->calculate(rating: 0, previousIntervalDays: 1, previousEaseFactor: 1.35);

        $this->assertEquals(ReviewSchedulerService::MIN_EASE_FACTOR, $ease);
    }

    public function test_interval_never_drops_below_one_day(): void
    {
        [$interval] = $this->scheduler->calculate(rating: 1, previousIntervalDays: 0, previousEaseFactor: 1.30);

        $this->assertGreaterThanOrEqual(1, $interval);
    }

    public function test_invalid_rating_throws_exception(): void
    {
        $this->expectException(\InvalidArgumentException::class);

        $this->scheduler->calculate(rating: 5, previousIntervalDays: 1, previousEaseFactor: 2.50);
    }

    /**
     * A new card (default state) rated "Good" repeatedly should show
     * intervals growing multiplicatively — this guards against a
     * regression where the ease factor accidentally resets each call.
     */
    public function test_repeated_good_ratings_compound_the_interval(): void
    {
        $interval = ReviewSchedulerService::DEFAULT_INTERVAL_DAYS;
        $ease = ReviewSchedulerService::DEFAULT_EASE_FACTOR;

        [$interval, $ease] = $this->scheduler->calculate(2, $interval, $ease);
        $this->assertSame(3, $interval); // round(1 * 2.5) = 3 (rounds 2.5 up)

        [$interval, $ease] = $this->scheduler->calculate(2, $interval, $ease);
        $this->assertSame(8, $interval); // round(3 * 2.5) = 8 (rounds 7.5 up)
    }
}
