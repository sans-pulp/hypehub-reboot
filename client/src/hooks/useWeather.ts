import { useState, useEffect } from 'react';
import { useGeolocation } from './useGeolocation';

export interface WeatherData {
    current: {
        temperature_2m: number;
        apparent_temperature: number;
        precipitation: number;
        weathercode: number;
        windspeed_10m: number;
        is_day: 1|0;
    },
    daily: {
        time: string[];
        weathercode: number[];
        temperature_2m_max: number[];
        temperature_2m_min: number[];
        precipitation_sum: number[];
        precipitation_probability_max: number[];
        windspeed_10m_max: number[];
    },
    hourly: {
        time: string[];
        temperature_2m: number[];
        precipitation_probability: number[];
        weathercode: number[];
        is_day: (1|0)[];
    },
}

export const useWeather = () => {
    const { location, error, requestLocation } = useGeolocation();
    const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
    const [loading, setLoading] = useState(false);
    const [weatherError, setWeatherError] = useState<Error | null>(null);

    useEffect(() => {
        if (!location) return;

        const fetchWeather = async () => {
            setLoading(true);
            const params = new URLSearchParams({
                latitude: location.coords.latitude.toString(),
                longitude: location.coords.longitude.toString(),
                timezone: 'auto',
                current: [
                    'temperature_2m',
                    'apparent_temperature',
                    'precipitation',
                    'weathercode',
                    'windspeed_10m',
                    'is_day'
                ].join(','),
                daily: [
                    'weathercode',
                    'temperature_2m_max',
                    'temperature_2m_min',
                    'precipitation_sum',
                    'precipitation_probability_max',
                    'windspeed_10m_max'
                ].join(','),
                hourly: [
                    'temperature_2m',
                    'precipitation_probability',
                    'weathercode',
                    'is_day'
                ].join(','),
                forecast_days: '3'
            });

            try {
                const response = await fetch(`https://api.open-meteo.com/v1/forecast?${params}`);
                if (!response.ok) {
                    throw new Error('Weather API request failed');
                }
                const data = await response.json();
                setWeatherData({
                    current: data.current,
                    daily: data.daily,
                    hourly: data.hourly
                } as WeatherData);
                setWeatherError(null);
            } catch (error) {
                console.error('Error fetching weather:', error);
                setWeatherError(error as Error);
            } finally {
                setLoading(false);
            }
        };
        
        fetchWeather();
    }, [location]);

    return { 
        weatherData, 
        loading, 
        weatherError,
        requestLocation,
        locationError: error 
    };
};