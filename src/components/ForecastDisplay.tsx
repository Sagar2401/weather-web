
import React from 'react';
import { useWeather } from '../contexts/WeatherContext';
import { Sun, Cloud } from 'lucide-react';

const ForecastDisplay: React.FC = () => {
  const { state, convertTemperature } = useWeather();

  if (!state.forecast.length) {
    return null;
  }

  const getWeatherIcon = (iconCode: string) => {
    if (iconCode.includes('01')) return <Sun className="w-8 h-8 text-yellow-400" />;
    return <Cloud className="w-8 h-8 text-gray-400" />;
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white/90 backdrop-blur-sm rounded-3xl p-8 shadow-2xl">
        <h3 className="text-2xl font-bold text-gray-800 mb-6 text-center">
          5-Day Forecast
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          {state.forecast.map((day, index) => (
            <div
              key={index}
              className="text-center p-4 bg-gradient-to-b from-blue-50 to-blue-100 rounded-2xl hover:shadow-lg transition-all duration-200"
            >
              <div className="text-sm font-medium text-gray-600 mb-2">
                {formatDate(day.date)}
              </div>
              
              <div className="flex justify-center mb-3">
                {getWeatherIcon(day.icon)}
              </div>
              
              <div className="text-lg font-bold text-gray-800 mb-1">
                {convertTemperature(day.temperature.max)}°
              </div>
              
              <div className="text-sm text-gray-600 mb-2">
                {convertTemperature(day.temperature.min)}°
              </div>
              
              <div className="text-xs text-gray-500 capitalize">
                {day.description}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ForecastDisplay;
