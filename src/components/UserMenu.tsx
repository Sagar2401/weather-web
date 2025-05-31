
import React, { useState } from 'react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { User, LogOut, Settings, Heart, History } from 'lucide-react';
import AuthModal from './AuthModal';
import { useWeather } from '../contexts/WeatherContext';
import FavoritesModal from './FavoritesModal';
import HistoryModal from './HistoryModal';

const UserMenu: React.FC = () => {
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');
  const [isFavoritesOpen, setIsFavoritesOpen] = useState(false);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const { user, signOut } = useWeather();

  const handleAuthClick = (mode: 'login' | 'register') => {
    setAuthMode(mode);
    setIsAuthModalOpen(true);
  };

  const toggleAuthMode = () => {
    setAuthMode(authMode === 'login' ? 'register' : 'login');
  };

  if (!user) {
    return (
      <>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleAuthClick('login')}
            className="bg-blue-600 border-blue-600 text-white hover:bg-blue-700 shadow-lg"
          >
            Sign In
          </Button>
          <Button
            size="sm"
            onClick={() => handleAuthClick('register')}
            className="bg-white text-blue-600 hover:bg-gray-50 hidden sm:flex shadow-lg"
          >
            Sign Up
          </Button>
        </div>
        
        <AuthModal
          isOpen={isAuthModalOpen}
          onClose={() => setIsAuthModalOpen(false)}
          mode={authMode}
          onToggleMode={toggleAuthMode}
        />
      </>
    );
  }
console.log(user)
  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="sm" className="bg-white capitalize border-gray-300 text-gray-700 hover:bg-gray-50 shadow-lg">
            <User className="w-4 h-4 mr-2  " />
            <span className='hidden sm:flex'>

            {user?.user_metadata?.full_name||user.email.split('@')[0]}
          </span></Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-48 bg-white border border-gray-200 shadow-xl z-50">
          <DropdownMenuItem className='text-center sm:hidden'>
                       {user?.user_metadata?.full_name||user.email.split('@')[0]}

          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setIsFavoritesOpen(true)}>
            <Heart className="w-4 h-4 mr-2" />
            Favorites
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setIsHistoryOpen(true)}>
            <History className="w-4 h-4 mr-2" />
            Search History
          </DropdownMenuItem>
          <DropdownMenuItem>
            <Settings className="w-4 h-4 mr-2" />
            Settings
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={signOut}>
            <LogOut className="w-4 h-4 mr-2" />
            Sign Out
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <FavoritesModal 
        isOpen={isFavoritesOpen} 
        onClose={() => setIsFavoritesOpen(false)} 
      />
      
      <HistoryModal 
        isOpen={isHistoryOpen} 
        onClose={() => setIsHistoryOpen(false)} 
      />
    </>
  );
};

export default UserMenu;
