<?php

namespace App\Http\Controllers\Common;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreBookingRequest;
use App\Http\Requests\UpdateBookingRequest;
use App\Models\Booking;
use App\Models\Notification;
use App\Models\Route;
use App\Models\Schedule;
use App\Models\ScheduleSeat;
use App\Models\Seat;
use App\Notifications\BookingConfirmation;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Str;
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
        $bookingsOptions = Booking::with(["schedule.bus", "schedule.route"])->get()->transform(function ($booking) {
            return [
                'value' => $booking->id,
                'label' => $booking->schedule->route->origin . ' to ' . $booking->schedule->route->destination
                    . ' (' . $booking->schedule->bus->registration_number . ')',
            ];
        });


        return Inertia::render('Common/Booking/Index',
            [
                'bookings' => $bookings,
                'schedules' => $schedules,
                'bookingsOptions' => $bookingsOptions,
            ]);
    }

    public function getAvailableSeats(Request $request)
    {
        $scheduleId = $request->query('schedule_id');
        $availableSeats = Seat::with(['scheduleSeats' => function ($query) use ($scheduleId) {
            $query->where('schedule_id', $scheduleId)
                ->where('is_booked', false);
        }])
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
            ->where('status', '!=', 'cancelled')
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
            try {
                $seatNumbers = $booking->getFormattedSeatNumbersAttribute();
            } catch (\Exception $e) {
                $seatNumbers = 'Error retrieving seats';
            }
            return [
                'id' => $booking->id,
                'user_name' => $booking->user->name,
                'registration_number' => $booking->schedule->bus->registration_number,
                'origin' => $booking->schedule->route->origin,
                'destination' => $booking->schedule->route->destination,
                'seat_numbers' => $seatNumbers,
                'booking_date' => $booking->booking_date->toDateString(),
                'payment_status' => $booking->payment_status,
                "status" => $booking->status,
                'total_fare' => "KSH " . $booking->total_fare,
                'payment_method' => optional($booking->paymentTransaction)->payment_method,
            ];
        });

        return [
            'bookings' => $bookings,
            'columns' => [
                ['key' => 'user_name', 'title' => 'Customer Name'],
                ['key' => 'registration_number', 'title' => 'Bus Reg Number'],
                ['key' => 'origin', 'title' => 'Origin'],
                ['key' => 'destination', 'title' => 'Destination'],
                ['key' => 'seat_numbers', 'title' => 'Seat Numbers'],
                ['key' => 'booking_date', 'title' => 'Booking Date'],
                ['key' => 'payment_status', 'title' => 'Payment Status'],
                ['key' => 'status', 'title' => 'Booking Status'],
                ['key' => 'total_fare', 'title' => 'Total Fare'],
//                ['key' => 'payment_method', 'title' => 'Payment Method'],
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

//    public function store(Request $request)
//    {
//        $request->validate([
//            'schedule_id' => 'required|exists:schedules,id',
//            'seat_numbers' => 'required|array',
//            'seat_numbers.*' => 'required|integer|exists:seats,id',
//            'booking_date' => 'required|date',
//            'promotion_id' => 'nullable|exists:promotions,id',
//        ]);
//        $schedule = Schedule::findOrFail($request->schedule_id);
//        $totalFare = $schedule->fare * count($request->seat_numbers);
//        $qrCode = "";
//        DB::beginTransaction();
//        try {
//            $booking = Booking::create([
//                'user_id' => auth()->user()->id,
//                'schedule_id' => $schedule->id,
//                'seat_numbers' => json_encode($request->seat_numbers),
//                'booking_date' => Carbon::parse($request->booking_date),
//                'payment_status' => 'pending',
//                'total_fare' => $totalFare,
//                'qr_code' => $qrCode,
//                'status' => "pending",
//            ]);
//            foreach ($request->seat_numbers as $seatId) {
//                ScheduleSeat::updateOrCreate(
//                    ['schedule_id' => $schedule->id, 'seat_id' => $seatId],
//                    ['is_booked' => true]
//                );
//            }
//            $schedule->decrement('available_seats', count($request->seat_numbers));
//            DB::commit();
//            return redirect()->route('bookings.index')->with('success', 'Booking has been created.');
//        } catch (\Exception $e) {
//            DB::rollBack();
//            return back()->with('error', 'Booking failed: ' . $e->getMessage());
//        }
//    }

    public function store(Request $request)
    {
        $now = Carbon::now('Africa/Nairobi');
        $request->validate([
            'schedule_id' => 'required|exists:schedules,id',
            'seat_numbers' => 'required|array',
            'seat_numbers.*' => 'required|integer|exists:seats,id',
            'booking_date' => 'required|date|after:' . $now,
            'promotion_id' => 'nullable|exists:promotions,id',
        ]);

        $schedule = Schedule::findOrFail($request->schedule_id);
        $totalFare = $schedule->fare * count($request->seat_numbers);
        $qrCodeToken = uniqid('BKG-', true) . '-' . auth()->user()->id . "-" . time() . '-' . Str::random(6);
        $booking_code = 'BK-NO-' . '-' . strtoupper(Str::random(6));

        DB::beginTransaction();
        try {
            $booking = Booking::create([
                'user_id' => auth()->user()->id,
                'schedule_id' => $schedule->id,
                'seat_numbers' => json_encode($request->seat_numbers),
//                to be gt than today
                'booking_date' => $request->booking_date,
                'payment_status' => 'pending',
                'total_fare' => $totalFare,
                'qr_code' => $qrCodeToken,
                'status' => "pending",
                'booking_code' => $booking_code,
            ]);
            $user = auth()->user();
            $user->notify(new BookingConfirmation($booking,$totalFare));
            foreach ($request->seat_numbers as $seatId) {
                ScheduleSeat::updateOrCreate(
                    ['schedule_id' => $schedule->id, 'seat_id' => $seatId],
                    ['is_booked' => true]
                );
            }
            $schedule->decrement('available_seats', count($request->seat_numbers));
            DB::commit();
            return redirect()->route('bookings.index')->with('success', 'Booking has been created.');
        } catch (\Exception $e) {
            DB::rollBack();
            return back()->with('error', 'Booking failed: ' . $e->getMessage());
        }
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
    public function update(Request $request, Booking $booking)
    {
        $request->validate([
            'schedule_id' => 'required|exists:schedules,id',
            'seat_numbers' => 'required|array',
            'seat_numbers.*' => 'integer|exists:seats,id',
            'booking_date' => 'required|date',
            'promotion_id' => 'nullable|exists:promotions,id',
            'status' => "nullable|string",
        ]);
        $schedule = Schedule::findOrFail($request->schedule_id);
        $totalFare = $schedule->fare * count($request->seat_numbers);
        DB::beginTransaction();
        try {
            $booking->update([
                'schedule_id' => $schedule->id,
                'seat_numbers' => json_encode($request->seat_numbers),
                'booking_date' => Carbon::parse($request->booking_date),
                'promotion_id' => $request->promotion_id,
                'total_fare' => $totalFare,
                'status' => $request->status
            ]);
            $oldSeatNumbers = json_decode($booking->seat_numbers);
            if ($oldSeatNumbers) {
                foreach ($oldSeatNumbers as $seatId) {
                    ScheduleSeat::updateOrCreate(
                        ['schedule_id' => $schedule->id, 'seat_id' => $seatId],
                        ['is_booked' => false]
                    );
                }
                $schedule->increment('available_seats', count($oldSeatNumbers));
            }
            foreach ($request->seat_numbers as $seatId) {
                ScheduleSeat::updateOrCreate(
                    ['schedule_id' => $schedule->id, 'seat_id' => $seatId],
                    ['is_booked' => true]
                );
            }
            $schedule->decrement('available_seats', count($request->seat_numbers));
            DB::commit();
            return redirect()->route('bookings.index')->with('success', 'Booking has been updated.');
        } catch (\Exception $e) {
            DB::rollBack();
            return back()->with('error', 'Booking update failed: ' . $e->getMessage());
        }
    }


    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Booking $booking)
    {
        if (!$booking) {
            return redirect()->route('bookings.index')->with('error', 'Booking not found.');
        }
        $booking->delete();
        return redirect()->route('bookings.index')->with('error', 'Booking has been deleted.');
    }


}
