<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Schedule extends Model
{
    /** @use HasFactory<\Database\Factories\ScheduleFactory> */
    use HasFactory;

    protected $fillable = [
        'bus_id',
        'route_id',
        'departure_time',
        'arrival_time',
        'fare',
        'available_seats',
        'frequency',
        'travel_day'
    ];

    public function bus()
    {
        return $this->belongsTo(Bus::class);
    }

    public function route()
    {
        return $this->belongsTo(Route::class);
    }

    public function bookings()
    {
        return $this->hasMany(Booking::class);
    }


    public function scheduleSeats()
    {
        return $this->hasMany(ScheduleSeat::class);
    }

    public function busDrivers()
    {
        return $this->hasMany(BusDriver::class);
    }

    protected $casts = [
        'fare' => 'float',
        "departure_time" => "datetime",
        "arrival_time" => "datetime",
    ];

    public function setTravelDayAttribute($value)
    {
        if ($this->frequency == 'weekly') {
            $days = explode(',', $value);
            $this->attributes['travel_day'] = implode(',', array_map('strtolower', $days));
        } elseif ($this->frequency == 'monthly' || $this->frequency == 'yearly') {
            $this->attributes['travel_day'] = $value;
        } else if ($this->frequency == 'daily') {
            $this->attributes['travel_day'] = "Everyday";
        } else {
            $this->attributes['travel_day'] = null;
        }
    }
}
