<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Cancellation extends Model
{
    /** @use HasFactory<\Database\Factories\CancellationFactory> */
    use HasFactory;

    protected $fillable = [
        'booking_id',
        'cancellation_date',
        'refund_amount',
        'reason',
        'status',
    ];

    public function booking()
    {
        return $this->belongsTo(Booking::class);
    }

    public function casts(): array
    {
        return [
            "cancellation_date" => "datetime",
        ];
    }
}
