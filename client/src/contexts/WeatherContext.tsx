import { createContext, useContext } from "react";
import { useWeather } from "@/hooks/useWeather";


const WeatherContext = createContext<ReturnType<typeof useWeather> | null>(null);

export const WeatherProvider = ({children} : {children: React.ReactNode}) => {
    const {weatherData, loading, weatherError, requestLocation, locationError} = useWeather();
    // console.log("WeatherProvider mounting...", weather);
    return (
        <WeatherContext.Provider value={{weatherData, loading, weatherError, requestLocation, locationError}}>
            {children}
        </WeatherContext.Provider>
    )
}

export const useWeatherContext = () => {
    const context = useContext(WeatherContext);
    if (!context) {
        throw new Error('useWeatherContext must be used within a WeatherProvider');
    }
    return context;
}