import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import ModalBody from '@/Components/ModalBody.jsx';
import PrimaryButton from '@/Components/PrimaryButton';
import SecondaryButton from '@/Components/SecondaryButton.jsx';
import SelectInput from '@/Components/SelectInput.jsx';
import TextInput from '@/Components/TextInput';
import { useForm } from '@inertiajs/react';
import { useEffect } from 'react';

export default function AddPaymentModal({
    isOpen,
    onClose,
    paymentData,
    onSave,
    bookings,
}) {
    const { data, setData, post, processing, errors, reset } = useForm({
        booking_id: '',
        transaction_id: '',
        amount: '',
        payment_method: '',
        status: '',
    });
    useEffect(() => {
        if (paymentData) {
            setData({
                booking_id: paymentData.booking_id || '',
                transaction_id: paymentData.transaction_id || '',
                amount: paymentData.amount || '',
                payment_method: paymentData.payment_method || '',
                status: paymentData.status || '',
            });
        }
    }, [paymentData]);

    const submit = (e) => {
        e.preventDefault();
        post(route('payments.store'), {
            onSuccess: () => {
                onSave(data);
                onClose();
            },
        });
    };
    const paymentStatuses = [
        { value: 'pending', label: 'Pending' },
        { value: 'paid', label: 'Paid' },
        { value: 'failed', label: 'Failed' },
        { value: 'refunded', label: 'Refunded' },
        { value: 'partially_paid', label: 'Partially Paid' },
        { value: 'cancelled', label: 'Cancelled' },
    ];

    const paymentMethods = [
        { value: 'credit_card', label: 'Credit Card' },
        { value: 'debit_card', label: 'Debit Card' },
        { value: 'paypal', label: 'PayPal' },
        { value: 'bank_transfer', label: 'Bank Transfer' },
        { value: 'cash', label: 'Cash' },
        { value: 'mpesa', label: 'Mpesa' },
    ];

    if (!isOpen) return null;
    return (
        <ModalBody>
            <form onSubmit={submit}>
                <div>
                    <InputLabel htmlFor="booking_id" value="Select Booking" />
                    <SelectInput
                        id="booking_id"
                        name="booking_id"
                        value={data.booking_id}
                        options={bookings}
                        className="mt-1 block w-full"
                        onChange={(e) => setData('booking_id', e.target.value)}
                        required
                    />
                    <InputError message={errors.booking_id} className="mt-2" />
                </div>

                <div className="mt-4">
                    <InputLabel
                        htmlFor="transaction_id"
                        value="Transaction No"
                    />
                    <TextInput
                        id="transaction_id"
                        name="transaction_id"
                        value={data.transaction_id}
                        className="mt-1 block w-full"
                        onChange={(e) =>
                            setData('transaction_id', e.target.value)
                        }
                        required
                    />
                    <InputError
                        message={errors.transaction_id}
                        className="mt-2"
                    />
                </div>

                <div className="mt-4">
                    <InputLabel htmlFor="amount" value="Amount" />
                    <TextInput
                        id="amount"
                        name="amount"
                        value={data.amount}
                        type="number"
                        className="mt-1 block w-full"
                        onChange={(e) => setData('amount', e.target.value)}
                        required
                    />
                    <InputError message={errors.amount} className="mt-2" />
                </div>

                <div className="mt-4">
                    <InputLabel
                        htmlFor="payment_method"
                        value="Payment Method"
                    />
                    <SelectInput
                        id="payment_method"
                        name="payment_method"
                        value={data.payment_method}
                        options={paymentMethods}
                        className="mt-1 block w-full"
                        onChange={(e) =>
                            setData('payment_method', e.target.value)
                        }
                        required
                    />
                    <InputError
                        message={errors.payment_method}
                        className="mt-2"
                    />
                </div>
                <div className="mt-4">
                    <InputLabel htmlFor="status" value="Payment Status" />
                    <SelectInput
                        id="status"
                        name="status"
                        value={data.status}
                        options={paymentStatuses}
                        className="mt-1 block w-full"
                        onChange={(e) => setData('status', e.target.value)}
                        required
                    />
                    <InputError message={errors.status} className="mt-2" />
                </div>

                <div className="mt-4 flex items-center justify-end space-x-3">
                    <SecondaryButton onClick={onClose}>Cancel</SecondaryButton>
                    <PrimaryButton
                        type="submit"
                        className="ms-4"
                        disabled={processing}
                    >
                        Add Payment
                    </PrimaryButton>
                </div>
            </form>
        </ModalBody>
    );
}
