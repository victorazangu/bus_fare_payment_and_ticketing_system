<?php

namespace App\Http\Controllers\Driver;

use App\Models\Bus;
use App\Models\Notification;
use App\Models\PaymentTransaction;
use App\Models\Schedule;
use Illuminate\Http\Request;
use Inertia\Inertia;

class DriverDashboardController
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $totals = $this->getDriverMetrics();
        $recentTrips = $this->getRecentTrips();
        $availableBuses = $this->getAvailableBuses();
        return Inertia::render('Driver/Dashboard', [
            "totals" => $totals,
            "recentTrips" => $recentTrips,
            "availableBuses" => $availableBuses,
        ]);
    }

    public function getAvailableBuses()
    {
        $perPage = 5;

        $availableBuses = Bus::whereDoesntHave('schedules', function ($query) {
            $query->where('departure_time', '>=', now());
        })
            ->orderBy('registration_number', 'asc')
            ->limit($perPage)
            ->get(['id', 'registration_number', 'capacity', 'model', 'year']);

        return [
            'buses' => $availableBuses,
            'columns' => [
                ['key' => 'registration_number', 'title' => 'Registration Number'],
                ['key' => 'capacity', 'title' => 'Capacity'],
                ['key' => 'model', 'title' => 'Model'],
                ['key' => 'year', 'title' => 'Year'],
            ],
        ];
    }



    public function getRecentTrips()
    {
        $perPage = 10;

        $recentTrips = Schedule::select('schedules.id', 'routes.origin', 'routes.destination', 'schedules.departure_time', 'schedules.arrival_time', 'buses.registration_number')
            ->join('bus_drivers', 'schedules.id', '=', 'bus_drivers.schedule_id')
            ->join('buses', 'schedules.bus_id', '=', 'buses.id')
            ->join('routes', 'schedules.route_id', '=', 'routes.id')
            ->where('bus_drivers.user_id', auth()->id())
            ->orderBy('schedules.departure_time', 'desc')
            ->limit($perPage)
            ->get();

        return [
            'trips' => $recentTrips,
            'columns' => [
                ['key' => 'registration_number', 'title' => 'Bus'],
                ['key' => 'origin', 'title' => 'Origin'],
                ['key' => 'destination', 'title' => 'Destination'],
                ['key' => 'departure_time', 'title' => 'Departure Time'],
                ['key' => 'arrival_time', 'title' => 'Arrival Time'],
            ],
        ];
    }


    private function getDriverMetrics()
    {
        $user = auth()->user();

        if ($user->user_type !== 'driver') {
            return ['message' => 'Unauthorized', 'status' => 403];
        }
        $earnings = PaymentTransaction::whereHas('booking.schedule.bus.busDrivers', function ($query) use ($user) {
            $query->where('user_id', $user->id);
        })->sum('amount');

        return [
            'stats' => [
                [
                    'label' => 'Active Buses',
                    'value' => $user->busDrivers()->count(),
                    'color' => 'border-blue-500 bg-blue-100 dark:border-blue-300 dark:bg-blue-900'
                ],
                [
                    'label' => 'Total Routes',
                    'value' => $user->bookings()->count(),
                    'color' => 'border-green-500 bg-green-100 dark:border-green-300 dark:bg-green-900'
                ],
                [
                    'label' => 'Earnings',
                    'value' => $earnings,
                    'color' => 'border-yellow-500 bg-yellow-100 dark:border-yellow-300 dark:bg-yellow-900'
                ]
            ]
        ];
    }


}
