<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Route extends Model
{
    /** @use HasFactory<\Database\Factories\RouteFactory> */
    use HasFactory;

    protected $fillable = [
        'origin',
        'destination',
        'distance',
        'estimated_travel_time',
    ];

    public function schedules()
    {
        return $this->hasMany(Schedule::class);
    }
}
