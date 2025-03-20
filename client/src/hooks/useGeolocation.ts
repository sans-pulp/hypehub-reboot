import { useState, useCallback, useEffect } from 'react';

export const useGeolocation = () => {
    const [location, setLocation] = useState<GeolocationPosition | null>(null);
    const [error, setError] = useState<GeolocationPositionError | null>(null);

    const requestLocation = useCallback(() => {
        if (!navigator.geolocation) {
            setError({ code: 2, message: "Geolocation not supported" } as GeolocationPositionError);
            return;
        }

        navigator.geolocation.getCurrentPosition(
            (position) => {
                setLocation(position);
                setError(null);
            },
            (err) => setError(err),
            { 
                timeout: 5000,           // Reduced timeout to 5 seconds
                maximumAge: 60000,       // Cache location for 1 minute
                enableHighAccuracy: false // Faster, less accurate location is fine for weather
            }
        );
    }, []);

    // Check permission and request location on mount if already granted
    useEffect(() => {
        if (!navigator.permissions) return;

        navigator.permissions.query({ name: 'geolocation' }).then((result) => {
            if (result.state === 'granted') {
                requestLocation();
            }
        });
    }, [requestLocation]);

    return { location, error, requestLocation };
};