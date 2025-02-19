<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Promotion extends Model
{
    /** @use HasFactory<\Database\Factories\PromotionFactory> */
    use HasFactory;

    protected $fillable = [
        'code',
        'discount_percentage',
    ];

    public function bookings()
    {
        return $this->hasMany(Booking::class);  // A promotion can apply to many bookings
    }

}
