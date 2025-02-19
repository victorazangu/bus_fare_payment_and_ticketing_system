<?php

namespace App\Http\Controllers\Common;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreBusRequest;
use App\Http\Requests\UpdateBusRequest;
use App\Models\Bus;
use App\Models\ScheduleSeat;
use App\Models\Seat;
use Illuminate\Http\Request;
use Inertia\Inertia;

class BusController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $query = Bus::latest();

        if ($request->has('search')) {
            $search = $request->search;
            $query->where('registration_number', 'like', "%{$search}%")
                ->orWhere('model', 'like', "%{$search}%");
        }
        $buses = $query->paginate(10)->withQueryString();
        return Inertia::render('Common/Bus/Index', [
            'buses' => $buses,
            'columns' => [
                ['key' => 'registration_number', 'title' => 'Registration Number'],
                ['key' => 'capacity', 'title' => 'Capacity'],
                ['key' => 'model', 'title' => 'Model'],
                ['key' => 'year', 'title' => 'Year'],
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
        $request->validate([
            'registration_number' => 'required|string|unique:buses,registration_number',
            'model' => 'required|string',
            'capacity' => 'required|numeric|min:4|max:100',
            'year' => 'required|numeric|min:1900',
        ]);
        $bus = Bus::create($request->all());
        $seatCount = $request->input('capacity');
        $scheduleId = $request->input('schedule_id');
        $rows = range('A', 'Z');
        $seatsPerRow = 4;
        $currentRowIndex = 0;
        $seatNumber = 1;
        for ($i = 1; $i <= $seatCount; $i++) {
            $row = $rows[$currentRowIndex];
            $seatLabel = $i . $row;

            // Create the seat
            $seat = Seat::create([
                'bus_id' => $bus->id,
                'seat_number' => $seatLabel,
                'seat_type' => $this->getSeatType($i),
            ]);

            if ($i % $seatsPerRow == 0) {
                $currentRowIndex++;
            }
        }

        return redirect()->route('buses.index')->with('success', 'Bus and seats created successfully.');
    }


    private function getSeatType($seatIndex)
    {
        if ($seatIndex % 2 == 0) {
            return 'aisle';
        }
        return 'window';
    }

    /**
     * Display the specified resource.
     */
    public function show(Bus $bus)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Bus $bus)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Bus $bus)
    {
        $request->validate([
            'registration_number' => 'required|string|unique:buses,registration_number,' . $bus->id,
            'model' => 'required|string',
            'capacity' => 'required|numeric|min:4|max:100',
            'year' => 'required|numeric|min:1900',
        ]);
        $seatCount = $request->input('capacity');
        $seats = Seat::where('bus_id', $bus->id)->get();

        foreach ($seats as $seat) {
            ScheduleSeat::where('seat_id', $seat->id)->delete();
        }
        Seat::where('bus_id', $bus->id)->delete();
        $rows = range('A', 'Z');
        $seatsPerRow = 4;
        $currentRowIndex = 0;
        $seatNumber = 1;
        for ($i = 1; $i <= $seatCount; $i++) {
            $row = $rows[$currentRowIndex];
            $seatLabel = $seatNumber . $row;
            $seat = Seat::create([
                'bus_id' => $bus->id,
                'seat_number' => $seatLabel,
                'seat_type' => $this->getSeatType($i),
            ]);
            $seatNumber++;
            if ($i % $seatsPerRow == 0) {
                $currentRowIndex++;
            }
        }
        $bus->update($request->all());
        return redirect()->route('buses.index')->with('success', 'Bus and seats updated successfully.');
    }


    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Bus $bus)
    {
        if (!$bus) {
            return redirect()->route('buses.index')->with('error', 'Bus not found');
        }
        $bus->delete();
        return redirect()->route('buses.index')->with('success', 'Bus deleted successfully');
    }
}
