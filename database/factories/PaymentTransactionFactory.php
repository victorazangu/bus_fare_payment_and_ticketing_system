<?php

namespace Database\Factories;

use App\Models\Booking;
use Carbon\Carbon;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\PaymentTransaction>
 */
class PaymentTransactionFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $booking = Booking::inRandomOrder()->first();
        $paymentDate = Carbon::now()->subDays(rand(0, 3));
        $randomDate = Carbon::now()->subDays(rand(0, 365));
        return [
            'booking_id' => $booking->id,
            'transaction_id' => fake()->uuid,
            'amount' => $booking->total_fare,
            'payment_method' => fake()->randomElement(['credit_card', 'paypal', 'mobile_money', 'mpesa', 'cash']),
            'status' => fake()->randomElement(['success', 'failed', 'pending']),
            'payment_date' => $paymentDate,
            'created_at' => $randomDate,
            'updated_at' => $randomDate->addHours(rand(1, 48))
        ];
    }
}
