import {
    DirectionsRenderer,
    GoogleMap,
    useJsApiLoader,
} from '@react-google-maps/api';
import { useEffect, useRef, useState } from 'react';

const MapComponent = ({
    origin = 'Nairobi, Kenya',
    destination = 'Kisumu, Kenya',
    isViewModalOpen,
    setIsViewModalOpen,
}) => {
    const googleMapsApiKey = window.googleMapsApiKey;

    const { isLoaded, loadError } = useJsApiLoader({
        googleMapsApiKey: googleMapsApiKey,
    });

    const [directions, setDirections] = useState(null);
    const [routeError, setRouteError] = useState(null);
    const mapRef = useRef(null);

    const containerStyle = {
        width: '100%',
        height: '400px',
    };

    const mapOptions = {
        zoomControl: true,
        streetViewControl: false,
        mapTypeControl: false,
        fullscreenControl: false,
    };

    // Default center for the map if no route is found
    const defaultCenter = {
        lat: 0,
        lng: 35, // Roughly center of Kenya
    };

    useEffect(() => {
        if (!isLoaded || !origin || !destination) return;

        // Reset states when inputs change
        setRouteError(null);

        const directionsService = new window.google.maps.DirectionsService();

        const requestOptions = {
            origin: origin,
            destination: destination,
            travelMode: window.google.maps.TravelMode.DRIVING,
        };

        try {
            directionsService.route(requestOptions, (result, status) => {
                if (status === 'OK' && result) {
                    setDirections(result);
                    setRouteError(null);

                    if (
                        mapRef.current &&
                        result.routes &&
                        result.routes.length > 0
                    ) {
                        const bounds = new window.google.maps.LatLngBounds();
                        result.routes[0].legs.forEach((leg) => {
                            leg.steps.forEach((step) => {
                                if (step.path && Array.isArray(step.path)) {
                                    step.path.forEach((latLng) => {
                                        bounds.extend(latLng);
                                    });
                                }
                            });
                            if (leg.start_location)
                                bounds.extend(leg.start_location);
                            if (leg.end_location)
                                bounds.extend(leg.end_location);
                        });
                        mapRef.current.fitBounds(bounds);
                    }
                } else {
                    // Better error handling
                    console.error(`Directions request failed: ${status}`);
                    setDirections(null);
                    setRouteError(
                        `Could not find a route between "${origin}" and "${destination}"`,
                    );

                    // Try to geocode the locations to center the map
                    tryToGeocodePlaces(origin, destination);
                }
            });
        } catch (error) {
            console.error('Error calculating directions:', error);
            setRouteError('An error occurred while calculating directions');
        }
    }, [isLoaded, origin, destination]);

    // Helper function to try to geocode locations and center the map
    const tryToGeocodePlaces = (origin, destination) => {
        if (!window.google) return;

        const geocoder = new window.google.maps.Geocoder();

        // Try the origin first
        geocoder.geocode({ address: origin }, (results, status) => {
            if (status === 'OK' && results[0] && mapRef.current) {
                mapRef.current.setCenter(results[0].geometry.location);
                mapRef.current.setZoom(5); // Zoom out to show context
            } else {
                // If origin fails, try destination
                geocoder.geocode(
                    { address: destination },
                    (results, status) => {
                        if (status === 'OK' && results[0] && mapRef.current) {
                            mapRef.current.setCenter(
                                results[0].geometry.location,
                            );
                            mapRef.current.setZoom(5);
                        }
                    },
                );
            }
        });
    };

    const onLoad = (map) => {
        mapRef.current = map;
    };

    const onUnmount = () => {
        mapRef.current = null;
    };

    if (loadError) {
        return <div>Error loading maps: {loadError.message}</div>;
    }

    if (!isLoaded) {
        return <div>Loading maps...</div>;
    }

    return (
        <>
            <div
                style={{ position: 'relative', width: '100%', height: '400px' }}
            >
                <GoogleMap
                    mapContainerStyle={containerStyle}
                    center={defaultCenter}
                    zoom={5}
                    options={mapOptions}
                    onLoad={onLoad}
                    onUnmount={onUnmount}
                >
                    {directions && (
                        <DirectionsRenderer
                            directions={directions}
                            options={{
                                suppressMarkers: true,
                                polylineOptions: { strokeColor: '#007bff' },
                            }}
                        />
                    )}
                </GoogleMap>

                {routeError && (
                    <div
                        style={{
                            position: 'absolute',
                            top: '10px',
                            left: '50%',
                            transform: 'translateX(-50%)',
                            backgroundColor: 'white',
                            padding: '10px',
                            borderRadius: '4px',
                            boxShadow: '0 2px 6px rgba(0,0,0,0.3)',
                            zIndex: 10,
                        }}
                    >
                        <p style={{ color: 'red', margin: 0 }}>{routeError}</p>
                    </div>
                )}
            </div>

            {isViewModalOpen && (
                <div className="fixed left-0 top-0 z-50 flex h-full w-full items-center justify-center bg-black bg-opacity-50">
                    <div className="rounded-md bg-white p-4">
                        <p>Confirm close?</p>
                        <div className="mt-4 flex justify-end">
                            <button
                                onClick={() => setIsViewModalOpen(false)}
                                className="mr-2 rounded-md bg-gray-200 px-4 py-2 hover:bg-gray-300"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={() => setIsViewModalOpen(false)}
                                className="rounded-md bg-red-600 px-4 py-2 text-white hover:bg-red-800"
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default MapComponent;
