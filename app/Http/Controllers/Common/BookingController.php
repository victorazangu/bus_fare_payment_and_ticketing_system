<?php

namespace App\Http\Controllers\Common;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreBookingRequest;
use App\Http\Requests\UpdateBookingRequest;
use App\Models\Booking;
use App\Models\Route;
use App\Models\Schedule;
use App\Models\ScheduleSeat;
use App\Models\Seat;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;

class BookingController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $bookings = $this->getBookings($request);
        $schedules = Schedule::with(["route", "bus"])->get()->map(function ($schedule) {
            return [
                "value" => $schedule->id,
                "label" => $schedule->route->origin . " to " . $schedule->route->destination . "(" . $schedule->bus->registration_number . ")"
            ];
        });


        return Inertia::render('Common/Booking/Index',
            [
                'bookings' => $bookings,
                'schedules' => $schedules,
            ]);
    }

    public function getAvailableSeats(Request $request)
    {
        $scheduleId = $request->query('schedule_id');

        $availableSeats = Seat::with(['bus'])
            ->whereHas('scheduleSeats', function ($query) use ($scheduleId) {
                $query->where('schedule_id', $scheduleId)
                    ->where('is_booked', false);
            })
            ->get()
            ->map(function ($seat) {
                return [
                    'value' => $seat->id,
                    'label' => $seat->seat_number,
                ];
            });

        return response()->json($availableSeats);
    }


    public function getBookings($request)
    {
        $user = auth()->user();
        $query = Booking::with(['user', 'schedule.route', 'schedule.bus', 'paymentTransaction'])
            ->latest();
        if ($user->isAdmin()) {
        } elseif ($user->isDriver()) {
            $query->whereHas('schedule.bus.busDrivers', function ($q) use ($user) {
                $q->where('user_id', $user->id);
            });
        } elseif ($user->isCustomer()) {
            $query->where('user_id', $user->id);
        }
        if ($request->has('search')) {
            $search = $request->search;
            $query->whereHas('user', function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%");
            })->orWhereHas('schedule.route', function ($q) use ($search) {
                $q->where('origin', 'like', "%{$search}%");
            });
        }

        $bookings = $query->paginate(10)->withQueryString();
        $bookings->getCollection()->transform(function ($booking) {
            return [
                'id' => $booking->id,
                'user_name' => $booking->user->name,
                'registration_number' => $booking->schedule->bus->registration_number,
                'origin' => $booking->schedule->route->origin,
                'destination' => $booking->schedule->route->destination,
                'seat_numbers' => $booking->seat_numbers,
                'booking_date' => $booking->booking_date->toDateString(),
                'payment_status' => $booking->payment_status,
                'total_fare' => "KSH " . $booking->total_fare,
                'payment_method' => optional($booking->paymentTransaction)->payment_method,
            ];
        });

        return [
            'bookings' => $bookings,
            'filters' => [
                'search' => $request->search,
            ],
            'columns' => [
                ['key' => 'user_name', 'title' => 'Customer Name'],
                ['key' => 'registration_number', 'title' => 'Bus Reg Number'],
                ['key' => 'origin', 'title' => 'Origin'],
                ['key' => 'destination', 'title' => 'Destination'],
                ['key' => 'seat_numbers', 'title' => 'Seat Numbers'],
                ['key' => 'booking_date', 'title' => 'Booking Date'],
                ['key' => 'payment_status', 'title' => 'Payment Status'],
                ['key' => 'total_fare', 'title' => 'Total Fare'],
                ['key' => 'payment_method', 'title' => 'Payment Method'],
            ],
        ];
    }


    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreBookingRequest $request)
    {
        //
    }

    /**
     * Display the specified resource.
     */
    public function show(Booking $booking)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Booking $booking)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateBookingRequest $request, Booking $booking)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Booking $booking)
    {
        //
    }
}
