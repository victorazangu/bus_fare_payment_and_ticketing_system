<?php

namespace App\Http\Controllers\Passenger;

use App\Models\Booking;
use App\Models\Bus;
use App\Models\Cancellation;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class PassengerDashboardController
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $totals = $this->getTotalsData();
        return Inertia::render('Passenger/Dashboard', [
            'totals' => $totals
        ]);
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
