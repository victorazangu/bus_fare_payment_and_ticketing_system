<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Bus extends Model
{
    /** @use HasFactory<\Database\Factories\BusFactory> */
    use HasFactory;

    protected $fillable = [
        'registration_number',
        'capacity',
        'model',
        'year',
//        'latitude',
//        'longitude',
    ];


    public function schedules()
    {
        return $this->hasMany(Schedule::class);
    }

    public function seats()
    {
        return $this->hasMany(Seat::class);
    }

    public function busDrivers()
    {
        return $this->hasMany(BusDriver::class);
    }
}
