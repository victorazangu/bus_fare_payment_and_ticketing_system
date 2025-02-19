<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ScheduleSeat extends Model
{
    /** @use HasFactory<\Database\Factories\ScheduleSeatFactory> */
    use HasFactory;

    protected $fillable = [
        'schedule_id',
        'seat_id',
        'is_booked',
    ];

    public function seat()
    {
        return $this->belongsTo(Seat::class);
    }

    public function schedule()
    {
        return $this->belongsTo(Schedule::class);
    }


}
