<?php

use App\Http\Controllers\Admin\AdminDashboardController;
use App\Http\Controllers\BookingValidatorController;
use App\Http\Controllers\Common\CancellationController;
use App\Http\Controllers\Common\BookingController;
use App\Http\Controllers\Common\BusController;
use App\Http\Controllers\Common\PaymentTransactionController;
use App\Http\Controllers\Admin\ProfileController;
use App\Http\Controllers\Common\ScheduleController;
use App\Http\Controllers\Admin\UserController;
use App\Http\Controllers\Common\NotificationController;
use App\Http\Controllers\Common\RouteController;
use App\Http\Controllers\Driver\DriverDashboardController;
use App\Http\Controllers\Passenger\PassengerDashboardController;
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
    Route::resource('/notifications', NotificationController::class)->names('notifications');
    Route::resource('/schedules', ScheduleController::class)->names('schedules');
    Route::resource('/buses', BusController::class)->names('buses');
    Route::resource('/bookings', BookingController::class)->names('bookings');
    Route::resource('/payments', PaymentTransactionController::class)->names('payments');
    Route::post('/payments/auto', [PaymentTransactionController::class, "autoPayment"])->name("payments.auto");
    Route::resource('/cancellations', CancellationController::class)->names('cancellations');
    Route::get('/available-seats', [BookingController::class, 'getAvailableSeats'])->name('available-seats');

    Route::prefix('admin')->group(function () {
        Route::get('/dashboard', [AdminDashboardController::class, 'index'])->name('admin.dashboard');
        Route::resource('/users', UserController::class)->names('admin.users');
    });
    Route::prefix('passenger')->group(function () {
        Route::get('/dashboard', [PassengerDashboardController::class, 'index'])->name('passenger.dashboard');
    });

    Route::prefix('driver')->group(function () {
        Route::get('/dashboard', [DriverDashboardController::class, 'index'])->name('driver.dashboard');
    });
    Route::get('/bookings/qr/scanner', [BookingValidatorController::class, 'showScanner'])->name('bookings.scanner');
    Route::post('/bookings/qr/svalidate-qr', [BookingValidatorController::class, 'validateQrCode'])->name('bookings.validateQrCode');
    Route::get('/bookings/qr/{bookingId}/qr-code', [BookingValidatorController::class, 'showQrCode'])->name('bookings.showQrCode');


    Route::get('/notification', [NotificationController::class, 'index'])->name('notifications.index');
    Route::post('/notifications/{id}/read', [NotificationController::class, 'markAsRead']);
    Route::post('/notifications/mark-all-as-read', [NotificationController::class, 'markAllAsRead']);


});

require __DIR__ . '/auth.php';
