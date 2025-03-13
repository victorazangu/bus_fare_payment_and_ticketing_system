<?php

namespace App\Notifications;

use App\Models\PaymentTransaction;
use App\Models\Booking;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class PaymentConfirmation extends Notification implements ShouldQueue
{
    use Queueable;

    protected $paymentTransaction;

    /**
     * Create a new notification instance.
     */
    public function __construct(PaymentTransaction $paymentTransaction)
    {
        $this->paymentTransaction = $paymentTransaction;
    }

    /**
     * Get the notification's delivery channels.
     *
     * @return array<int, string>
     */
    public function via(object $notifiable): array
    {
        return ['mail'];
    }

    /**
     * Get the mail representation of the notification.
     */
    public function toMail(object $notifiable): MailMessage
    {
        $payment = $this->paymentTransaction;
        $booking = $payment->booking;

        return (new MailMessage)
            ->subject('Payment Confirmation for Booking #' . $booking->booking_code)
            ->greeting('Hello ' . $booking->user->name . ',')
            ->line('Thank you for your payment. Below are the details of your payment and booking:')
            ->line('Booking Code: ' . $booking->booking_code)
            ->line('Payment Transaction ID: ' . $payment->transaction_id)
            ->line('Amount Paid: KES ' . number_format($payment->amount, 2))
            ->line('Payment Method: ' . ucfirst($payment->payment_method))
            ->line('Payment Date: ' . $payment->payment_date->format('F j, Y'))
            ->line('Seats Reserved: ' . $booking->formatted_seat_numbers)
            ->line('Departure: ' . $booking->schedule->departure_time->format('F j, Y, g:i A'))
            ->action('View Booking Details', url('/bookings/'))
            ->line('We appreciate your business and look forward to serving you soon!')
            ->salutation('Best regards, Victor Bus Payment Team');
    }

    /**
     * Get the array representation of the notification.
     *
     * @return array<string, mixed>
     */
    public function toArray(object $notifiable): array
    {
        return [
            'payment_transaction_id' => $this->paymentTransaction->transaction_id,
            'message' => 'Your Payment of KSH ' . $this->paymentTransaction->amount . ' for booking ' . $this->paymentTransaction->booking->booking_code . ' has been confirmed successfully.',
            'type' => 'payment_confirmation'
        ];
    }
}
