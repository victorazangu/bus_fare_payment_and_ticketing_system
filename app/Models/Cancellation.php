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
        'status', // e.g., 'requested', 'approved', 'rejected', 'refunded'
    ];

    public function booking()
    {
        return $this->belongsTo(Booking::class);
    }
}
