import { Link } from '@inertiajs/react';
import { format } from 'date-fns';

export default function NotificationModal({ notifications, onClose }) {
    const getNotificationDetails = (notification) => {
        const data = notification.data;
        switch (data.type) {
            case 'booking_confirmation':
                return {
                    title: 'Booking Confirmed',
                    message: data.message,
                    icon: 'check-circle',
                    color: 'text-green-500',
                    link: `/bookings/${data.booking_id}`,
                };
            case 'booking_cancellation':
                return {
                    title: 'Booking Cancelled',
                    message: data.message,
                    icon: 'x-circle',
                    color: 'text-red-500',
                    link: '/cancellations',
                };
            case 'payment_confirmation':
                return {
                    title: 'Payment confirmation',
                    message: data.message,
                    icon: 'x-circle',
                    color: 'text-yellow-500',
                    link: '/payments',
                };
            default:
                return {
                    title: 'Notification',
                    message: data.message || 'You have a new notification',
                    icon: 'bell',
                    color: 'text-blue-500',
                    link: '#',
                };
        }
    };

    const formatDate = (date) => {
        return format(new Date(date), 'MMM dd, yyyy HH:mm');
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-xl dark:bg-gray-800">
                <div className="mb-4 flex items-center justify-between">
                    <h2 className="text-xl font-bold text-gray-800 dark:text-white">
                        Recent Notifications
                    </h2>
                    <button
                        onClick={onClose}
                        className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                    >
                        <svg
                            className="h-6 w-6"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M6 18L18 6M6 6l12 12"
                            />
                        </svg>
                    </button>
                </div>
                <div className="max-h-96 overflow-y-auto">
                    {notifications.length > 0 ? (
                        notifications.map((notification) => {
                            const details =
                                getNotificationDetails(notification);
                            return (
                                <Link
                                    key={notification.id}
                                    href={details.link}
                                    className={`mb-3 block rounded-lg border p-4 ${
                                        notification.read_at
                                            ? 'bg-gray-50 dark:bg-gray-700'
                                            : 'border-blue-200 bg-blue-50 dark:border-blue-700 dark:bg-blue-900'
                                    }`}
                                    onClick={() => {
                                        // Mark as read when clicked
                                        axios.post(
                                            `/notifications/${notification.id}/read`,
                                        );
                                        onClose();
                                    }}
                                >
                                    <div className="flex items-start">
                                        <div
                                            className={`mr-3 ${details.color}`}
                                        >
                                            <svg
                                                className="h-6 w-6"
                                                fill="none"
                                                stroke="currentColor"
                                                viewBox="0 0 24 24"
                                            >
                                                {details.icon ===
                                                    'check-circle' && (
                                                    <path
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                        strokeWidth={2}
                                                        d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                                                    />
                                                )}
                                                {details.icon ===
                                                    'x-circle' && (
                                                    <path
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                        strokeWidth={2}
                                                        d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
                                                    />
                                                )}
                                                {details.icon === 'bell' && (
                                                    <path
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                        strokeWidth={2}
                                                        d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                                                    />
                                                )}
                                            </svg>
                                        </div>
                                        <div className="flex-1">
                                            <h3 className="font-semibold text-gray-800 dark:text-white">
                                                {details.title}
                                            </h3>
                                            <p className="text-sm text-gray-600 dark:text-gray-300">
                                                {details.message}
                                            </p>
                                            <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                                                {formatDate(
                                                    notification.created_at,
                                                )}
                                            </p>
                                        </div>
                                    </div>
                                </Link>
                            );
                        })
                    ) : (
                        <div className="py-4 text-center text-gray-500 dark:text-gray-400">
                            No notifications to display
                        </div>
                    )}
                </div>
                <div className="mt-4 flex justify-between">
                    <Link
                        href="/notifications"
                        className="text-sm text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
                    >
                        View all notifications
                    </Link>
                    <Link
                        href="/notifications/mark-all-as-read"
                        method="post"
                        as="button"
                        className="text-sm text-gray-600 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-300"
                    >
                        Mark all as read
                    </Link>
                </div>
            </div>
        </div>
    );
}
