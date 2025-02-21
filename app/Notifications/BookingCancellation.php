<?php

namespace App\Notifications;

use App\Models\Booking;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class BookingCancellation extends Notification implements ShouldQueue
{
    use Queueable;

    protected $booking;
    protected $refundAmount;


    /**
     * Create a new notification instance.
     */
    public function __construct(Booking $booking, $refundAmount = null)
    {
        $this->booking = $booking;
        $this->refundAmount = $refundAmount;
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
        $message = (new MailMessage)
            ->subject('Booking Cancellation - ' . $this->booking->booking_code)
            ->greeting('Hello ' . $notifiable->name . '!')
            ->line('Your booking has been cancelled.')
            ->line('Booking Details:')
            ->line('Booking Code: ' . $this->booking->booking_code)
            ->line('Route: ' . $this->booking->schedule->route->origin . ' to ' . $this->booking->schedule->route->destination)
            ->line('Date: ' . $this->booking->schedule->departure_time);

        if ($this->refundAmount) {
            $message->line('Refund Amount: ' . $this->refundAmount);
            $message->line('The refund will be processed within 5-7 business days.');
        }

        return $message->action('View Cancellation Details', url('/cancellations'))
            ->line('Thank you for using our service.');
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
            'message' => 'Your booking has been cancelled.',
            'refund_amount' => $this->refundAmount,
            'type' => 'booking_cancellation'
        ];
    }
}
