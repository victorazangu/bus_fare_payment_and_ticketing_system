<?php

namespace Database\Seeders;

use App\Models\ScheduleSeat;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class ScheduleSeatSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        ScheduleSeat::factory(100)->create();
    }
}
