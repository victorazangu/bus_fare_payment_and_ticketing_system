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
            'flash' => [
                'success' => fn() => $request->session()->get('success'),
                'error' => fn() => $request->session()->get('error'),
            ],
            'auth' => [
                'user' => $request->user() ? [
                    'id' => $request->user()->id,
                    'name' => $request->user()->name,
                    'email' => $request->user()->email,
                    'user_type' => $request->user()->user_type,
                    'image' => $request->user()->image,
                ] : null,
                'notifications' => $request->user()
                    ? $request->user()->notifications()->latest()->take(5)->get()
                    : [],
                'read_count' => $request->user()
                    ? $request->user()->unreadNotifications()->count()
                    : 0,

            ],
//            'auth' => function () {
//                if (Auth::check()) {
//                    $user = Auth::user();
//                    $notifications = $user->notifications()
//                        ->latest()
//                        ->get()
//                        ->map(function ($notification) {
//                            return [
//                                'id' => $notification->id,
//                                'type' => $notification->type,
//                                'message' => $notification->message,
//                                'sent_at' => $notification->sent_at->format('Y-m-d H:i:s'),
//                                'read_at' => $notification->read_at,
//                            ];
//                        });
//                    $readNotificationsCount = $notifications->filter(function ($notification) {
//                        return is_null($notification['read_at']);
//                    })->count();
//                    return [
//                        'user' => $user,
//                        'notifications' => $notifications,
//                        'read_count' => $readNotificationsCount,];
//                }
//                return null;
//            },
        ]);
    }
}
