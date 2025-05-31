
import React from 'react';
import { CloudSun, Thermometer } from 'lucide-react';
import UserMenu from './UserMenu';

const Header: React.FC = () => {


  return (
    <header className="text-center mb-8">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <CloudSun className="w-10 h-10 text-yellow-300" />
          <h1 className="text-xl md:text-4xl font-bold text-white">Weather Dashboard</h1>
        </div>
        
       
          <UserMenu />
        
      </div>
      
      <p className="text-md md:text-xl text-white/90">
        Get real-time weather updates for any city worldwide
      </p>
    </header>
  );
};

export default Header;
