<?php

namespace App\Notifications;

use App\Models\Booking;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class BookingConfirmation extends Notification implements ShouldQueue
{
    use Queueable;

    protected $booking;
    protected $totalFare;

    /**
     * Create a new notification instance.
     */
    public function __construct(Booking $booking, $totalFare = null)
    {
        $this->booking = $booking;
        $this->totalFare = $totalFare;
    }

    /**
     * Get the notification's delivery channels.
     *
     * @return array<int, string>
     */
    public function via(object $notifiable): array
    {
        return ['mail', 'database'];
    }

    /**
     * Get the mail representation of the notification.
     */
    public function toMail(object $notifiable): MailMessage
    {
        $logoUrl = asset('storage/images/logo.png');

        return (new MailMessage)
            ->subject('Booking Confirmation - ' . $this->booking->booking_code)
            ->greeting('Hello ' . $notifiable->name . '!')
            ->line('Your booking has been confirmed successfully.')
            ->line('Booking Details below 👇👇👇')
            ->line('Booking Code: ' . $this->booking->booking_code)
            ->line('Route: ' . $this->booking->schedule->route->origin . ' to ' . $this->booking->schedule->route->destination)
            ->line('Date: ' . $this->booking->schedule->departure_time)
            ->line('Seats: ' . $this->booking->getFormattedSeatNumbersAttribute())
            ->line('Total Amount: ' . $this->totalFare)
            ->action('View Booking Details', url('/bookings'))
            ->line('Thank you for using our service!')
            ->with([
                'logo' => $logoUrl,
            ]);
    }


    /**
     * Get the array representation of the notification.
     *
     * @return array<string, mixed>
     */
    public function toArray(object $notifiable): array
    {
        return [
            'booking_id' => $this->booking->id,
            'booking_code' => $this->booking->booking_code,
            'message' => 'Your booking has been confirmed successfully.',
            'type' => 'booking_confirmation'
        ];
    }
}
