<?php

namespace Database\Factories;

use Carbon\Carbon;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Route>
 */
class RouteFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $origin = fake()->city();
        $destination = fake()->city();
        while ($destination === $origin) {
            $destination = fake()->city();
        }
        $distance = fake()->numberBetween(50, 500);
        $randomDate = Carbon::now()->subDays(rand(0, 365));
        return [
            'origin' => $origin,
            'destination' => $destination,
            'distance' => $distance,
            'estimated_travel_time' => fake()->numberBetween(1, 8),
            'created_at' => $randomDate,
            'updated_at' => $randomDate->addHours(rand(1, 48))
        ];
    }
}
