<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class BusDriver extends Model
{
    /** @use HasFactory<\Database\Factories\BusDriverFactory> */
    use HasFactory;

    protected $fillable = [
        'bus_id',
        'user_id',
        'schedule_id',
        'assignment_date',
    ];

    public function bus()
    {
        return $this->belongsTo(Bus::class);
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function schedule()
    {
        return $this->belongsTo(Schedule::class);
    }
}
