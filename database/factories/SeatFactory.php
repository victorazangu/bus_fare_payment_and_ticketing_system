<?php

namespace Database\Factories;

use App\Models\Bus;
use Carbon\Carbon;
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
        $bus = Bus::inRandomOrder()->first();
        $row = chr(fake()->numberBetween(65, 70));
        $number = fake()->numberBetween(1, 10);
        $randomDate = Carbon::now()->subDays(rand(0, 365));

        $seatNumber = $row . $number;
        return [
            'bus_id' => $bus->id,
            'seat_number' => $seatNumber,
            'created_at' => $randomDate,
            'updated_at' => $randomDate->addHours(rand(1, 48))

        ];
    }
}
