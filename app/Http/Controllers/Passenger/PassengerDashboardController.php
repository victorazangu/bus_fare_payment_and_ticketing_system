<?php

namespace App\Http\Controllers\Passenger;

use App\Models\Booking;
use App\Models\Bus;
use App\Models\Cancellation;
use App\Models\PaymentTransaction;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class PassengerDashboardController
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $bookingStart = $this->getBookingDataForGraph();
        $totals = $this->getTotalsData();
        $paymentGatewayUseData = $this->getPaymentGatewayUseData();
        $bookingData = $this->getMostRecentBookings();
        return Inertia::render('Passenger/Dashboard', [
            'bookingStart' => $bookingStart,
            'totals' => $totals,
            "mostRecentBooking" => $bookingData,
            "paymentGatewayUseData" => $paymentGatewayUseData,
        ]);
    }

    public function getMostRecentBookings()
    {
        $passenger_id = Auth::id();
        $perPage = 5;
        $mostRecentBookings = Booking::with(['user', 'schedule', 'paymentTransaction'])
            ->where('user_id', $passenger_id)
            ->latest()
            ->limit($perPage)
            ->get();
        $formattedBookings = $mostRecentBookings->map(function ($booking) {
            return [
                'id' => $booking->id,
                'user' => $booking->user ? $booking->user->name : 'N/A',
                'schedule' => $booking->schedule && $booking->schedule->route
                    ? "{$booking->schedule->route->origin} to {$booking->schedule->route->destination}"
                    : 'N/A',
                'seat_numbers' => $booking->seat_numbers ?? 'N/A',
                'booking_date' => $booking->booking_date ? $booking->booking_date->format('Y-m-d') : 'N/A',
                'payment_status' => $booking->payment_status,
                'total_fare' => number_format($booking->total_fare, 2),
                'payment_transaction' => $booking->paymentTransaction
                    ? "Ref: {$booking->paymentTransaction->amount}"
                    : 'Unpaid',

            ];
        });
        $columns = [
            ['key' => 'id', 'title' => 'Booking ID'],
            ['key' => 'user', 'title' => 'Passenger Name'],
            ['key' => 'schedule', 'title' => 'route'],
            ['key' => 'seat_numbers', 'title' => 'Seat Numbers'],
            ['key' => 'booking_date', 'title' => 'Booking Date'],
            ['key' => 'payment_status', 'title' => 'Payment Status'],
            ['key' => 'total_fare', 'title' => 'Total Fare'],
            ['key' => 'payment_transaction', 'title' => 'Payment Reference'],
        ];

        return [
            'bookings' => $formattedBookings,
            'columns' => $columns,
        ];
    }

    private function getPaymentGatewayUseData()
    {
        $passenger_id = Auth::id();
        $paymentMethodCounts = PaymentTransaction::select('payment_method', DB::raw('count(*) as count'))
//            ->where('user_id', $passenger_id)
            ->groupBy('payment_method')
            ->pluck('count', 'payment_method')
            ->toArray();

        $labels = array_keys($paymentMethodCounts);
        $data = array_values($paymentMethodCounts);
        $colors = [
            'credit_card' => '#ba9d70',
            'paypal' => '#f0f0f0',
            'mobile_money' => '#36a2eb',
            'debit_card' => '#ff6384',
            "mpesa" => "#15532d",
        ];
        $backgroundColors = [];
        foreach ($labels as $label) {
            $backgroundColors[] = $colors[$label] ?? '#cccccc';
        }
        return [
            'labels' => $labels,
            'input' => $data,
            'label' => 'Payment Methods',
            'colors' => $backgroundColors,
        ];
    }


    private function getBookingDataForGraph()
    {
        $passenger_id = Auth::id();
        $currentYear = Carbon::now()->year;
        $bookingsByMonth = Booking::select(DB::raw('MONTH(booking_date) as month'), DB::raw('count(*) as count'))
            ->whereYear('booking_date', $currentYear)
            ->where('user_id', $passenger_id)
            ->groupBy('month')
            ->orderBy('month')
            ->get()
            ->pluck('count', 'month')
            ->toArray();

        $labels = [];
        $data = [];
        for ($month = 1; $month <= 12; $month++) {
            $monthName = Carbon::createFromDate(null, $month, null)->format('F');
            $labels[] = $monthName;
            $data[] = $bookingsByMonth[$month] ?? 0;
        }

        return [
            'labels' => $labels,
            'input' => $data,
            'label' => 'Bookings',
            'header' => 'Booking Data',
            'title' => 'Bookings Over Time',
            'backgroundColor' => '#ba9d70',
            'borderColor' => '#f0f0f0',
            'titleColor' => '#ba9d70',
        ];
    }

    private function getTotalsData()
    {
        $passengerId = Auth::id();
        return [
            'stats' => [
                [
                    'label' => 'Total Buses Used',
                    'value' => Bus::whereHas('schedules.bookings', function ($query) use ($passengerId) {
                        $query->where('user_id', $passengerId);
                    })->count(),
                    'color' => 'border-blue-500 bg-blue-100 dark:border-blue-300 dark:bg-blue-900'
                ],
                [
                    'label' => 'Total Tickets Booked',
                    'value' => Booking::where('user_id', $passengerId)->count(),
                    'color' => 'border-red-500 bg-red-100 dark:border-red-300 dark:bg-red-900'
                ],
                [
                    'label' => 'Total Cancellations',
                    'value' => Cancellation::whereHas('booking', function ($query) use ($passengerId) {
                        $query->where('user_id', $passengerId);
                    })->count(),
                    'color' => 'border-gray-500 bg-gray-100 dark:border-gray-300 dark:bg-gray-900'
                ],
                [
                    'label' => 'Upcoming Trips',
                    'value' => Booking::where('user_id', $passengerId)
                        ->whereHas('schedule', function ($query) {
                            $query->where('departure_time', '>', now());
                        })->count(),

                    'color' => 'border-purple-500 bg-purple-100 dark:border-purple-300 dark:bg-purple-900'
                ],
            ]
        ];
    }

}
