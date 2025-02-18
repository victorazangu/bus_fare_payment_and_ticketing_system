<?php

namespace App\Http\Controllers\Common;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreBusRequest;
use App\Http\Requests\UpdateBusRequest;
use App\Models\Bus;
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
    public function store(StoreBusRequest $request)
    {
        //
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
    public function update(UpdateBusRequest $request, Bus $bus)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Bus $bus)
    {
        //
    }
}
