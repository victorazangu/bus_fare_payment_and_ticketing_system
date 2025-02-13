<?php

namespace App\Http\Controllers\Admin;

use App\Models\Booking;
use App\Models\Bus;
use App\Models\PaymentTransaction;
use App\Models\User;
use Carbon\Carbon;

use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class AdminDashboardController
{
    /**
     * Display a listing of the resourcae.
     */
    public function index()
    {
        $bookingStart = $this->getBookingDataForGraph();
        $userRegistration = $this->getUserRegistrationDataForBarChart();
        $paymentGatewayUseData = $this->getPaymentGatewayUseData();
        $totals = $this->getTotalsData();
        $passengersData = $this->getMostRecentPassengers();
        $bookingData = $this->getMostRecentBookings();
        $userTypeData = $this->getUserTypeData();

        return Inertia::render('Admin/Dashboard', [
            'bookingStart' => $bookingStart,
            "userRegistration" => $userRegistration,
            "paymentGatewayUseData" => $paymentGatewayUseData,
            "totals" => $totals,
            "mostRecentPassengers" => $passengersData,
            "mostRecentBooking" => $bookingData,
            "userTypeData" => $userTypeData
        ]);
    }

    private function getUserTypeData()
    {
        $userTypeCounts = User::select('user_type', DB::raw('count(*) as count'))
            ->groupBy('user_type')
            ->pluck('count', 'user_type')
            ->toArray();

        $labels = array_keys($userTypeCounts);
        $data = array_values($userTypeCounts);
        $colors = [
            'admin' => '#ff6384',
            'passenger' => '#36a2eb',
            'driver' => '#ffcd56',
        ];
        $backgroundColors = [];
        foreach ($labels as $label) {
            $backgroundColors[] = $colors[$label] ?? '#cccccc';
        }

        return [
            'labels' => $labels,
            'input' => $data,
            'label' => 'User Types',
            'colors' => $backgroundColors,
        ];
    }


    public function getMostRecentPassengers()
    {
        $perPage = 5;

        $mostRecentPassengers = User::where('user_type', 'passenger')
            ->orderBy('created_at', 'desc')
            ->limit($perPage)
            ->get();

        return [
            'passengers' => $mostRecentPassengers,
            'columns' => [
                ['key' => 'name', 'title' => 'Name'],
                ['key' => 'email', 'title' => 'Email'],
                ['key' => 'phone', 'title' => 'Phone'],
                ['key' => 'address', 'title' => 'Address'],
                ['key' => 'created_at', 'title' => 'Registration Date'],
            ],
        ];
    }

    public function getMostRecentBookings()
    {
        $perPage = 5;
        $mostRecentBookings = Booking::with(['user', 'schedule', 'paymentTransaction'])
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

    private function getBookingDataForGraph()
    {
        // Get the current year
        $currentYear = Carbon::now()->year;

        // Get the booking counts for each month of the current year
        $bookingsByMonth = Booking::select(DB::raw('MONTH(booking_date) as month'), DB::raw('count(*) as count'))
            ->whereYear('booking_date', $currentYear)
            ->groupBy('month')
            ->orderBy('month')
            ->get()
            ->pluck('count', 'month')
            ->toArray();

        $labels = [];
        $data = [];
        for ($month = 1; $month <= 12; $month++) {
            $monthName = Carbon::createFromDate(null, $month, null)->format('F'); // Get month name
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

    private function getUserRegistrationDataForBarChart()
    {
        $currentYear = Carbon::now()->year;
        $usersByMonth = User::select(DB::raw('MONTH(created_at) as month'), DB::raw('count(*) as count'))
            ->whereYear('created_at', $currentYear)
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
            $data[] = $usersByMonth[$month] ?? 0;
        }
        return [
            'labels' => $labels,
            'input' => $data,
            'title' => "User Registrations Over Time",
            'header' => "User Registrations Data",
            'label' => "Users",
            'backgroundColor' => "#ba9d70",
            'borderColor' => "#f0f0f0",
        ];
    }


    private function getPaymentGatewayUseData()
    {
        $paymentMethodCounts = PaymentTransaction::select('payment_method', DB::raw('count(*) as count'))
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

    private function getTotalsData()
    {
        return [
            'stats' => [
                [
                    'label' => 'Total Buses',
                    'value' => Bus::count(),
                    'color' => 'border-blue-500 bg-blue-100 dark:border-blue-300 dark:bg-blue-900'
                ],
                [
                    'label' => 'Total Users',
                    'value' => User::where('user_type', 'passenger')->count(),
                    'color' => 'border-green-500 bg-green-100 dark:border-green-300 dark:bg-green-900'
                ],
                [
                    'label' => 'Total Drivers',
                    'value' => User::where('user_type', 'driver')->count(),
                    'color' => 'border-yellow-500 bg-yellow-100 dark:border-yellow-300 dark:bg-yellow-900'
                ],
                [
                    'label' => 'Total Tickets',
                    'value' => Booking::count(),
                    'color' => 'border-red-500 bg-red-100 dark:border-red-300 dark:bg-red-900'
                ],
            ]
        ];
    }


}
