<?php

namespace App\Http\Controllers\Common;

use App\Http\Controllers\Controller;
use App\Http\Requests\StorePaymentTransactionRequest;
use App\Http\Requests\UpdatePaymentTransactionRequest;
use App\Models\Booking;
use App\Models\MpesaSTK;
use App\Models\PaymentTransaction;
use App\Notifications\PaymentConfirmation;
use Carbon\Carbon;
use Iankumu\Mpesa\Facades\Mpesa;
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
    public function store(Request $request)
    {
        $data = $request->validate([
            'transaction_id' => 'required',
            'booking_id' => 'required',
            'amount' => 'required|numeric:max:10000',
            'payment_method' => 'required',
            'status' => 'required',
        ]);
        $booking = Booking::findOrFail($data['booking_id']);
        $paymentdate = Carbon::now();
        $data['payment_date'] = $paymentdate->toDateString();
        if ($data['amount'] == $booking->total_fare) {
            $booking->payment_status = 'paid';
            $booking->total_fare = $booking->total_fare - $data['amount'];
            $booking->save();
            PaymentTransaction::create($data);
            return redirect()->route('payments.index')->with('success', 'Payment transaction completed successfully.');
        } elseif ($data['amount'] < $booking->total_fare) {
            $booking->payment_status = 'partial';
            $booking->total_fare = $booking->total_fare - $data['amount'];
            $booking->save();
            PaymentTransaction::create($data);

            $difference = $booking->total_fare - $data['amount'];
            return redirect()->route('payments.index')->with('warning', 'Payment is less than the booking amount by ' . $difference . '. The status is partially paid.');
        } else {
            $booking->payment_status = 'overpaid';
            $booking->total_fare = $data['amount'] - $booking->total_fare;
            $booking->save();
            PaymentTransaction::create($data);
            $difference = $booking->total_fare - $data['amount'];
            return redirect()->route('payments.index')->with('info', 'Payment is greater than the booking amount by ' . $difference . '. The status is overpaid.');
        }
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

//    public function autoPayment(Request $request)
//    {
//        $booking = Booking::with(["schedule.bus"])->findOrFail($request->booking_id);
//        $user = auth()->user();
//        $amount = $booking->total_fare;
//        $phoneNo = $user->phone;
//        $account_number = "Bus-" . $booking->schedule->bus->registration_number;
//        if ($request->payment_method === 'mpesa') {
//            $response = Mpesa::stkpush($phoneNo, $amount, $account_number);
//            $result = $response->json();
////            if ($result['ResponseCode'] === 0) {
//            MpesaSTK::create([
//                'merchant_request_id' => $result['MerchantRequestID'],
//                'checkout_request_id' => $result['CheckoutRequestID']
//            ]);
//            $paymentTransaction = PaymentTransaction::create(
//                [
//                    'booking_id' => $booking->id,
//                    "transaction_id" => $result['CheckoutRequestID'],
//                    'amount' => $amount,
//                    'payment_method' => 'mpesa',
//                    'status' => 'Paid',
//                    'payment_date' => Carbon::now('Africa/Nairobi')->toDateString(),
//                ]
//            );
//            $booking->payment_status = 'paid';
//            $booking->save();
//            $paymentTransaction->booking->user->notify(new PaymentConfirmation($paymentTransaction));
//
//            return redirect()->route('payments.index')->with('success', 'Payment transaction initiated. Enter M Pesa pin');
////            } else {
////                return redirect()->route('payments.index')->with('error', $result['ResponseDescription']);
////            }
//        } else if ($request->payment_method === 'cash') {
//            sleep(1);
//            return redirect()->route('payments.index')->with('success', 'Payment transaction completed successfully.');
//
//        }
//    }

    public function autoPayment(Request $request)
    {
        $booking = Booking::with(["schedule.bus"])->findOrFail($request->booking_id);

//        if ($booking->payment_status == 'paid') {
//            return redirect()->route('bookings.index')->with('error', 'Payment is already paid.');
//        }
        $user = auth()->user();
        $amount = $booking->total_fare;
        $phoneNo = $user->phone;
        $account_number = $booking->booking_code;

        if ($request->payment_method === 'mpesa') {
            $response = Mpesa::stkpush($phoneNo, $amount, $account_number);
            $result = $response->json();
//            if ($result['ResponseCode'] === 0) {
            MpesaSTK::create([
                'merchant_request_id' => $result['MerchantRequestID'],
                'checkout_request_id' => $result['CheckoutRequestID']
            ]);

            return redirect()->route('bookings.index')->with('success', 'Payment transaction initiated. Enter M Pesa pin');
//            } else {
//                return redirect()->route('payments.index')->with('error', $result['ResponseDescription']);
//            }
        }
        return redirect()->route('bookings.index')->with('error', 'Invalid payment method.');
    }


    function formatPhoneNumber($phone)
    {
        $phone = preg_replace('/[^0-9]/', '', $phone);
        return '254' . substr($phone, -9);
    }


}
