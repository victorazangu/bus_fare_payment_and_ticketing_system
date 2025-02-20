<?php

namespace App\Http\Controllers\Common;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreScheduleRequest;
use App\Http\Requests\UpdateScheduleRequest;
use App\Models\Bus;
use App\Models\Route;
use App\Models\Schedule;
use App\Models\ScheduleSeat;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ScheduleController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $query = Schedule::with(['bus', 'route'])->latest();

        if ($request->has('search')) {
            $search = $request->search;
            $query->whereHas('bus', function ($q) use ($search) {
                $q->where('registration_number', 'like', "%{$search}%")
                    ->orWhere('model', 'like', "%{$search}%");
            })->orWhereHas('route', function ($q) use ($search) {
                $q->where('origin', 'like', "%{$search}%")
                    ->orWhere('destination', 'like', "%{$search}%");
            });
        }

        if ($request->has('origin')) {
            $query->whereHas('route', function ($q) use ($request) {
                $q->where('origin', 'like', "%{$request->origin}%");
            });
        }
        if ($request->has('destination')) {
            $query->whereHas('route', function ($q) use ($request) {
                $q->where('destination', 'like', "%{$request->destination}%");
            });
        }
        $schedules = $query->paginate(10)->withQueryString();
        $schedules->getCollection()->transform(function ($schedule) {
            return [
                'id' => $schedule->id,
                'registration_number' => $schedule->bus->registration_number,
                'bus_model' => $schedule->bus->model,
                "bus_id" => $schedule->bus->id,
                'route_id' => $schedule->route->id,
                'capacity' => $schedule->bus->capacity,
                'origin' => $schedule->route->origin,
                'destination' => $schedule->route->destination,
                'distance' => $schedule->route->distance . " KM",
                'departure_time' => $schedule->departure_time->format('H:i'),
                'arrival_time' => $schedule->arrival_time->format('H:i'),
                'fare' => "KSH " . $schedule->fare,
                'frequency' => $schedule->frequency,
                'travel_day' => $schedule->travel_day,
            ];
        });


        $buses = Bus::get()->map(function ($bus) {
            return [
                "value" => $bus->id,
                "label" => $bus->registration_number . " - " . $bus->model,
            ];
        });
        $routes = Route::all()->map(function ($route) {
            return [
                "value" => $route->id,
                "label" => $route->origin . " to " . $route->destination,
            ];
        });

        return Inertia::render('Common/Schedule/Index', [
            'schedules' => $schedules,
            'buses' => $buses,
            'routes' => $routes,
            'columns' => [
                ['key' => 'origin', 'title' => 'Origin'],
                ['key' => 'destination', 'title' => 'Destination'],
                ['key' => 'distance', 'title' => 'Distance'],
                ['key' => 'registration_number', 'title' => 'Bus Reg Number'],
                ['key' => 'bus_model', 'title' => 'Bus Model'],
                ['key' => 'capacity', 'title' => 'Bus Capacity'],
                ['key' => 'departure_time', 'title' => 'Departure Time'],
                ['key' => 'arrival_time', 'title' => 'Estimated Arrival Time'],
                ['key' => 'fare', 'title' => 'Fare'],
                ['key' => 'frequency', 'title' => 'Schedule Frequency'],
                ['key' => 'travel_day', 'title' => 'Travel Day'],
            ],
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {

    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $data = $request->validate([
            'bus_id' => 'required|numeric|exists:buses,id',
            'route_id' => 'required|numeric|exists:routes,id',
            'departure_time' => 'required|date_format:H:i',
            'arrival_time' => 'required|date_format:H:i',
            'fare' => 'required|numeric',
            'frequency' => 'nullable|in:daily,weekly,monthly,yearly',
            'travel_day' => 'nullable|string',
        ]);
        $availableSeats = Bus::where('id', $data['bus_id'])->value('capacity');
        $data['available_seats'] = $availableSeats;
        $schedule = Schedule::create($data);
        $bus = Bus::find($data['bus_id']);
        $seats = $bus->seats;
        foreach ($seats as $seat) {
            ScheduleSeat::create([
                'schedule_id' => $schedule->id,
                'seat_id' => $seat->id,
                'is_booked' => false,
            ]);
        }

        return redirect()->back()->with('success', 'Schedule created successfully.');
    }

    /**
     * Display the specified resource.
     */
    public function show(Schedule $schedule)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Schedule $schedule)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Schedule $schedule)
    {
        $data = $request->validate([
            'bus_id' => 'required|numeric|exists:buses,id',
            'route_id' => 'required|numeric|exists:routes,id',
            'departure_time' => 'required|date_format:H:i',
            'arrival_time' => 'required|date_format:H:i',
            'fare' => 'required|string',
            'frequency' => 'nullable|in:daily,weekly,monthly,yearly',
            'travel_day' => 'nullable|string',
        ]);
        $fareString = $data['fare'];
        $fare = $this->sanitizeFare($fareString);
        $data['fare'] = $fare;
        $schedule->update($data);
        $bus = Bus::find($data['bus_id']);
        $seats = $bus->seats;
        foreach ($seats as $seat) {
            ScheduleSeat::updateOrCreate(
                ['schedule_id' => $schedule->id, 'seat_id' => $seat->id],
                ['is_booked' => false]
            );
        }

        return redirect()->route('schedules.index')->with('success', 'Schedule updated successfully.');
    }

    private function sanitizeFare($fareString)
    {
        $numericFare = preg_replace('/\D/', '', $fareString);
        return (int)$numericFare;
    }


    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Schedule $schedule)
    {
        if (auth()->user()->user_type !== 'admin') {
            abort(403, 'Unauthorized action.');
        }
        try {
            $schedule->delete();
            return redirect()->back()->with('success', 'Schedule deleted successfully.');
        } catch (\Exception $e) {
            return redirect()->back()->with('error', 'Failed to delete schedule: ' . $e->getMessage());
        }
    }

}
