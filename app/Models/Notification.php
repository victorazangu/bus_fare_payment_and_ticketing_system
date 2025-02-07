<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Notification extends Model
{
    /** @use HasFactory<\Database\Factories\NotificationFactory> */
    use HasFactory;

    protected $fillable = [
        'user_id',
        'type', // e.g., 'booking_confirmation', 'reminder', 'delay_alert'
        'message',
        'sent_at',
        'read_at',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
