import { Head } from '@inertiajs/inertia-react';
import axios from 'axios';
import { Html5QrcodeScanner } from 'html5-qrcode';
import { useEffect, useState } from 'react';

const BookingScanner = () => {
    const [scanResult, setScanResult] = useState(null);
    const [isValid, setIsValid] = useState(null);
    const [validationReason, setValidationReason] = useState('');
    const [bookingDetails, setBookingDetails] = useState(null);
    const [isScanning, setIsScanning] = useState(true);

    let scanner = null; // Declare scanner outside to ensure cleanup

    useEffect(() => {
        // Initialize the scanner once
        scanner = new Html5QrcodeScanner('reader', {
            qrbox: {
                width: 250,
                height: 250,
            },
            fps: 5,
        });

        function onScanSuccess(decodedText) {
            scanner.clear();
            setScanResult(decodedText);
            setIsScanning(false);
            validateBookingQrCode(decodedText);
        }

        function onScanFailure(error) {
            console.warn(`QR scan error: ${error}`);
        }

        scanner.render(onScanSuccess, onScanFailure);

        return () => {
            if (scanner) {
                scanner.clear(); // Cleanup scanner when component unmounts
            }
        };
    }, []); // Only run on mount/unmount

    const validateBookingQrCode = async (qrCode) => {
        try {
            const response = await axios.post('/api/bookings/validate-qr', {
                qr_code: qrCode,
            });

            setIsValid(response.data.valid);
            setValidationReason(response.data.reason || '');
            setBookingDetails(response.data.booking || null);
        } catch (error) {
            console.error('Validation error:', error);
            setIsValid(false);
            setValidationReason('Network or server error');
        }
    };

    const restartScanner = () => {
        setScanResult(null);
        setIsValid(null);
        setValidationReason('');
        setBookingDetails(null);
        setIsScanning(true);

        // Reset the scanner
        if (scanner) {
            scanner.clear();
        }

        // Reinitialize the scanner
        scanner = new Html5QrcodeScanner('reader', {
            qrbox: {
                width: 250,
                height: 250,
            },
            fps: 5,
        });

        scanner.render(
            (decodedText) => {
                scanner.clear();
                setScanResult(decodedText);
                setIsScanning(false);
                validateBookingQrCode(decodedText);
            },
            (error) => {
                console.warn(`QR scan error: ${error}`);
            },
        );
    };

    return (
        <>
            <Head title="Validate Booking" />
            <div className="mx-auto max-w-3xl px-4 py-8">
                <h1 className="mb-6 text-2xl font-bold">
                    Booking Validation Scanner
                </h1>

                {isScanning && (
                    <div id="reader" className="mx-auto w-full max-w-md"></div>
                )}

                {scanResult && (
                    <div className="mx-auto mt-6 w-full max-w-md">
                        <div
                            className={`rounded-lg border-2 p-6 ${
                                isValid === true
                                    ? 'border-green-500 bg-green-50'
                                    : isValid === false
                                      ? 'border-red-500 bg-red-50'
                                      : 'border-gray-300'
                            }`}
                        >
                            <div className="mb-6 flex flex-col items-center">
                                <div
                                    className={`flex h-32 w-32 items-center justify-center rounded-full ${
                                        isValid ? 'bg-green-100' : 'bg-red-100'
                                    }`}
                                >
                                    {isValid ? (
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            className="h-16 w-16 text-green-600"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                            stroke="currentColor"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M5 13l4 4L19 7"
                                            />
                                        </svg>
                                    ) : (
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            className="h-16 w-16 text-red-600"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                            stroke="currentColor"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M6 18L18 6M6 6l12 12"
                                            />
                                        </svg>
                                    )}
                                </div>

                                <h2 className="mt-4 text-2xl font-bold">
                                    {isValid
                                        ? 'VALID BOOKING'
                                        : 'INVALID BOOKING'}
                                </h2>

                                {!isValid && validationReason && (
                                    <p className="mt-2 text-center font-medium text-red-600">
                                        {validationReason}
                                    </p>
                                )}
                            </div>

                            {bookingDetails && (
                                <div className="mt-4 border-t border-gray-200 pt-4">
                                    <h3 className="mb-3 text-lg font-semibold">
                                        Booking Details
                                    </h3>
                                    <ul className="space-y-2">
                                        <li>
                                            <span className="font-medium">
                                                Passenger:
                                            </span>{' '}
                                            {bookingDetails.user_name}
                                        </li>
                                        <li>
                                            <span className="font-medium">
                                                Seats:
                                            </span>{' '}
                                            {bookingDetails.seats}
                                        </li>
                                        <li>
                                            <span className="font-medium">
                                                Date:
                                            </span>{' '}
                                            {bookingDetails.booking_date}
                                        </li>

                                        {bookingDetails.schedule && (
                                            <>
                                                <li>
                                                    <span className="font-medium">
                                                        From:
                                                    </span>{' '}
                                                    {
                                                        bookingDetails.schedule
                                                            .departure
                                                    }
                                                </li>
                                                <li>
                                                    <span className="font-medium">
                                                        To:
                                                    </span>{' '}
                                                    {
                                                        bookingDetails.schedule
                                                            .destination
                                                    }
                                                </li>
                                                <li>
                                                    <span className="font-medium">
                                                        Time:
                                                    </span>{' '}
                                                    {
                                                        bookingDetails.schedule
                                                            .departure_time
                                                    }
                                                </li>
                                            </>
                                        )}

                                        {bookingDetails.status && (
                                            <li>
                                                <span className="font-medium">
                                                    Status:
                                                </span>{' '}
                                                {bookingDetails.status}
                                            </li>
                                        )}

                                        {bookingDetails.payment_status && (
                                            <li>
                                                <span className="font-medium">
                                                    Payment:
                                                </span>{' '}
                                                {bookingDetails.payment_status}
                                            </li>
                                        )}
                                    </ul>
                                </div>
                            )}

                            <div className="mt-6 text-center">
                                <button
                                    onClick={restartScanner}
                                    className="rounded-lg bg-blue-600 px-4 py-2 text-white transition hover:bg-blue-700"
                                >
                                    Scan Another Booking
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </>
    );
};

export default BookingScanner;
