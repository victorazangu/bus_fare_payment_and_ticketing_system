import { Head } from '@inertiajs/inertia-react';
import QRCode from 'qrcode.react';

const BookingQrCode = ({ booking }) => {
    const getBannerStatus = () => {
        if (booking.status === 'canceled') {
            return {
                color: 'bg-red-100 border-red-400 text-red-700',
                message: 'This booking has been canceled',
                icon: (
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                    >
                        <path
                            fillRule="evenodd"
                            d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                            clipRule="evenodd"
                        />
                    </svg>
                ),
            };
        } else if (booking.payment_status === 'pending') {
            return {
                color: 'bg-yellow-100 border-yellow-400 text-yellow-700',
                message: 'Payment pending - Complete payment before boarding',
                icon: (
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                    >
                        <path
                            fillRule="evenodd"
                            d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                            clipRule="evenodd"
                        />
                    </svg>
                ),
            };
        } else if (booking.status === 'confirmed') {
            return {
                color: 'bg-green-100 border-green-400 text-green-700',
                message: 'Booking confirmed - Ready for boarding',
                icon: (
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                    >
                        <path
                            fillRule="evenodd"
                            d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                            clipRule="evenodd"
                        />
                    </svg>
                ),
            };
        } else if (booking.status === 'boarded') {
            return {
                color: 'bg-blue-100 border-blue-400 text-blue-700',
                message: 'Already boarded',
                icon: (
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                    >
                        <path d="M8 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM15 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z" />
                        <path d="M3 4a1 1 0 00-1 1v10a1 1 0 001 1h1.05a2.5 2.5 0 014.9 0H10a1 1 0 001-1V5a1 1 0 00-1-1H3zM14 7a1 1 0 00-1 1v6.05A2.5 2.5 0 0115.95 16H17a1 1 0 001-1v-5a1 1 0 00-.293-.707l-2-2A1 1 0 0015 7h-1z" />
                    </svg>
                ),
            };
        }

        return {
            color: 'bg-gray-100 border-gray-400 text-gray-700',
            message: 'Booking status: ' + booking.status,
            icon: null,
        };
    };

    const bannerStatus = getBannerStatus();

    return (
        <>
            <Head title="Booking QR Code" />
            <div className="mx-auto max-w-md px-4 py-8">
                <h1 className="mb-6 text-center text-2xl font-bold">
                    Your Boarding Pass
                </h1>

                <div
                    className={`mb-6 flex items-center border-l-4 p-4 ${bannerStatus.color}`}
                >
                    {bannerStatus.icon && (
                        <span className="mr-2">{bannerStatus.icon}</span>
                    )}
                    <p>{bannerStatus.message}</p>
                </div>

                <div className="overflow-hidden rounded-lg bg-white shadow-md">
                    <div className="border-b border-gray-200 bg-gray-50 p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <h2 className="text-xl font-semibold">
                                    {booking.departure}
                                </h2>
                                <p className="text-sm text-gray-500">to</p>
                                <h2 className="text-xl font-semibold">
                                    {booking.destination}
                                </h2>
                            </div>
                            <div className="text-right">
                                <p className="text-sm text-gray-500">Date</p>
                                <p className="font-medium">
                                    {booking.booking_date}
                                </p>
                                <p className="mt-2 text-sm text-gray-500">
                                    Time
                                </p>
                                <p className="font-medium">
                                    {booking.departure_time}
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="flex flex-col items-center p-6">
                        <div className="mb-4 rounded-lg border border-gray-200 bg-white p-3">
                            <QRCode
                                value={booking.qr_code}
                                size={200}
                                level="H"
                                renderAs="svg"
                                includeMargin={true}
                                className={
                                    booking.status === 'canceled' ||
                                    booking.payment_status === 'pending'
                                        ? 'opacity-50'
                                        : ''
                                }
                            />
                        </div>

                        <div className="text-center">
                            <p className="text-sm text-gray-500">Booking ID</p>
                            <p className="font-mono text-xs">{booking.id}</p>
                            <p className="mt-2 text-sm text-gray-500">
                                Number of Seats
                            </p>
                            <p className="font-semibold">{booking.seats}</p>
                        </div>
                    </div>

                    <div className="border-t border-gray-200 bg-gray-50 p-4">
                        <p className="text-center text-sm text-gray-500">
                            Present this QR code to the driver when boarding
                        </p>
                    </div>
                </div>
            </div>
        </>
    );
};

export default BookingQrCode;
