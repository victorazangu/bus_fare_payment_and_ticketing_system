<?php

namespace App\Http\Controllers\Driver;

use App\Http\Controllers\Controller;
use App\Models\Booking;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ScannerController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return Inertia::render("Driver/QR/Scanner", []);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {

        $request->validate([
            'qr_code' => 'required|string',
        ]);

        $qrCode = $request->qr_code;
        $booking = Booking::with('schedule.route')->where('qr_code', $qrCode)->first();
        if (!$booking) {
            return response()->json([
                'valid' => false,
                'reason' => 'Booking not found',
                "booking" => $booking,
            ]);
        }
        if ($booking->status === 'cancelled') {
            return response()->json([
                'valid' => false,
                'reason' => 'Booking has been cancelled',
                'booking' => [
                    'id' => $booking->id,
                    'user_name' => $booking->user->name,
                    'seats' => count(json_decode($booking->seat_numbers)),
                    'booking_date' => $booking->booking_date->format('Y-m-d'),
                    'status' => $booking->status,
                ]
            ]);
        }

        if ($booking->payment_status === 'pending') {
            return response()->json([
                'valid' => false,
                'reason' => 'Payment is pending',
                'booking' => [
                    'id' => $booking->id,
                    'user_name' => $booking->user->name,
                    'seats' => count(json_decode($booking->seat_numbers)),
                    'booking_date' => $booking->booking_date->format('Y-m-d'),
                    'payment_status' => $booking->payment_status,
                ]
            ]);
        }

        $today = now()->format('Y-m-d');
        if ($booking->booking_date->format('Y-m-d') !== $today) {
            return response()->json([
                'valid' => false,
                'reason' => 'Booking is for ' . $booking->booking_date->format('Y-m-d') . ', not today',
                'booking' => [
                    'id' => $booking->id,
                    'user_name' => $booking->user->name,
                    'seats' => count(json_decode($booking->seat_numbers)),
                    'booking_date' => $booking->booking_date->format('Y-m-d'),
                ]
            ]);
        }
        if ($booking->status === 'confirmed') {
            $booking->update(['status' => 'boarded']);
        }
        return response()->json([
            'valid' => true,
            'booking' => [
                'id' => $booking->id,
                'user_name' => $booking->user->name,
                'seats' =>$booking->getFormattedSeatNumbersAttribute(),
                'seat_numbers' => json_decode($booking->seat_numbers),
                'booking_date' => $booking->booking_date->format('Y-m-d'),
                'schedule' => [
                    'departure' => $booking->schedule->route->origin,
                    'destination' => $booking->schedule->route->destination,
                    'departure_time' => $booking->schedule->departure_time->format('H:i A'),
                ]
            ]
        ]);
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        //
    }
}
