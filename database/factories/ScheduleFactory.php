<?php

namespace Database\Factories;

use App\Models\Bus;
use App\Models\Route;
use Carbon\Carbon;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Schedule>
 */
class ScheduleFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $bus = Bus::factory()->create();
        $route = Route::factory()->create();
        $departureTime = fake()->time('H:i');
        return [
            'bus_id' => $bus->id,
            'route_id' => $route->id,
            'departure_time' => $departureTime,
            'arrival_time' => Carbon::parse($departureTime)->addHours(fake()->numberBetween(1, 8)),
            'fare' => fake()->randomFloat(2, 20, 150),
            'available_seats' => fake()->numberBetween(10, $bus->capacity),
            'created_at' => now(),
            'updated_at' => now(),
        ];
    }
}
