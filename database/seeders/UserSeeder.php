<?php

namespace Database\Seeders;

use App\Models\User;
use Carbon\Carbon;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
//    public function run(): void
//    {
//        User::factory(10)->create();
//    }

    public function run()
    {
        $randomDate = fn() => Carbon::now()->subDays(rand(0, 365));

        $users = [
            [
                'name' => 'John Victor',
                'email' => 'admin@example.com',
                'user_type' => 'admin',
            ],
            [
                'name' => 'Jane Azangu',
                'email' => 'passenger@example.com',
                'user_type' => 'passenger',
            ],
            [
                'name' => 'Mary Shemi',
                'email' => 'driver@example.com',
                'user_type' => 'driver',
            ],
        ];


        foreach ($users as $user) {
            User::updateOrCreate(
                ['email' => $user['email']],
                array_merge($user, [
                    'email_verified_at' => now(),
                    'password' => Hash::make('password'),
                    'phone' => fake()->phoneNumber(),
                    'address' => fake()->address(),
                    'remember_token' => Str::random(10),
                    'created_at' => $randomDate(),
                    'updated_at' => $randomDate()->addHours(rand(1, 48)),
                ])
            );
        }
        User::factory(10)->create();
    }


}
