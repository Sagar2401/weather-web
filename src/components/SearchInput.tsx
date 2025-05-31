
import React, { useState } from 'react';
import { useWeather } from '../contexts/WeatherContext';
import { Search } from 'lucide-react';

const SearchInput: React.FC = () => {
  const [inputValue, setInputValue] = useState('');
  const { fetchWeather, state } = useWeather();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputValue.trim()) {
      fetchWeather(inputValue.trim());
      setInputValue('');
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <form onSubmit={handleSubmit} className="relative">
        <div className="relative">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Enter city name (e.g., London, New York, Tokyo)"
            className="w-full px-6 py-4 pl-12 text-lg bg-white/90 backdrop-blur-sm rounded-2xl border-0 focus:outline-none focus:ring-4 focus:ring-white/30 shadow-lg transition-all duration-200"
            disabled={state.isLoading}
          />
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
        </div>
        <button
          type="submit"
          disabled={state.isLoading || !inputValue.trim()}
          className="absolute right-2 top-1/2 transform -translate-y-1/2 px-6 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white rounded-xl transition-all duration-200 font-medium"
        >
          {state.isLoading ? 'Searching...' : 'Search'}
        </button>
      </form>
    </div>
  );
};

export default SearchInput;
