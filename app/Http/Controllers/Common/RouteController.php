<?php

namespace App\Http\Controllers\Common;

use App\Http\Controllers\Controller;
use App\Models\Route;
use Illuminate\Http\Request;
use Inertia\Inertia;

class RouteController extends Controller
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
            ->paginate(10)
            ->withQueryString();

        $routes->getCollection()->transform(function ($trip) {
            return [
                'id' => $trip->id,
                'origin' => $trip->origin,
                'destination' => $trip->destination,
                'distance' => $trip->distance . " KM",
                "estimated_travel_time" => $trip->estimated_travel_time . " Hrs",
                'created_at' => $trip->created_at->toDateTimeString(),
                'updated_at' => $trip->updated_at->diffForHumans(),
            ];
        });

        return [
            'routes' => $routes,
            'columns' => [
                ['key' => 'origin', 'title' => 'Origin'],
                ['key' => 'destination', 'title' => 'Destination'],
                ['key' => 'distance', 'title' => 'Distance'],
                ['key' => 'estimated_travel_time', 'title' => 'Estimated Travel Time'],
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
            'distance' => 'required|string',
            'estimated_travel_time' => 'required|string',
        ]);
        $data['distance'] = $this->sanitizeDistance($data['distance']);
        $data['estimated_travel_time'] = $this->sanitizeTravelTime($data['estimated_travel_time']);
        $route->update($data);
        return redirect()->route('routes.index')->with('success', 'Route updated successfully.');
    }

    protected function sanitizeDistance($distance)
    {
        return floatval(preg_replace('/[^0-9.]/', '', $distance));
    }
    protected function sanitizeTravelTime($travelTime)
    {
        return floatval(preg_replace('/[^0-9.]/', '', $travelTime));
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
