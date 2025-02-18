<?php

namespace App\Http\Controllers\Common;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreNotificationRequest;
use App\Models\Notification;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class NotificationController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $searchTerm = $request->query('search');

        $notifications = Auth::user()->notifications()
            ->when($searchTerm, function ($query, $searchTerm) {
                $query->where('type', 'like', "%{$searchTerm}%");
            })
            ->latest()
            ->get()
            ->map(function ($notification) {
                return [
                    'id' => $notification->id,
                    'type' => $notification->type,
                    'sent_at' => $notification->sent_at ? $notification->sent_at->toDateTimeString() : "N/A",
                    'read_at' => $notification->read_at ? $notification->read_at->diffForHumans() : "Unread",
                    'message' => $notification->message,
                ];
            });

        return Inertia::render('Common/Notification/Index', [
            "notifications" => [
                'notifications' => $notifications,
                'columns' => [
                    ['key' => 'type', 'title' => 'Notification Type'],
                    ['key' => 'message', 'title' => 'Notification Message'],
                    ['key' => 'sent_at', 'title' => 'Sent On'],
                    ['key' => 'read_at', 'title' => 'Read On'],
                ],
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
    public function store(StoreNotificationRequest $request)
    {
        //
    }

    /**
     * Display the specified resource.
     */
    public function show(Notification $notification)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Notification $notification)
    {

    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Notification $notification)
    {
        if ($notification->user_id !== auth()->id()) {
            return redirect()->back()->withErrors("You don't have permission to edit this notification.");
        }
        $notification->read_at = Carbon::now();
        $notification->save();
        return redirect()->back()->with("success", "Notification updated successfully.");
    }


    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Notification $notification)
    {
        //
    }
}
