<?php

namespace Database\Factories;

use App\Models\Schedule;
use App\Models\Seat;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\ScheduleSeat>
 */
class ScheduleSeatFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $schedule = Schedule::factory()->create();
        $seat = Seat::factory()->create();
        return [
            'schedule_id' => $schedule->id,
            'seat_id' => $seat->id,
            'is_booked' => fake()->boolean(),
            'created_at' => now(),
            'updated_at' => now(),
        ];
    }
}
