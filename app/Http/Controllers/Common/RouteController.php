<?php

namespace App\Http\Controllers\Common;

use App\Models\Route;
use App\Models\Schedule;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Inertia\Inertia;

class RouteController
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $routes = $this->getTrips($request);
        return Inertia::render('Common/Route/Index',
            [
                'routes' => $routes,
                "success" => session('success')
            ]
        );

    }

    public function getTrips($request): array
    {
        $search = $request->input('search');
        $routes = Route::latest()
            ->when($search, function ($query, $search) {
                $query->where(function ($q) use ($search) {
                    $q->where('origin', 'like', "%{$search}%")
                        ->orWhere('destination', 'like', "%{$search}%");
                });
            })
            ->orderBy('created_at', 'desc')
            ->get();
        return [
            'routes' => $routes,
            'columns' => [
                ['key' => 'origin', 'title' => 'Origin'],
                ['key' => 'destination', 'title' => 'Destination'],
                ['key' => 'distance', 'title' => 'Distance'],
                ['key' => 'created_at', 'title' => 'Created on Date'],
                ['key' => 'updated_at', 'title' => 'Last Update Date'],
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

        $data = $request->validate([
            'origin' => 'required',
            'destination' => 'required',
            'distance' => 'required|numeric',
            'estimated_travel_time' => 'required',
        ]);
        $route = Route::create($data);
//        dd($route);
        return redirect()->back()->with('success', 'Route created successfully.');
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
        $data = $request->validate([
            'origin' => 'required|string|max:255',
            'destination' => 'required|string|max:255',
            'distance' => 'required|numeric',
            'estimated_travel_time' => 'required|string',
        ]);
        $route->update($data);
        return redirect()->route('routes.index')->with('success', 'Route updated successfully.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Route $route)
    {
        $deleted = Route::destroy($route->id);
        return redirect()->route('routes.index')->with('success', 'Route deleted successfully.');
    }

}
