
import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { History, Clock, MapPin, Thermometer } from 'lucide-react';
import { useWeather } from '../contexts/WeatherContext';

interface HistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const HistoryModal: React.FC<HistoryModalProps> = ({ isOpen, onClose }) => {
  const { searchHistory, fetchWeather, convertTemperature, state } = useWeather();

  const handleCityClick = (cityName: string) => {
    fetchWeather(cityName);
    onClose();
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <History className="w-5 h-5 text-blue-500" />
            Search History
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-2 max-h-96 overflow-y-auto">
          {searchHistory.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <Clock className="w-12 h-12 mx-auto mb-2 opacity-50" />
              <p>No search history yet</p>
              <p className="text-sm">Start searching for cities to see your history!</p>
            </div>
          ) : (
            searchHistory.map((search) => (
              <div
                key={search.id}
                className="p-3 bg-gray-50 rounded-lg hover:bg-gray-100 cursor-pointer transition-colors"
                onClick={() => handleCityClick(search.city_name)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-gray-500" />
                    <span className="font-medium">{search.city_name}</span>
                    {search.country && (
                      <span className="text-sm text-gray-500">({search.country})</span>
                    )}
                  </div>
                  <div className="flex items-center gap-1 text-sm text-gray-600">
                    <Thermometer className="w-3 h-3" />
                    {convertTemperature(search.temperature)}°{state.unit === 'celsius' ? 'C' : 'F'}
                  </div>
                </div>
                <div className="flex items-center justify-between mt-1">
                  <span className="text-sm text-gray-500 capitalize">{search.weather_condition}</span>
                  <span className="text-xs text-gray-400">{formatDate(search.searched_at)}</span>
                </div>
              </div>
            ))
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default HistoryModal;
