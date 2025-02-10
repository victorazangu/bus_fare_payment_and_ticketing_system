<?php

namespace Database\Factories;

use App\Models\Schedule;
use App\Models\Seat;
use Carbon\Carbon;
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
        $schedule = Schedule::inRandomOrder()->first();
        $seat = Seat::inRandomOrder()->first();
        $randomDate = Carbon::now()->subDays(rand(0, 365));
        return [
            'schedule_id' => $schedule->id,
            'seat_id' => $seat->id,
            'is_booked' => fake()->boolean(),
            'created_at' => $randomDate,
            'updated_at' => $randomDate->addHours(rand(1, 48))
        ];
    }
}
