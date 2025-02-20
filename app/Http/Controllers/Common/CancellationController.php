<?php

namespace App\Http\Controllers\Common;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreCancellationRequest;
use App\Http\Requests\UpdateCancellationRequest;
use App\Models\Booking;
use App\Models\Cancellation;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Inertia\Inertia;

class CancellationController extends Controller
{
    /**
     * Display a listing of the resource.
     */

    public function index(Request $request)
    {
        $user = auth()->user();
        $query = Cancellation::with([
            'booking.user',
            'booking.schedule.route',
            'booking.schedule.bus'
        ])->latest();

        if ($user->user_type === 'admin') {
        } elseif ($user->user_type === 'driver') {
            $query->whereHas('booking.schedule.bus.busDrivers', function ($q) use ($user) {
                $q->where('user_id', $user->id);
            });
        } else {
            $query->whereHas('booking', function ($q) use ($user) {
                $q->where('user_id', $user->id);
            });
        }
        if ($request->has('search')) {
            $search = $request->search;
            $query->whereHas('booking.user', function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%");
            })
                ->orWhereHas('booking.schedule.bus', function ($q) use ($search) {
                    $q->where('registration_number', 'like', "%{$search}%");
                });
        }

        $cancellations = $query->paginate(10)->withQueryString();
        $cancellations->getCollection()->transform(function ($cancellation) {
            return [
                'id' => $cancellation->id,
                'status' => $cancellation->status,
                'cancellation_date' => $cancellation->cancellation_date->toDateString(),
                'refund_amount' => "KSH " . $cancellation->refund_amount,
                'reason' => $cancellation->reason,
                'customer_name' => $cancellation->booking->user->name,
                'bus_reg_number' => $cancellation->booking->schedule->bus->registration_number,
                'origin' => $cancellation->booking->schedule->route->origin,
                'destination' => $cancellation->booking->schedule->route->destination,
            ];
        });

        return Inertia::render('Common/Cancellation/Index', [
            'cancellations' => $cancellations,
            'filters' => [
                'search' => $request->search,  // Preserves the search input
            ],
            'columns' => [
                ['key' => 'status', 'title' => 'Status'],
                ['key' => 'cancellation_date', 'title' => 'Cancellation Date'],
                ['key' => 'refund_amount', 'title' => 'Refund Amount'],
                ['key' => 'reason', 'title' => 'Reason'],
                ['key' => 'customer_name', 'title' => 'Customer Name'],
                ['key' => 'bus_reg_number', 'title' => 'Bus Reg Number'],
                ['key' => 'origin', 'title' => 'Origin'],
                ['key' => 'destination', 'title' => 'Destination'],
            ],
        ]);
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
    public function store(Request $request)
    {
        $data = $request->validate([
            'booking_id' => 'required|exists:bookings,id',
            'reason' => 'required|string',
        ]);

        $booking = Booking::find($data['booking_id']);
        $booking->cancellations()->create([
            'reason' => $data['reason'],
            'cancellation_date' => Carbon::now(),
            'refund_amount' => $booking->total_fare,
            "status" => "cancelled",
        ]);

        $booking->update(['status' => "cancelled"]);
        return redirect()->back()->with('success', 'Cancellation Created Successfully');

    }

    /**
     * Display the specified resource.
     */
    public function show(Cancellation $cancellation)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Cancellation $cancellation)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateCancellationRequest $request, Cancellation $cancellation)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Cancellation $cancellation)
    {
        //
    }
}
