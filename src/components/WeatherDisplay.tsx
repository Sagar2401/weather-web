
import React from 'react';
import { useWeather } from '../contexts/WeatherContext';
import { Wind, Thermometer, Cloud, Sun, Heart, HeartOff } from 'lucide-react';
import { Button } from "@/components/ui/button";
import UserMenu from './UserMenu';
import { Toggle } from './ui/toggle';

const WeatherDisplay: React.FC = () => {
  const { state,dispatch, convertTemperature, user, addToFavorites, removeFromFavorites, favoritesCities } = useWeather();

  if (!state.currentWeather) {
    return null;
  }

  const { currentWeather } = state;

  const getWeatherIcon = (iconCode: string) => {
    if (iconCode.includes('01')) return <Sun className="w-16 h-16 text-yellow-400" />;
    return <Cloud className="w-16 h-16 text-gray-300" />;
  };

  const isFavorite = favoritesCities.some(fav => fav.city_name === currentWeather.name);

  const handleFavoriteToggle = () => {
    if (isFavorite) {
      removeFromFavorites(currentWeather.name);
    } else {
      addToFavorites(currentWeather.name, currentWeather.country);
    }
  };
  const handleUnitToggle = () => {
    dispatch({ type: 'TOGGLE_UNIT' });
  };
  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white/90 backdrop-blur-sm rounded-3xl p-8 shadow-2xl relative">
        <div className="absolute top-4 right-4 z-10">

       <div
            onClick={handleUnitToggle}
        className="flex items-center gap-2 cursor-pointer bg-gradient-to-br from-blue-400 via-blue-500 to-blue-600 rounded-lg p-2">
          <Thermometer className="w-4 h-4 text-white hidden md:flex" />
          <Toggle
            pressed={state.unit === 'fahrenheit'}
            className="data-[state=on]:bg-white/0 data-[state=on]:text-white text-white hover:text-white hover:bg-white/0"
          >
            {state.unit === 'fahrenheit' ? '°F' : '°C'}
          </Toggle>
           {/* User Menu in top right corner */}
        </div>
        </div>

        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-4 mb-2">
            <h2 className="text-3xl font-bold text-gray-800">
              {currentWeather.name}, {currentWeather.country}
            </h2>
            {user && (
              <Button
                variant="ghost"
                size="sm"
                onClick={handleFavoriteToggle}
                className={`p-2 ${isFavorite ? 'text-red-500 hover:text-red-600' : 'text-gray-400 hover:text-red-500'}`}
              >
                {isFavorite ? <Heart className="w-5 h-5 fill-current" /> : <HeartOff className="w-5 h-5" />}
              </Button>
            )}
          </div>
          
          <div className="flex items-center justify-center gap-4 mb-4">
            {getWeatherIcon(currentWeather.icon)}
            <div>
              <div className="text-6xl font-bold text-gray-800">
                {convertTemperature(currentWeather.temperature)}°
              </div>
              <div className="text-lg text-gray-600 capitalize">
                {currentWeather.description}
              </div>
            </div>
          </div>
          <div className="text-gray-600">
            Feels like {convertTemperature(currentWeather.feelsLike)}°
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          <div className="text-center p-4 bg-blue-50 rounded-2xl">
            <div className="flex items-center justify-center mb-2">
              <Thermometer className="w-6 h-6 text-blue-600" />
            </div>
            <div className="text-2xl font-bold text-gray-800">{currentWeather.humidity}%</div>
            <div className="text-sm text-gray-600">Humidity</div>
          </div>

          <div className="text-center p-4 bg-green-50 rounded-2xl">
            <div className="flex items-center justify-center mb-2">
              <Wind className="w-6 h-6 text-green-600" />
            </div>
            <div className="text-2xl font-bold text-gray-800">{currentWeather.windSpeed} km/h</div>
            <div className="text-sm text-gray-600">Wind Speed</div>
          </div>

          <div className="text-center p-4 bg-purple-50 rounded-2xl">
            <div className="flex items-center justify-center mb-2">
              <Cloud className="w-6 h-6 text-purple-600" />
            </div>
            <div className="text-2xl font-bold text-gray-800">{currentWeather.pressure} hPa</div>
            <div className="text-sm text-gray-600">Pressure</div>
          </div>

          <div className="text-center p-4 bg-orange-50 rounded-2xl">
            <div className="flex items-center justify-center mb-2">
              <Sun className="w-6 h-6 text-orange-600" />
            </div>
            <div className="text-2xl font-bold text-gray-800">{currentWeather.visibility} km</div>
            <div className="text-sm text-gray-600">Visibility</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WeatherDisplay;
