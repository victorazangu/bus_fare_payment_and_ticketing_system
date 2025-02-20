import AddPaymentModal from '@/Components/payments/AddPaymentModal.jsx';
import SecondaryButton from '@/Components/SecondaryButton.jsx';
import { useForm } from '@inertiajs/react';
import { useEffect, useState } from 'react';

export default function PaymentModal({
    isOpen,
    onClose,
    modelId,
    modelName,
    modelTitle = 'this item',
    onConfirm,
    bookings,
}) {
    const [selectedPaymentMethod, setSelectedPaymentMethod] = useState(null);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [selectedPayment, setSelectedPayment] = useState(null);

    const { data, setData, post, processing, errors, reset } = useForm({
        payment_method: '',
        booking_id: '',
    });
    useEffect(() => {
        setData({
            payment_method: selectedPaymentMethod || '',
            booking_id: modelId || '',
        });
    }, [selectedPaymentMethod, modelId]);

    const submit = (e) => {
        e.preventDefault();
        post(route(`${modelName}.auto`), {
            onSuccess: () => {
                onConfirm(data);
                onClose();
            },
        });
    };

    return (
        <>
            <form onSubmit={submit}>
                <div className="fixed inset-0 z-50 overflow-y-auto">
                    <div className="flex min-h-screen items-center justify-center p-4">
                        <div className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"></div>

                        <div className="relative w-full max-w-lg rounded-lg bg-white p-6 shadow-xl dark:bg-gray-800">
                            <div className="flex items-start">
                                <div className="mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900">
                                    <svg
                                        className="h-6 w-6 text-blue-600 dark:text-blue-400"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth="2"
                                            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                                        />
                                    </svg>
                                </div>

                                <div className="ml-4 text-left">
                                    <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">
                                        Select Payment Method for {modelTitle}
                                    </h3>
                                    <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                                        Please select a payment method to
                                        proceed.
                                    </p>
                                </div>
                            </div>
                            <div className="mt-4 space-y-4">
                                <div>
                                    <input
                                        type="radio"
                                        id="mpesa"
                                        name="payment_method"
                                        value="mpesa"
                                        checked={
                                            selectedPaymentMethod === 'mpesa'
                                        }
                                        onChange={() =>
                                            setSelectedPaymentMethod('mpesa')
                                        }
                                        className="mr-2"
                                    />
                                    <label
                                        htmlFor="mpesa"
                                        className="text-sm text-gray-600 dark:text-gray-400"
                                    >
                                        Mpesa
                                    </label>
                                </div>
                                <div>
                                    <input
                                        type="radio"
                                        id="cash"
                                        name="payment_method"
                                        value="cash"
                                        checked={
                                            selectedPaymentMethod === 'cash'
                                        }
                                        onChange={() =>
                                            setSelectedPaymentMethod('cash')
                                        }
                                        className="mr-2"
                                    />
                                    <label
                                        htmlFor="cash"
                                        className="text-sm text-gray-600 dark:text-gray-400"
                                    >
                                        Cash
                                    </label>
                                </div>
                            </div>

                            <div className="mt-6 flex justify-end space-x-3">
                                <button
                                    type="button"
                                    onClick={onClose}
                                    className="rounded-md bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
                                >
                                    Cancel
                                </button>
                                {selectedPaymentMethod === 'mpesa' && (
                                    <button
                                        type="submit"
                                        className="rounded-md bg-green-600 px-4 py-2 text-sm font-medium text-white hover:bg-green-700 focus:outline-none"
                                        disabled={processing}
                                    >
                                        {processing
                                            ? 'Processing Payment...'
                                            : 'Pay with Mpesa'}
                                    </button>
                                )}
                                {selectedPaymentMethod === 'cash' && (
                                    <SecondaryButton
                                        onClick={() => setIsAddModalOpen(true)}
                                    >
                                        Add Payment
                                    </SecondaryButton>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </form>

            {isAddModalOpen && (
                <AddPaymentModal
                    isOpen={isAddModalOpen}
                    onClose={() => setIsAddModalOpen(false)}
                    routeData={selectedPayment}
                    onSave={(addData) => {
                        console.log(addData);
                        setIsAddModalOpen(false);
                    }}
                    bookings={bookings}
                />
            )}
        </>
    );
}
