<?php

use App\Http\Controllers\Admin\AdminDashboardController;
use App\Http\Controllers\Admin\BookingController;
use App\Http\Controllers\Admin\BusController;
use App\Http\Controllers\Admin\CancellationController;
use App\Http\Controllers\Admin\PaymentTransactionController;
use App\Http\Controllers\Admin\ProfileController;
//use App\Http\Controllers\Admin\RouteController;
use App\Http\Controllers\Admin\ScheduleController;
use App\Http\Controllers\Admin\UserController;
use App\Http\Controllers\Common\RouteController;
use App\Http\Controllers\Driver\DriverBusController;
use App\Http\Controllers\Driver\DriverDashboardController;
use App\Http\Controllers\Driver\DriverRouteController;
use App\Http\Controllers\Driver\DriverScheduleController;
use App\Http\Controllers\Passenger\PassengerBookingController;
use App\Http\Controllers\Passenger\PassengerBusController;
use App\Http\Controllers\Passenger\PassengerDashboardController;
use App\Http\Controllers\Passenger\PassengerNotificationController;
use App\Http\Controllers\Passenger\PassengerPaymentTransactionController;
use App\Http\Controllers\Passenger\PassengerRouteController;
use Illuminate\Support\Facades\Redirect;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    if (!auth()->check()) {
        return Redirect::route('login');
    }
    $user = auth()->user();
    switch ($user->user_type) {
        case 'admin':
            return redirect()->route('admin.dashboard');
        case 'passenger':
            return redirect()->route('passenger.dashboard');
        case 'driver':
            return redirect()->route('driver.dashboard');
        default:
            return redirect()->route('login');
    }
})->name('home');


Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
    Route::resource('/routes', RouteController::class)->names('routes');

    Route::prefix('admin')->group(function () {
        Route::get('/dashboard', [AdminDashboardController::class, 'index'])->name('admin.dashboard');
        //    routes


        //    schedules
        Route::resource('/schedules', ScheduleController::class)->names('admin.schedules');

        //    buses
        Route::resource('/buses', BusController::class)->names('admin.buses');

        //    users
        Route::resource('/users', UserController::class)->names('admin.users');

        //    bookings
        Route::resource('/bookings', BookingController::class)->names('admin.bookings');

        //    payments
        Route::resource('/payments', PaymentTransactionController::class)->names('admin.payments');

        //    cancellations
        Route::resource('/cancellations', CancellationController::class)->names('admin.cancellations');
    });

    Route::prefix('passenger')->group(function () {
        Route::get('/dashboard', [PassengerDashboardController::class, 'index'])->name('passenger.dashboard');

        //    bookings
        Route::resource('/bookings', PassengerBookingController::class)->names('passenger.bookings');

        // buses
        Route::resource('/buses', PassengerBusController::class)->names('passenger.buses');

        // routes
        Route::resource('/routes', PassengerRouteController::class)->names('passenger.routes');

        //    payments
        Route::resource('/payments', PassengerPaymentTransactionController::class)->names('passenger.payments');

        // notifications
        Route::resource('/notifications', PassengerNotificationController::class)->names('passenger.notifications');

    });

    Route::prefix('driver')->group(function () {
        // dashboard
        Route::get('/dashboard', [DriverDashboardController::class, 'index'])->name('driver.dashboard');

        // schedules
        Route::resource('/schedules', DriverScheduleController::class)->names('driver.schedules');

        // buses
        Route::resource('/buses', DriverBusController::class)->names('driver.buses');

        // routes
        Route::resource('/routes', DriverRouteController::class)->names('driver.routes');
    });
});

require __DIR__ . '/auth.php';
