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

    protected $casts = [
        'created_at' => 'date',
        'updated_at' => 'date',
    ];

    public function schedules()
    {
        return $this->hasMany(Schedule::class);
    }

    protected static function booted()
    {
        static::deleting(function ($route) {
            $route->schedules()->each(function ($schedule) {
                $schedule->bookings->each(function ($booking) {
                    $booking->paymentTransaction()->delete();
                    $booking->cancellations()->delete();
                });

                $schedule->bookings()->delete();
                $schedule->scheduleSeats()->delete();
                $schedule->busDrivers()->delete(); // Delete bus drivers
                $schedule->delete();
            });
        });
    }


}
