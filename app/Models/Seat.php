<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Seat extends Model
{
    /** @use HasFactory<\Database\Factories\SeatFactory> */
    use HasFactory;

    protected $fillable = [
        'bus_id',
        'seat_number',
        'seat_type', //e.g., 'window', 'aisle'
    ];

    public function bus()
    {
        return $this->belongsTo(Bus::class);
    }

    public function scheduleSeats()
    {
        return $this->hasMany(ScheduleSeat::class);
    }
}
