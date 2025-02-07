<?php

use App\Http\Controllers\BookingController;
use App\Http\Controllers\BusController;
use App\Http\Controllers\CancellationController;
use App\Http\Controllers\PaymentTransactionController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\RouteController;
use App\Http\Controllers\ScheduleController;
use App\Http\Controllers\UserController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Redirect;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    if (!auth()->check()) {
        return Redirect::route('login');
    }
    return redirect('/dashboard'); //Redirect to dashboard if authenticated

});

Route::get('/dashboard', function () {
    return Inertia::render('Dashboard');
})->middleware(['auth', 'verified'])->name('dashboard');

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');

    //    routes
    Route::resource('/routes', RouteController::class);

    //    schedules
    Route::resource('/schedules', ScheduleController::class);

    //    buses
    Route::resource('/buses', BusController::class);

    //    users
    Route::resource('/users', UserController::class);

    //    bookings
    Route::resource('/bookings', BookingController::class);

    //    payments
    Route::resource('/payments', PaymentTransactionController::class);

    //    cancellations
    Route::resource('/cancellations', CancellationController::class);
});

require __DIR__ . '/auth.php';
