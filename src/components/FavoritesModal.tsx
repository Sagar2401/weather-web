
import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Heart, Trash2, MapPin } from 'lucide-react';
import { useWeather } from '../contexts/WeatherContext';

interface FavoritesModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const FavoritesModal: React.FC<FavoritesModalProps> = ({ isOpen, onClose }) => {
  const { favoritesCities, removeFromFavorites, fetchWeather } = useWeather();

  const handleCityClick = (cityName: string) => {
    fetchWeather(cityName);
    onClose();
  };

  const handleRemove = (cityName: string, e: React.MouseEvent) => {
    e.stopPropagation();
    removeFromFavorites(cityName);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Heart className="w-5 h-5 text-red-500" />
            Favorite Cities
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-2 max-h-96 overflow-y-auto">
          {favoritesCities.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <MapPin className="w-12 h-12 mx-auto mb-2 opacity-50" />
              <p>No favorite cities yet</p>
              <p className="text-sm">Search for a city and add it to favorites!</p>
            </div>
          ) : (
            favoritesCities.map((city) => (
              <div
                key={city.id}
                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 cursor-pointer transition-colors"
                onClick={() => handleCityClick(city.city_name)}
              >
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-gray-500" />
                  <span className="font-medium">{city.city_name}</span>
                  {city.country && (
                    <span className="text-sm text-gray-500">({city.country})</span>
                  )}
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={(e) => handleRemove(city.city_name, e)}
                  className="text-red-500 hover:text-red-700 hover:bg-red-50"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            ))
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default FavoritesModal;
