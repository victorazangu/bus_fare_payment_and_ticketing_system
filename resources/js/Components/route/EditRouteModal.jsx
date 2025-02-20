import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import ModalBody from '@/Components/ModalBody.jsx';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import { useForm } from '@inertiajs/react';
import { useEffect, useRef, useState } from 'react';

export default function EditRouteModal({ isOpen, onClose, routeData, onSave }) {
    const { data, setData, put, processing, errors, reset } = useForm({
        origin: routeData?.origin || '',
        destination: routeData?.destination || '',
        distance: routeData?.distance || '',
        estimated_travel_time: routeData?.estimated_travel_time || '',
    });

    const originRef = useRef(null);
    const destinationRef = useRef(null);
    const [originAutocomplete, setOriginAutocomplete] = useState(null);
    const [destinationAutocomplete, setDestinationAutocomplete] =
        useState(null);
    const [distanceInKm, setDistanceInKm] = useState(
        routeData?.distance || null,
    );
    const [estimatedTravelTime, setEstimatedTravelTime] = useState(
        routeData?.estimated_travel_time || null,
    );

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

        // Origin autocomplete initialization
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
                    calculateDistanceAndTime(
                        place.geometry.location,
                        data.destination,
                    );
                }
            });
        }

        // Destination autocomplete initialization
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
                    calculateDistanceAndTime(
                        data.origin,
                        place.geometry.location,
                    );
                }
            });
        }

        // Cleanup function to remove autocomplete listeners
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

    const calculateDistanceAndTime = (origin, destination) => {
        if (origin && destination) {
            const service = new window.google.maps.DistanceMatrixService();
            service.getDistanceMatrix(
                {
                    origins: [origin],
                    destinations: [destination],
                    travelMode: window.google.maps.TravelMode.DRIVING,
                },
                (response, status) => {
                    if (status === window.google.maps.DistanceMatrixStatus.OK) {
                        const result = response.rows[0].elements[0];
                        if (result.status === 'OK') {
                            setDistanceInKm(result.distance.value / 1000); // Convert meters to km
                            setEstimatedTravelTime(
                                result.duration.value / 3600,
                            ); // Convert seconds to hours
                        }
                    }
                },
            );
        }
    };

    const submit = (e) => {
        e.preventDefault();

        put(route('routes.update', routeData.id), {
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
                        ref={originRef}
                        value={data.origin}
                        className="mt-1 block w-full"
                        onChange={(e) => {
                            setData('origin', e.target.value);
                            calculateDistanceAndTime(
                                e.target.value,
                                data.destination,
                            ); // Recalculate when origin changes
                        }}
                        required
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
                        className="mt-1 block w-full"
                        onChange={(e) => {
                            setData('destination', e.target.value);
                            calculateDistanceAndTime(
                                data.origin,
                                e.target.value,
                            ); // Recalculate when destination changes
                        }}
                        required
                    />
                    <InputError message={errors.destination} className="mt-2" />
                </div>

                <div className="mt-4">
                    <InputLabel htmlFor="distance" value="Distance (km)" />
                    <TextInput
                        id="distance"
                        name="distance"
                        value={distanceInKm || data.distance}
                        type="text"
                        className="mt-1 block w-full"
                        disabled
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
                        value={
                            estimatedTravelTime || data.estimated_travel_time
                        }
                        type="text"
                        className="mt-1 block w-full"
                        disabled
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
                        Submit
                    </PrimaryButton>
                </div>
            </form>
        </ModalBody>
    );
}
