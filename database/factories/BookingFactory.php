<?php

namespace Database\Factories;

use App\Models\Schedule;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Booking>
 */
class BookingFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $user = User::factory()->create();
        $schedule = Schedule::factory()->create();
        $seatNumbers = implode(',', $this->faker->randomElements(['1A', '2B', '3C', '4D', '5E'], $this->faker->numberBetween(1, 3)));
        $bookingDate = Carbon::now()->addDays(rand(1, 30));
        return [
            'user_id' => $user->id,
            'schedule_id' => $schedule->id,
            'seat_numbers' => $seatNumbers,
            'booking_date' => $bookingDate,
            'qr_code' => fake()->uuid,
            'payment_status' => fake()->randomElement(['pending', 'completed', 'failed']),
            'total_fare' => fake()->randomFloat(2, 10, 100),
            'created_at' => now(),
            'updated_at' => now(),
        ];
    }
}
