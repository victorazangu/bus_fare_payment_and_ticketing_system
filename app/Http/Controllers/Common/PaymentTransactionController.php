<?php

namespace App\Http\Controllers\Common;

use App\Http\Controllers\Controller;
use App\Http\Requests\StorePaymentTransactionRequest;
use App\Http\Requests\UpdatePaymentTransactionRequest;
use App\Models\Booking;
use App\Models\PaymentTransaction;
use Illuminate\Http\Request;
use Inertia\Inertia;

class PaymentTransactionController extends Controller
{
    /**
     * Display a listing of the resource.
     */

    public function index(Request $request)
    {
        $user = auth()->user();
        $query = PaymentTransaction::with(['booking.user', 'booking.schedule.route', 'booking.schedule.bus'])
            ->latest();
        if ($user->isAdmin()) {
        } elseif ($user->isDriver()) {
            $query->whereHas('booking.schedule.bus.busDrivers', function ($q) use ($user) {
                $q->where('user_id', $user->id);
            });
        } elseif ($user->isCustomer()) {
            $query->whereHas('booking', function ($q) use ($user) {
                $q->where('user_id', $user->id);
            });
        }
        if ($request->has('search')) {
            $search = $request->search;
            $query->where('transaction_id', 'like', "%{$search}%")
                ->orWhereHas('booking.user', function ($q) use ($search) {
                    $q->where('name', 'like', "%{$search}%");
                });
        }

        $transactions = $query->paginate(10)->withQueryString();
        $transactions->getCollection()->transform(function ($transaction) {
            return [
                'id' => $transaction->id,
                'transaction_id' => $transaction->transaction_id,
                'amount' => "KSH " . $transaction->amount,
                'payment_method' => $transaction->payment_method,
                'status' => $transaction->status,
                'payment_date' => $transaction->payment_date->toDateString(),
                'customer_name' => $transaction->booking->user->name,
                'bus_reg_number' => $transaction->booking->schedule->bus->registration_number,
                'origin' => $transaction->booking->schedule->route->origin,
                'destination' => $transaction->booking->schedule->route->destination,
            ];
        });
        $bookings = Booking::with(["schedule.bus", "schedule.route"])->get()->transform(function ($booking) {
            return [
                'value' => $booking->id,
                'label' => $booking->schedule->route->origin . ' to ' . $booking->schedule->route->destination
                    . ' (' . $booking->schedule->bus->registration_number . ')',
            ];
        });
        return Inertia::render('Common/PaymentTransaction/Index', [
            'transactions' => $transactions,
            'bookings' => $bookings,
            'columns' => [
                ['key' => 'transaction_id', 'title' => 'Transaction ID'],
                ['key' => 'amount', 'title' => 'Amount'],
                ['key' => 'payment_method', 'title' => 'Payment Method'],
                ['key' => 'status', 'title' => 'Status'],
                ['key' => 'payment_date', 'title' => 'Payment Date'],
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
    public function store(StorePaymentTransactionRequest $request)
    {
        //
    }

    /**
     * Display the specified resource.
     */
    public function show(PaymentTransaction $paymentTransaction)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(PaymentTransaction $paymentTransaction)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdatePaymentTransactionRequest $request, PaymentTransaction $paymentTransaction)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(PaymentTransaction $paymentTransaction)
    {
        //
    }
}
