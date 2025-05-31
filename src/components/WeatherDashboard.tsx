
import React from 'react';
import { WeatherProvider } from '../contexts/WeatherContext';
import SearchInput from './SearchInput';
import WeatherDisplay from './WeatherDisplay';
import ForecastDisplay from './ForecastDisplay';
import ErrorDisplay from './ErrorDisplay';
import Header from './Header';

const WeatherDashboard: React.FC = () => {
  return (
    <WeatherProvider>
      <div className="min-h-screen bg-gradient-to-br from-blue-400 via-blue-500 to-blue-600 p-4">
        <div className="max-w-6xl mx-auto">
          <Header />
          <div className="space-y-6">
            <SearchInput />
            <ErrorDisplay />
            <WeatherDisplay />
            <ForecastDisplay />
          </div>
        </div>
      </div>
    </WeatherProvider>
  );
};

export default WeatherDashboard;
