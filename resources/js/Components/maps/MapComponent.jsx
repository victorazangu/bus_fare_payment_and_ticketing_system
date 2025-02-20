import {
    DirectionsRenderer,
    GoogleMap,
    useJsApiLoader,
} from '@react-google-maps/api';
import { useEffect, useRef, useState } from 'react';

const googleMapsLibraries = ['places'];

const MapComponent = ({
    origin = '',
    destination = '',
    onDirectionsCalculated = null,
}) => {
    const googleMapsApiKey = 'AIzaSyDpGUFtcO5_1UDp_7rvuUb2NdtPqdKyQUs';
    const { isLoaded, loadError } = useJsApiLoader({
        googleMapsApiKey: googleMapsApiKey,
        libraries: googleMapsLibraries,
    });
    const [directions, setDirections] = useState(null);
    const [routeError, setRouteError] = useState(null);
    const mapRef = useRef(null);
    const [mapLoaded, setMapLoaded] = useState(false);
    const containerStyle = {
        width: '100%',
        height: '100%',
    };
    const mapOptions = {
        zoomControl: true,
        streetViewControl: false,
        mapTypeControl: false,
        fullscreenControl: false,
    };
    useEffect(() => {
        if (!isLoaded || !origin || !destination || !mapLoaded) return;

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
                        result.routes &&
                        result.routes[0].legs &&
                        result.routes[0].legs[0]
                    ) {
                        const leg = result.routes[0].legs[0];
                        const routeInfo = {
                            distance: leg.distance.text,
                            distanceValue: leg.distance.value,
                            duration: leg.duration.text,
                            durationValue: leg.duration.value,
                        };

                        if (onDirectionsCalculated) {
                            onDirectionsCalculated(routeInfo);
                        }
                    }

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
                    setDirections(null);
                    setRouteError(
                        `Could not find a route between "${origin}" and "${destination}"`,
                    );
                    tryToGeocodePlaces(origin, destination);
                }
            });
        } catch (error) {
            setRouteError('An error occurred while calculating directions');
        }
    }, [isLoaded, origin, destination, mapLoaded, onDirectionsCalculated]);

    const tryToGeocodePlaces = (origin, destination) => {
        if (!window.google) return;
        const geocoder = new window.google.maps.Geocoder();

        geocoder.geocode({ address: origin }, (results, status) => {
            if (status === 'OK' && results[0] && mapRef.current) {
                mapRef.current.setCenter(results[0].geometry.location);
                mapRef.current.setZoom(5); // Zoom out to show context
            } else {
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
        setMapLoaded(true);
    };

    const onUnmount = () => {
        mapRef.current = null;
        setMapLoaded(false);
    };

    if (loadError) return <div>Error loading maps: {loadError.message}</div>;
    if (!isLoaded) return <div>Loading maps...</div>;

    return (
        <>
            <div
                style={{ position: 'relative', width: '100%', height: '400px' }}
            >
                <GoogleMap
                    mapContainerStyle={containerStyle}
                    center={{ lat: 0, lng: 35 }}
                    zoom={5}
                    options={mapOptions}
                    onLoad={onLoad}
                    onUnmount={onUnmount}
                >
                    {directions && (
                        <DirectionsRenderer
                            directions={directions}
                            options={{
                                suppressMarkers: false,
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
        </>
    );
};
export default MapComponent;
