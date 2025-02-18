import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import ModalBody from '@/Components/ModalBody.jsx';
import PrimaryButton from '@/Components/PrimaryButton';
import SecondaryButton from '@/Components/SecondaryButton.jsx';
import SelectInput from '@/Components/SelectInput.jsx';
import TextInput from '@/Components/TextInput';
import { useForm } from '@inertiajs/react';
import axios from 'axios';
import { useEffect, useState } from 'react';

export default function AddBookingModal({
    isOpen,
    onClose,
    bookingData,
    onSave,
    schedules,
}) {
    const { data, setData, post, processing, errors, reset } = useForm({
        schedule_id: '',
        seat_numbers: [],
        booking_date: '',
        promotion_id: '',
    });
    const [availableSeats, setAvailableSeats] = useState([]);

    const fetchAvailableSeats = (scheduleId) => {
        axios
            .get(route('available-seats', { schedule_id: scheduleId }))
            .then((response) => {
                console.log('Available seats:', response.data);
                setAvailableSeats(response.data);
            })
            .catch((error) => {
                console.error('Error fetching seats:', error);
            });
    };

    useEffect(() => {
        if (bookingData) {
            setData({
                schedule_id: bookingData.schedule_id || '',
                seat_numbers: bookingData.seat_numbers || [],
                booking_date: bookingData.booking_date || '',
                promotion_id: bookingData.promotion_id || '',
            });
        }
    }, [bookingData]);

    const submit = (e) => {
        e.preventDefault();

        post(route('bookings.store'), {
            onSuccess: () => {
                onSave(data);
                onClose();
            },
        });
    };
    if (!isOpen) return null;
    return (
        <ModalBody>
            <form onSubmit={submit}>
                <div className="py-2">
                    <InputLabel htmlFor="schedule_id" value="Select schedule" />
                    <SelectInput
                        id="schedule_id"
                        name="schedule_id"
                        value={data.schedule_id}
                        options={schedules}
                        className="mt-1 block w-full"
                        onChange={(e) => {
                            const selectedSchedule = e.target.value;
                            setData('schedule_id', selectedSchedule);
                            fetchAvailableSeats(selectedSchedule);
                        }}
                        required
                    />
                    <InputError message={errors.schedule_id} className="mt-2" />
                </div>
                <div className="py-2">
                    <InputLabel htmlFor="seat_numbers" value="Select Seats" />
                    <SelectInput
                        id="seat_numbers"
                        name="seat_numbers"
                        value={data.seat_numbers}
                        isMulti={true}
                        options={availableSeats}
                        className="mt-1 block w-full"
                        onChange={(e) => {
                            const selectedValues = Array.from(
                                e.target.selectedOptions,
                                (option) => option.value,
                            );
                            setData('seat_numbers', selectedValues);
                        }}
                        required
                    />
                    <InputError
                        message={errors.seat_numbers}
                        className="mt-2"
                    />
                </div>

                <div className="mt-4">
                    <InputLabel htmlFor="booking_date" value="Booking Date" />
                    <TextInput
                        id="booking_date"
                        name="booking_date"
                        value={data.booking_date}
                        type="datetime"
                        className="mt-1 block w-full"
                        onChange={(e) =>
                            setData('booking_date', e.target.value)
                        }
                        required
                    />
                    <InputError
                        message={errors.booking_date}
                        className="mt-2"
                    />
                </div>

                <div className="mt-4">
                    <InputLabel htmlFor="promotion_id" value="Promotion Code" />
                    <TextInput
                        id="promotion_id"
                        name="promotion_id"
                        value={data.promotion_id}
                        type="number"
                        className="mt-1 block w-full"
                        onChange={(e) =>
                            setData('promotion_id', e.target.value)
                        }
                        required
                    />
                    <InputError
                        message={errors.promotion_id}
                        className="mt-2"
                    />
                </div>
                <div className="mt-4 flex items-center justify-end space-x-3">
                    <SecondaryButton onClick={onClose}>Cancel</SecondaryButton>
                    <PrimaryButton
                        type="submit"
                        className="ms-4"
                        disabled={processing}
                    >
                        Add Route
                    </PrimaryButton>
                </div>
            </form>
        </ModalBody>
    );
}
