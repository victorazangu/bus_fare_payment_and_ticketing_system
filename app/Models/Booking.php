<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Booking extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'schedule_id',
        'seat_numbers',
        'booking_date',
        'qr_code',
        'payment_status',
        'total_fare',
        'status'
    ];

    protected $casts = [
        'booking_date' => 'date',
        'seat_numbers' => 'array',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function schedule()
    {
        return $this->belongsTo(Schedule::class);
    }

    public function paymentTransaction()
    {
        return $this->hasOne(PaymentTransaction::class);
    }

    public function cancellations()
    {
        return $this->hasMany(Cancellation::class);
    }

    public function seats()
    {
        $booking = $this->fresh();

        if (empty($booking->seat_numbers)) {
            return collect([]);
        }
        $seatIds = is_string($booking->seat_numbers)
            ? json_decode($booking->seat_numbers, true)
            : $booking->seat_numbers;

        if (empty($seatIds)) {
            return collect([]);
        }

        return Seat::whereIn('id', $seatIds)->get();
    }
    public function getFormattedSeatNumbersAttribute()
    {
        return $this->seats()->pluck('seat_number')->join(', ');
    }
}
