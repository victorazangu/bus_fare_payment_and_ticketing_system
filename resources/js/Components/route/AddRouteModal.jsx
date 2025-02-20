import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import MapComponent from '@/Components/maps/MapComponent.jsx';
import ModalBody from '@/Components/ModalBody.jsx';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput.jsx';
import { useForm } from '@inertiajs/react';
import { useEffect, useRef, useState } from 'react';

export default function AddRouteModal({ isOpen, onClose, routeData, onSave }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        origin: '',
        destination: '',
        distance: '',
        estimated_travel_time: '',
    });
    const [showMap, setShowMap] = useState(false);
    const originRef = useRef(null);
    const destinationRef = useRef(null);
    const [originAutocomplete, setOriginAutocomplete] = useState(null);
    const [destinationAutocomplete, setDestinationAutocomplete] =
        useState(null);
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
    useEffect(() => {
        if (
            !isOpen ||
            typeof window.google === 'undefined' ||
            !window.google.maps.places
        ) {
            return;
        }

        if (!originAutocomplete && originRef.current) {
            const autocomplete = new window.google.maps.places.Autocomplete(
                originRef.current,
                { types: ['geocode', 'establishment'] },
            );
            setOriginAutocomplete(autocomplete);
            autocomplete.addListener('place_changed', () => {
                const place = autocomplete.getPlace();
                if (place && place.formatted_address) {
                    setData('origin', place.formatted_address);
                }
            });
        }
        if (!destinationAutocomplete && destinationRef.current) {
            const autocomplete = new window.google.maps.places.Autocomplete(
                destinationRef.current,
                { types: ['geocode', 'establishment'] },
            );
            setDestinationAutocomplete(autocomplete);
            autocomplete.addListener('place_changed', () => {
                const place = autocomplete.getPlace();
                if (place && place.formatted_address) {
                    setData('destination', place.formatted_address);
                }
            });
        }
        return () => {
            if (originAutocomplete) {
                window.google.maps.event.clearInstanceListeners(
                    originAutocomplete,
                );
            }
            if (destinationAutocomplete) {
                window.google.maps.event.clearInstanceListeners(
                    destinationAutocomplete,
                );
            }
        };
    }, [isOpen, originRef.current, destinationRef.current]);

    useEffect(() => {
        if (data.origin && data.destination) {
            setShowMap(true);
        } else {
            setShowMap(false);
        }
    }, [data.origin, data.destination]);

    const handleDirectionsCalculated = (routeInfo) => {
        const distanceKm = (routeInfo.distanceValue / 1000).toFixed(2);
        const durationHours = (routeInfo.durationValue / 3600).toFixed(2);
        setData({
            ...data,
            distance: distanceKm,
            estimated_travel_time: durationHours,
        });
    };

    const submit = (e) => {
        e.preventDefault();
        post(route('routes.store'), {
            onSuccess: () => {
                onSave(data);
                onClose();
                reset();
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
                        ref={originRef}
                        value={data.origin}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                        onChange={(e) => setData('origin', e.target.value)}
                        required
                        placeholder="Enter origin location"
                    />
                    <InputError message={errors.origin} className="mt-2" />
                </div>

                <div className="mt-4">
                    <InputLabel htmlFor="destination" value="Destination" />
                    <TextInput
                        id="destination"
                        name="destination"
                        ref={destinationRef}
                        value={data.destination}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                        onChange={(e) => setData('destination', e.target.value)}
                        required
                        placeholder="Enter destination location"
                    />
                    <InputError message={errors.destination} className="mt-2" />
                </div>

                {showMap && (
                    <div className="mt-4 overflow-hidden rounded-md border">
                        <MapComponent
                            origin={data.origin}
                            destination={data.destination}
                            onDirectionsCalculated={handleDirectionsCalculated}
                        />
                    </div>
                )}

                <div className="mt-4">
                    <InputLabel htmlFor="distance" value="Distance (km)" />
                    <TextInput
                        id="distance"
                        name="distance"
                        value={data.distance}
                        type="number"
                        step="0.01"
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
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
                        type="number"
                        step="0.01"
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
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
