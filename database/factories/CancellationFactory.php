<?php

namespace Database\Factories;

use App\Models\Booking;
use Carbon\Carbon;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Cancellation>
 */
class CancellationFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $booking = Booking::inRandomOrder()->first();
        $cancellationDate = Carbon::now()->subDays(rand(0, 7));
        $randomDate = Carbon::now()->subDays(rand(0, 365));
        return [
            'booking_id' => $booking->id,
            'cancellation_date' => $cancellationDate,
            'refund_amount' => fake()->randomFloat(2, 0, $booking->total_fare),
            'reason' => fake()->randomElement(['Change of plans', 'Travel issues', 'Other']),
            'status' => fake()->randomElement(['requested', 'approved', 'rejected', 'refunded']),
            'created_at' => $randomDate,
            'updated_at' => $randomDate->addHours(rand(1, 48))
        ];
    }
}
