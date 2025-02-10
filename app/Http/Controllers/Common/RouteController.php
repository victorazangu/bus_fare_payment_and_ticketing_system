<?php

namespace App\Http\Controllers\Common;

use App\Models\Route;
use App\Models\Schedule;
use Illuminate\Http\Request;
use Inertia\Inertia;

class RouteController
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $routes = $this->getTrips();
        return Inertia::render('Common/Route/Index',
            ['routes' => $routes]
        );

    }

    public function getTrips(): array
    {
        $routes = Schedule::select('schedules.id', 'routes.origin', 'routes.destination', 'schedules.departure_time', 'schedules.arrival_time', 'buses.registration_number')
            ->join('bus_drivers', 'schedules.id', '=', 'bus_drivers.schedule_id')
            ->join('buses', 'schedules.bus_id', '=', 'buses.id')
            ->join('routes', 'schedules.route_id', '=', 'routes.id')
            ->orderBy('schedules.departure_time', 'desc')
            ->get();
        return [
            'routes' => $routes,
            'columns' => [
                ['key' => 'registration_number', 'title' => 'Bus'],
                ['key' => 'origin', 'title' => 'Origin'],
                ['key' => 'destination', 'title' => 'Destination'],
                ['key' => 'departure_time', 'title' => 'Departure Time'],
                ['key' => 'arrival_time', 'title' => 'Arrival Time'],
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
    public function store(Request $request)
    {
        //
    }

    /**
     * Display the specified resource.
     */
    public function show(Route $route)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Route $route)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Route $route)
    {
        dd("ok");
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Route $route)
    {
        dd("ok");
        Route::destroy($route);
    }
}
