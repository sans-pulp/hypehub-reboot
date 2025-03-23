import { useWeatherContext } from "@/contexts/WeatherContext";
import { 
  Thermometer, 
  ThermometerSun, 
  RotateCw, 
  MapPin,
  Sun,
  Sunrise,
  Sunset,
  Moon,
  Cloud,
  CloudFog,
  Cloudy,
  CloudRain,
  CloudSnow,
  CloudLightning,
  CloudDrizzle,
  CloudMoon
} from "lucide-react";
import { useCallback } from "react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

const getWeatherIcon = (code: number, isDay: 0 | 1) => {
  // Clear sky
  if (code === 0) return { 
    icon: isDay ? Sun : Moon, 
    description: isDay ? "Clear sky" : "Clear night" 
  };
  
  // Mainly clear, partly cloudy, and overcast
  if (code <= 3) return { 
    icon: isDay ? Cloud : CloudMoon, 
    description: isDay ? "Partly cloudy" : "Partly cloudy night" 
  };
  
  // Fog
  if (code <= 48) return { icon: CloudFog, description: "Foggy conditions" };
  
  // Drizzle
  if (code <= 57) return { icon: CloudDrizzle, description: "Light drizzle" };
  
  // Rain
  if (code <= 67) return { icon: CloudRain, description: "Rainy conditions" };
  
  // Snow
  if (code <= 77) return { icon: CloudSnow, description: "Snowy conditions" };
  
  // Rain showers
  if (code <= 82) return { icon: CloudRain, description: "Rain showers" };
  
  // Snow showers
  if (code <= 86) return { icon: CloudSnow, description: "Snow showers" };
  
  // Thunderstorm
  if (code >= 95) return { icon: CloudLightning, description: "Thunderstorm" };
  
  return { icon: Cloudy, description: "Cloudy conditions" };
};

const getSunriseSunset = (sunrise: string[], sunset: string[]) => {
    const now = new Date();
    const sunriseDate = sunrise.find(date => new Date(date).getDay() === now.getDay()) ?? sunrise[0];
    const sunsetDate = sunset.find(date => new Date(date).getDay() === now.getDay()) ?? sunset[0];
    
    return {
        sunrise: new Date(sunriseDate).toLocaleString('en-US', { hour: 'numeric', minute: 'numeric' }),
        sunset: new Date(sunsetDate).toLocaleString('en-US', { hour: 'numeric', minute: 'numeric' })
    }
}

export const WeatherStatus = () => {
  const { 
    weatherData, 
    loading, 
    weatherError, 
    locationError,
    requestLocation 
  } = useWeatherContext();

  const handleWeatherRequest = useCallback(() => {
    requestLocation();
  }, [requestLocation]);

  const getTemperatureColor = (temp: number) => {
    if (temp <= 0) return "text-blue-400";
    if (temp <= 10) return "text-cyan-400";
    if (temp <= 20) return "text-green-400";
    if (temp <= 30) return "text-yellow-400";
    return "text-orange-400";
  };

  // Show loading state while loading weather data
  if (loading) {
    return (
      <span className="flex items-center gap-1 text-gray-400">
        <RotateCw className="w-4 h-4 animate-spin" />
        <span className="text-sm">Loading...</span>
      </span>
    );
  }

  // Show error state (combines location and weather errors)
  if (locationError || weatherError) {
    return (
      <button 
        className="text-gray-400 hover:text-white cursor-pointer flex items-center gap-1 px-2 py-1 rounded transition-colors"
        onClick={handleWeatherRequest}
      >
        <RotateCw className="w-4 h-4" />
        <span className="text-sm">
          {locationError ? 'Enable Location' : 'Retry Weather'}
        </span>
      </button>
    );
  }

  // Show weather data or initial state
  if (!weatherData) {
    return (
      <button 
        className="text-gray-400 hover:text-white cursor-pointer flex items-center gap-1 px-2 py-1 rounded transition-colors"
        onClick={handleWeatherRequest}
      >
        <MapPin className="w-4 h-4" />
        <span className="text-sm">Get Weather</span>
      </button>
    );
  }

  const { icon: WeatherIcon, description: weatherDescription } = getWeatherIcon(
    weatherData.current.weathercode,
    weatherData.current.is_day
  );

  const { sunrise, sunset } = getSunriseSunset(weatherData.daily.sunrise, weatherData.daily.sunset);
  
  return (
    <TooltipProvider>
      <div className="flex items-center gap-3">
        <div className="sunrise-sunset-container flex gap-2">
            <Tooltip>
                <TooltipTrigger asChild>
                    <div className="flex items-center gap-1 cursor-help">
                    <Sunrise className="w-4 h-4" />
                    <span className="text-xs">{sunrise}</span>
                </div>
            </TooltipTrigger>
            <TooltipContent className="bg-gray-900 text-white">
                <p className="text-xs">Sunrise</p>
            </TooltipContent>
        </Tooltip>
        <Tooltip>
            <TooltipTrigger asChild>
                <div className="flex items-center gap-1 cursor-help">
                    <Sunset className="w-4 h-4" />
                    <span className="text-xs">{sunset}</span>
                </div>
            </TooltipTrigger>
            <TooltipContent className="bg-gray-900 text-white">
                <p className="text-xs">Sunset</p>
            </TooltipContent>
            </Tooltip>
        </div>
        <Tooltip>
          <TooltipTrigger asChild>
            <div className="flex items-center gap-1 cursor-help">
              <WeatherIcon className="w-5 h-5 text-gray-300" />
            </div>
          </TooltipTrigger>
          <TooltipContent className="bg-gray-900 text-white">
            <p className="text-xs">{weatherDescription}</p>
          </TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <div className="flex items-center gap-1 cursor-help">
              <Thermometer className={`w-4 h-4 ${getTemperatureColor(weatherData.current.temperature_2m)}`} />
              <span className={`text-xs font-medium ${getTemperatureColor(weatherData.current.temperature_2m)}`}>   
                {weatherData.current.temperature_2m}°
              </span>
            </div>
          </TooltipTrigger>
          <TooltipContent className="bg-gray-900 text-white">
            <p className="text-xs">Current Temperature</p>
          </TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <div className="flex items-center gap-1 cursor-help">
              <ThermometerSun className={`w-4 h-4 ${getTemperatureColor(weatherData.current.apparent_temperature)}`} />
              <span className={`text-xs ${getTemperatureColor(weatherData.current.apparent_temperature)}`}>
                {weatherData.current.apparent_temperature}°
              </span>
            </div>
          </TooltipTrigger>
          <TooltipContent className="bg-gray-900 text-white">
            <p className="text-xs">Feels Like Temperature</p>
          </TooltipContent>
        </Tooltip>
      </div>
    </TooltipProvider>
  );
};