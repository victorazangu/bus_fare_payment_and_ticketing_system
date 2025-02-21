<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;

class User extends Authenticatable
{
    /** @use HasFactory<\Database\Factories\UserFactory> */
    use HasFactory, Notifiable;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'name',
        'email',
        'password',
        'user_type',
        'phone',
        "image",
        'address',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var list<string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
        ];
    }

    public function bookings()
    {
        return $this->hasMany(Booking::class);
    }

    public function promotions()
    {
        return $this->belongsToMany(Promotion::class, 'user_promotions');
    }

    public function busDrivers()
    {
        return $this->hasMany(BusDriver::class);
    }

//    public function notifications()
//    {
//        return $this->hasMany(Notification::class);
//    }

    public function isAdmin()
    {
        return $this->user_type === 'admin';
    }

    public function isDriver()
    {
        return $this->user_type === 'driver';
    }

    public function isCustomer()
    {
        return $this->user_type === 'passanger';
    }

}
