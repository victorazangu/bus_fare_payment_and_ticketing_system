<?php

namespace Database\Seeders;

use App\Models\Cancellation;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class CancellationSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        Cancellation::factory(16)->create();
    }
}
