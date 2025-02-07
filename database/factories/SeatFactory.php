<?php

namespace Database\Factories;

use App\Models\Bus;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Seat>
 */
class SeatFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $bus = Bus::factory()->create();
        $row = chr(fake()->numberBetween(65, 70));
        $number = fake()->numberBetween(1, 10);
        $seatNumber = $row . $number;
        return [
            'bus_id' => $bus->id,
            'seat_number' => $seatNumber,
            'created_at' => now(),
            'updated_at' => now(),
        ];
    }
}
