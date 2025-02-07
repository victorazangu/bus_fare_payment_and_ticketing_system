<?php

namespace Database\Factories;

use App\Models\Bus;
use App\Models\Schedule;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\BusDriver>
 */
class BusDriverFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $bus = Bus::factory()->create();
        $driver = User::factory()->create();
        $schedule = Schedule::factory()->create();
        $assignmentDate = Carbon::now()->subDays(rand(0, 365));
        return [
            'bus_id' => $bus->id,
            'user_id' => $driver->id,
            'schedule_id' => $schedule->id,
            'assignment_date' => $assignmentDate,
            'created_at' => now(),
            'updated_at' => now(),
        ];
    }
}
