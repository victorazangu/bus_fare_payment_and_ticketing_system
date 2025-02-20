import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import ModalBody from '@/Components/ModalBody.jsx';
import PrimaryButton from '@/Components/PrimaryButton';
import SelectInput from '@/Components/SelectInput.jsx';
import TextInput from '@/Components/TextInput';
import { useForm } from '@inertiajs/react';
import { useEffect } from 'react';

export default function AddScheduleModal({
    isOpen,
    onClose,
    scheduleData,
    onSave,
    buses,
    routes,
}) {
    const { data, setData, post, processing, errors, reset } = useForm({
        bus_id: '',
        route_id: '',
        departure_time: '',
        arrival_time: '',
        fare: '',
        frequency: '',
        travel_day: '',
    });
    useEffect(() => {
        if (scheduleData) {
            setData({
                bus_id: scheduleData.bus_id || '',
                route_id: scheduleData.route_id || '',
                departure_time: scheduleData.departure_time || '',
                arrival_time: scheduleData.arrival_time || '',
                fare: scheduleData.fare || '',
                frequency: scheduleData.frequency || '',
                travel_day: scheduleData.travel_day || '',
            });
        }
    }, [scheduleData]);

    const submit = (e) => {
        e.preventDefault();

        post(route('schedules.store'), {
            onSuccess: () => {
                onSave(data);
                onClose();
            },
        });
    };

    const frequencies = [
        { value: 'daily', label: 'Daily' },
        { value: 'weekly', label: 'Weekly' },
        { value: 'monthly', label: 'Monthly' },
        { value: 'yearly', label: 'Yearly' },
    ];

    const daysOfTheWeek = [
        { value: 'monday', label: 'Monday' },
        { value: 'tuesday', label: 'Tuesday' },
        { value: 'wednesday', label: 'Wednesday' },
        { value: 'thursday', label: 'Thursday' },
        { value: 'friday', label: 'Friday' },
        { value: 'saturday', label: 'Saturday' },
        { value: 'sunday', label: 'Sunday' },
    ];

    if (!isOpen) return null;

    return (
        <ModalBody>
            <form onSubmit={submit}>
                <div className="py-2">
                    <InputLabel htmlFor="bus_id" value="Select Bus" />
                    <SelectInput
                        id="bus_id"
                        name="bus_id"
                        value={data.bus_id}
                        options={buses}
                        className="mt-1 block w-full"
                        onChange={(e) => setData('bus_id', e.target.value)}
                        required
                    />
                    <InputError message={errors.bus_id} className="mt-2" />
                </div>
                <div className="py-2">
                    <InputLabel htmlFor="route_id" value="Select Route" />
                    <SelectInput
                        id="route_id"
                        name="route_id"
                        value={data.route_id}
                        options={routes}
                        className="mt-1 block w-full"
                        onChange={(e) => setData('route_id', e.target.value)}
                        required
                    />
                    <InputError message={errors.route_id} className="mt-2" />
                </div>

                <div className="py-2">
                    <InputLabel
                        htmlFor="departure_time"
                        value="Departure Time"
                    />
                    <TextInput
                        id="departure_time"
                        name="departure_time"
                        type="time"
                        value={data.departure_time}
                        className="mt-1 block w-full"
                        onChange={(e) =>
                            setData('departure_time', e.target.value)
                        }
                        required
                    />
                    <InputError
                        message={errors.departure_time}
                        className="mt-2"
                    />
                </div>

                <div className="py-2">
                    <InputLabel htmlFor="arrival_time" value="Arrival Time" />
                    <TextInput
                        id="arrival_time"
                        name="arrival_time"
                        type="time"
                        value={data.arrival_time}
                        className="mt-1 block w-full"
                        onChange={(e) =>
                            setData('arrival_time', e.target.value)
                        }
                        required
                    />
                    <InputError
                        message={errors.arrival_time}
                        className="mt-2"
                    />
                </div>
                <div className="mt-4">
                    <InputLabel htmlFor="fare" value="Fare" />
                    <TextInput
                        id="fare"
                        name="fare"
                        value={data.fare}
                        type="number"
                        className="mt-1 block w-full"
                        onChange={(e) => setData('fare', e.target.value)}
                        required
                    />
                    <InputError message={errors.fare} className="mt-2" />
                </div>
                <div className="mt-4">
                    <InputLabel htmlFor="frequency" value="Select Frequency" />
                    <SelectInput
                        id="frequency"
                        name="frequency"
                        value={data.frequency}
                        options={frequencies}
                        className="mt-1 block w-full"
                        onChange={(e) => setData('frequency', e.target.value)}
                        required
                    />
                    <InputError message={errors.frequency} className="mt-2" />
                </div>

                {data.frequency && (
                    <>
                        {data.frequency === 'daily' ? (
                            <></>
                        ) : (
                            <div className="mt-4">
                                <InputLabel
                                    htmlFor="travel_day"
                                    value="Select Travel Day"
                                />

                                {data.frequency === 'weekly' ? (
                                    <div className="mt-4">
                                        <InputLabel
                                            htmlFor="travel_day"
                                            value="Travel Day"
                                        />
                                        <SelectInput
                                            id="travel_day"
                                            name="travel_day"
                                            value={data.travel_day}
                                            options={daysOfTheWeek}
                                            className="mt-1 block w-full"
                                            onChange={(e) =>
                                                setData(
                                                    'travel_day',
                                                    e.target.value,
                                                )
                                            }
                                            required
                                        />
                                        <InputError
                                            message={errors.travel_day}
                                            className="mt-2"
                                        />
                                    </div>
                                ) : (
                                    <div className="mt-4">
                                        <InputLabel
                                            htmlFor="travel_day"
                                            value="Travel Day"
                                        />
                                        <TextInput
                                            id="travel_day"
                                            name="travel_day"
                                            value={data.travel_day}
                                            type="date"
                                            className="mt-1 block w-full"
                                            onChange={(e) =>
                                                setData(
                                                    'travel_day',
                                                    e.target.value,
                                                )
                                            }
                                            required
                                        />
                                        <InputError
                                            message={errors.travel_day}
                                            className="mt-2"
                                        />
                                    </div>
                                )}

                                <InputError
                                    message={errors.travel_day}
                                    className="mt-2"
                                />
                            </div>
                        )}
                    </>
                )}

                <div className="mt-4 flex items-center justify-end space-x-3">
                    <button
                        type="button"
                        onClick={onClose}
                        className="rounded-md bg-gray-500 px-4 py-2 text-white hover:bg-gray-600"
                    >
                        Cancel
                    </button>
                    <PrimaryButton
                        type="submit"
                        className="ms-4"
                        disabled={processing}
                    >
                        Add Schedule
                    </PrimaryButton>
                </div>
            </form>
        </ModalBody>
    );
}
