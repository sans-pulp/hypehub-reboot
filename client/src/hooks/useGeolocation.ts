import { useState, useCallback, useEffect, useRef } from 'react';

/**
 * Represents the location data structure stored in localStorage.
 * This is a simplified version of the GeolocationPosition interface
 * that can be safely serialized to JSON.
 */
interface StoredLocation {
    coords: {
        latitude: number;
        longitude: number;
        accuracy: number;
        altitude: number | null;
        altitudeAccuracy: number | null;
        heading: number | null;
        speed: number | null;
    };
    timestamp: number;
}

// Configuration constants
const LOCATION_UPDATE_INTERVAL = 5 * 60 * 1000; // Cache location for 5 minutes
const GEOLOCATION_OPTIONS = {
    timeout: 15000,        // Initial timeout: 15 seconds
    maximumAge: 300000,    // Accept cached positions up to 5 minutes old
    enableHighAccuracy: false // Prefer faster response over high accuracy
} as const;

/**
 * Custom hook for handling geolocation with caching and error handling.
 * Provides location data, error state, and a method to request updates.
 */
export const useGeolocation = () => {
    // Initialize location state from localStorage if available
    const [location, setLocation] = useState<GeolocationPosition | null>(() => {
        try {
            const stored = localStorage.getItem('lastLocation');
            if (!stored) return null;
            
            const parsed = JSON.parse(stored) as StoredLocation;
            // Validate required coordinates exist
            if (!parsed.coords.latitude || !parsed.coords.longitude) return null;
            
            // Reconstruct GeolocationPosition from stored data
            return {
                coords: {
                    latitude: parsed.coords.latitude,
                    longitude: parsed.coords.longitude,
                    accuracy: parsed.coords.accuracy || 0,
                    altitude: parsed.coords.altitude,
                    altitudeAccuracy: parsed.coords.altitudeAccuracy,
                    heading: parsed.coords.heading,
                    speed: parsed.coords.speed
                },
                timestamp: parsed.timestamp
            } as GeolocationPosition;
        } catch (e) {
            // Clear invalid stored location data
            localStorage.removeItem('lastLocation');
            return null;
        }
    });
    const [error, setError] = useState<GeolocationPositionError | null>(null);
    const lastUpdateRef = useRef<number>(parseInt(localStorage.getItem('lastLocationUpdate') || '0'));

    /**
     * Saves the location to state and localStorage, updating all relevant timestamps.
     */
    const saveLocation = useCallback((position: GeolocationPosition) => {
        const currentTimestamp = Date.now();
        setLocation(position);
        setError(null);
        lastUpdateRef.current = currentTimestamp;
        
        // Persist location data and timestamp
        localStorage.setItem('lastLocationUpdate', currentTimestamp.toString());
        localStorage.setItem('lastLocation', JSON.stringify({
            coords: {
                latitude: position.coords.latitude,
                longitude: position.coords.longitude,
                accuracy: position.coords.accuracy,
                altitude: position.coords.altitude,
                altitudeAccuracy: position.coords.altitudeAccuracy,
                heading: position.coords.heading,
                speed: position.coords.speed
            },
            timestamp: position.timestamp
        }));
    }, []);

    /**
     * Handles geolocation errors, with special retry logic for timeout errors.
     */
    const handleLocationError = useCallback(async (error: GeolocationPositionError) => {
        console.error('Location error:', error);
        setError(error);

        // For timeout errors, retry with extended timeout
        if (error.code === 3) {
            try {
                const position = await new Promise<GeolocationPosition>((resolve, reject) => {
                    navigator.geolocation.getCurrentPosition(
                        resolve,
                        reject,
                        { ...GEOLOCATION_OPTIONS, timeout: 30000 } // Double timeout for retry
                    );
                });
                saveLocation(position);
            } catch (retryError) {
                console.error('Location retry failed:', retryError);
            }
        }
    }, [saveLocation]);

    /**
     * Requests a location update if needed, respecting cache duration.
     * Returns immediately if a recent location is available.
     */
    const requestLocation = useCallback(() => {
        const now = Date.now();
        // Check if we have a recent enough location
        const hasRecentLocation = location && 
            lastUpdateRef.current && 
            (now - lastUpdateRef.current) <= LOCATION_UPDATE_INTERVAL;

        if (hasRecentLocation) {
            console.log('Using cached location, last updated:', new Date(lastUpdateRef.current));
            return;
        }

        // Verify browser support
        if (!navigator.geolocation) {
            setError({ code: 2, message: "Geolocation not supported" } as GeolocationPositionError);
            return;
        }

        console.log('Requesting location...');
        navigator.geolocation.getCurrentPosition(
            saveLocation,
            handleLocationError,
            GEOLOCATION_OPTIONS
        );
    }, [location, saveLocation, handleLocationError]);

    // Request location on mount if permission is already granted
    useEffect(() => {
        if (!navigator.permissions) return;

        navigator.permissions.query({ name: 'geolocation' })
            .then(result => {
                if (result.state === 'granted') {
                    requestLocation();
                }
            });
    }, [requestLocation]);

    return { location, error, requestLocation };
};