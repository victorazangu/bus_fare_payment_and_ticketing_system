<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class PaymentTransaction extends Model
{
    /** @use HasFactory<\Database\Factories\PaymentTransactionFactory> */
    use HasFactory;

    protected $fillable = [
        'booking_id',
        'transaction_id',
        'amount',
        'payment_method',
        'status',
        'payment_date',
    ];

    public function booking()
    {
        return $this->belongsTo(Booking::class);
    }
}
