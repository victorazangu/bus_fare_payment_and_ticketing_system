<?php

namespace App\Http\Middleware;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Middleware;

class HandleInertiaRequests extends Middleware
{
    /**
     * The root template that is loaded on the first page visit.
     *
     * @var string
     */
    protected $rootView = 'app';
    protected $proxies = '*';


    /**
     * Determine the current asset version.
     */
    public function version(Request $request): ?string
    {
        return parent::version($request);
    }

    /**
     * Define the props that are shared by default.
     *
     * @return array<string, mixed>
     */
    public function share(Request $request): array
    {
        return array_merge(parent::share($request), [
            'auth' => function () {
                if (Auth::check()) {
                    $user = Auth::user();
                    $notifications = $user->notifications()
                        ->latest()
                        ->get()
                        ->map(function ($notification) {
                            return [
                                'id' => $notification->id,
                                'type' => $notification->type,
                                'message' => $notification->message,
                                'sent_at' => $notification->sent_at->format('Y-m-d H:i:s'),
                                'read_at' => $notification->read_at,
                            ];
                        });
                    $readNotificationsCount = $notifications->filter(function ($notification) {
                        return is_null($notification['read_at']);
                    })->count();
                    return [
                        'user' => $user,
                        'notifications' => $notifications,
                        'read_count' => $readNotificationsCount,];
                }
                return null;
            },
        ]);
    }
}
