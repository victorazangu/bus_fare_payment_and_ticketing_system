import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import ModalBody from '@/Components/ModalBody.jsx';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import { useForm } from '@inertiajs/react';
import { useEffect } from 'react';

export default function AddRouteModal({ isOpen, onClose, routeData, onSave }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        origin: '',
        destination: '',
        distance: '',
        estimated_travel_time: '',
    });

    useEffect(() => {
        if (routeData) {
            setData({
                origin: routeData.origin || '',
                destination: routeData.destination || '',
                distance: routeData.distance || '',
                estimated_travel_time: routeData.estimated_travel_time || '',
            });
        }
    }, [routeData]);

    const submit = (e) => {
        e.preventDefault();

        post(route('routes.store'), {
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
                <div>
                    <InputLabel htmlFor="origin" value="Origin" />
                    <TextInput
                        id="origin"
                        name="origin"
                        value={data.origin}
                        className="mt-1 block w-full"
                        onChange={(e) => setData('origin', e.target.value)}
                        required
                    />
                    <InputError message={errors.origin} className="mt-2" />
                </div>

                <div className="mt-4">
                    <InputLabel htmlFor="destination" value="Destination" />
                    <TextInput
                        id="destination"
                        name="destination"
                        value={data.destination}
                        className="mt-1 block w-full"
                        onChange={(e) => setData('destination', e.target.value)}
                        required
                    />
                    <InputError message={errors.destination} className="mt-2" />
                </div>

                <div className="mt-4">
                    <InputLabel htmlFor="distance" value="Distance (km)" />
                    <TextInput
                        id="distance"
                        name="distance"
                        value={data.distance}
                        type="number"
                        className="mt-1 block w-full"
                        onChange={(e) => setData('distance', e.target.value)}
                        required
                    />
                    <InputError message={errors.distance} className="mt-2" />
                </div>

                <div className="mt-4">
                    <InputLabel
                        htmlFor="estimated_travel_time"
                        value="Estimated Travel Time (hrs)"
                    />
                    <TextInput
                        id="estimated_travel_time"
                        name="estimated_travel_time"
                        value={data.estimated_travel_time}
                        type="time"
                        className="mt-1 block w-full"
                        onChange={(e) =>
                            setData('estimated_travel_time', e.target.value)
                        }
                        required
                    />
                    <InputError
                        message={errors.estimated_travel_time}
                        className="mt-2"
                    />
                </div>

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
                        Add Route
                    </PrimaryButton>
                </div>
            </form>
        </ModalBody>
    );
}
