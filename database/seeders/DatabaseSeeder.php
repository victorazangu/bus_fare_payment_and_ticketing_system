<?php

namespace Database\Seeders;

use App\Models\User;
// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        $this->call([
            UserSeeder::class,
            BusSeeder::class,
            RouteSeeder::class,
            ScheduleSeeder::class,
            SeatSeeder::class,
            ScheduleSeatSeeder::class,
            BookingSeeder::class,
            PaymentTransactionSeeder::class,
            BusDriverSeeder::class,
            CancellationSeeder::class,
            NotificationSeeder::class,
        ]);
    }
}
