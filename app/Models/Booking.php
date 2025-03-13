<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Storage;
use SimpleSoftwareIO\QrCode\Facades\QrCode;

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
        'status',
        "booking_code",
        "qr_code_data"
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

    public function generateQrCodeImage()
    {

//        $qrCodeData .= "User: " . ($this->user ? $this->user->name : 'N/A') . "\n";
//        $qrCodeData .= "Total Fare: " . "KSH " . $this->total_fare . "\n";
//        $qrCodeData .= "Booking Date: " . ($this->booking_date ? $this->booking_date->toDateString() : 'N/A') . "\n";
//        $qrCodeData .= "Payment Status: " . $this->payment_status . "\n";
//        $qrCodeData .= "Seat Numbers: " . $this->getFormattedSeatNumbersAttribute() . "\n";

        $fileName = 'booking_' . $this->booking_code . '.png';
        $relativePath = 'qr_codes/' . $fileName;
        $qrCodeData = $relativePath;
        $directory = storage_path('app/public/qr_codes/');
        if (!file_exists($directory)) {
            mkdir($directory, 0755, true);
        }

        $path = $directory . $fileName;

        QrCode::format('png')->size(200)->generate($qrCodeData, $path);

        $this->update([
            'qr_code' => $relativePath,
            "qr_code_data"=>$qrCodeData
        ]);

        return $relativePath;
    }

    public function getQrCodeUrl()
    {
        return $this->qr_code ? asset("storage/{$this->qr_code}") : null;
    }

}
