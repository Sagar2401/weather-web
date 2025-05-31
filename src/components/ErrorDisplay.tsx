
import React from 'react';
import { useWeather } from '../contexts/WeatherContext';
import { AlertCircle, X } from 'lucide-react';

const ErrorDisplay: React.FC = () => {
  const { state, dispatch } = useWeather();

  if (!state.error) {
    return null;
  }

  const clearError = () => {
    dispatch({ type: 'SET_ERROR', payload: null });
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-red-100 border border-red-300 rounded-2xl p-4 flex items-center gap-3">
        <AlertCircle className="w-6 h-6 text-red-600 flex-shrink-0" />
        <div className="flex-1">
          <p className="text-red-800 font-medium">{state.error}</p>
        </div>
        <button
          onClick={clearError}
          className="text-red-600 hover:text-red-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};

export default ErrorDisplay;
