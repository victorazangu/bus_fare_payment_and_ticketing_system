<?php

namespace App\Http\Controllers;

use App\Models\Booking;
use Illuminate\Http\Request;
use Inertia\Inertia;

class BookingValidatorController extends Controller
{
    /**
     * Show the driver QR scanner page
     */
    public function showScanner()
    {
//        // Only drivers should access this
//        if (auth()->user()->role !== 'driver') {
//            abort(403, 'Only drivers can access the booking scanner');
//        }
        return Inertia::render('Common/Booking/Scanner');
    }

    /**
     * Validate a booking QR code
     */
    public function validateQrCode(Request $request)
    {
        $request->validate([
            'qr_code' => 'required|string',
        ]);
        $qrCode = $request->qr_code;
        $booking = Booking::where('qr_code', $qrCode)->first();
        if (!$booking) {
            return response()->json([
                'valid' => false,
                'reason' => 'Booking not found',
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
                'seats' => count(json_decode($booking->seat_numbers)),
                'seat_numbers' => json_decode($booking->seat_numbers),
                'booking_date' => $booking->booking_date->format('Y-m-d'),
                'schedule' => [
                    'departure' => $booking->schedule->departure,
                    'destination' => $booking->schedule->destination,
                    'departure_time' => $booking->schedule->departure_time,
                ]
            ]
        ]);
    }

    /**
     * Generate QR code for passenger
     */
    public function showQrCode($bookingId)
    {
        $booking = Booking::findOrFail($bookingId);
        if ($booking->user_id !== auth()->id() && auth()->user()->role !== 'admin') {
            abort(403, 'You do not have permission to view this booking');
        }
        return Inertia::render('Bookings/QrCode', [
            'booking' => [
                'id' => $booking->id,
                'qr_code' => $booking->qr_code,
                'status' => $booking->status,
                'payment_status' => $booking->payment_status,
                'departure' => $booking->schedule->departure,
                'destination' => $booking->schedule->destination,
                'booking_date' => $booking->booking_date->format('Y-m-d'),
                'departure_time' => $booking->schedule->departure_time,
                'seats' => count(json_decode($booking->seat_numbers)),
            ]
        ]);
    }
}
