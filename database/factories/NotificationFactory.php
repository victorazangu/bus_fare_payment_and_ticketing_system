<?php

namespace Database\Factories;

use App\Models\User;
use Carbon\Carbon;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Notification>
 */
class NotificationFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $user = User::inRandomOrder()->first();
        $sentAt = Carbon::now()->subDays(rand(0, 14));
        $randomDate = Carbon::now()->subDays(rand(0, 365));
        return [
            'user_id' => $user->id,
            'type' => fake()->randomElement(['booking_confirmation', 'reminder', 'delay_alert', 'cancellation_update', 'promotion_offer']),
            'message' => fake()->sentence(),
            'sent_at' => $sentAt,
            'read_at' => fake()->optional()->dateTimeBetween($sentAt, 'now'),
            'created_at' => $randomDate,
            'updated_at' => $randomDate->addHours(rand(1, 48))
        ];
    }
}
