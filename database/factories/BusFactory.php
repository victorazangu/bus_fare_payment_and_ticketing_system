<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Bus>
 */
class BusFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $capacity = fake()->numberBetween(20, 50);
        return [
            'registration_number' => fake()->unique()->regexify('[A-Z]{3}[0-9]{3}'),
            'capacity' => $capacity,
            'model' => fake()->randomElement(['Volvo', 'Mercedes-Benz', 'Scania', 'MAN']),
            'year' => fake()->numberBetween(2010, 2023),
            'latitude' => fake()->latitude(),
            'longitude' => fake()->longitude(),
            'created_at' => now(),
            'updated_at' => now(),
        ];
    }
}
