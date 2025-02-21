// import MainBody from '@/Components/MainBody.jsx';
// import SearchComponent from '@/Components/SearchComponent.jsx';
// import Table from '@/Components/Table.jsx';
// import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout.jsx';
//
// export default function Index({ notifications }) {
//     return (
//         <AuthenticatedLayout>
//             <MainBody>
//                 <div className="flex justify-between pb-3">
//                     <SearchComponent routeName="notifications.index" />
//                 </div>
//                 <div className="p-1">
//                     <Table
//                         columns={notifications.columns}
//                         data={{ data: notifications.notifications }}
//                     />
//                 </div>
//             </MainBody>
//         </AuthenticatedLayout>
//     );
// }

// resources/js/Pages/Notifications/Index.jsx
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';
import { format } from 'date-fns';

export default function Index({ auth, notifications }) {
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
        <AuthenticatedLayout auth={auth}>
            <Head title="Notifications" />

            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg dark:bg-gray-800">
                        <div className="p-6">
                            <div className="mb-6 flex items-center justify-between">
                                <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
                                    All Notifications
                                </h2>
                                <Link
                                    href="/notifications/mark-all-as-read"
                                    method="post"
                                    as="button"
                                    className="rounded-md bg-blue-600 px-4 py-2 text-white transition hover:bg-blue-700"
                                >
                                    Mark all as read
                                </Link>
                            </div>

                            <div className="space-y-4">
                                {notifications.data.length > 0 ? (
                                    notifications.data.map((notification) => {
                                        const details =
                                            getNotificationDetails(
                                                notification,
                                            );
                                        return (
                                            <Link
                                                key={notification.id}
                                                href={details.link}
                                                className={`block rounded-lg border p-4 ${
                                                    notification.read_at
                                                        ? 'bg-gray-50 dark:bg-gray-700'
                                                        : 'border-blue-200 bg-blue-50 dark:border-blue-700 dark:bg-blue-900'
                                                }`}
                                                onClick={() => {
                                                    if (!notification.read_at) {
                                                        axios.post(
                                                            `/notifications/${notification.id}/read`,
                                                        );
                                                    }
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
                                                                    strokeWidth={
                                                                        2
                                                                    }
                                                                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                                                                />
                                                            )}
                                                            {details.icon ===
                                                                'x-circle' && (
                                                                <path
                                                                    strokeLinecap="round"
                                                                    strokeLinejoin="round"
                                                                    strokeWidth={
                                                                        2
                                                                    }
                                                                    d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
                                                                />
                                                            )}
                                                            {details.icon ===
                                                                'bell' && (
                                                                <path
                                                                    strokeLinecap="round"
                                                                    strokeLinejoin="round"
                                                                    strokeWidth={
                                                                        2
                                                                    }
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
                                    <div className="py-8 text-center text-gray-500 dark:text-gray-400">
                                        No notifications to display
                                    </div>
                                )}
                            </div>

                            {/* Pagination links */}
                            {notifications.links && (
                                <div className="mt-6">
                                    {/* Your pagination component here */}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
