
import React, { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { CloudSun } from 'lucide-react';
import AuthModal from '../components/AuthModal';
import { useWeather } from '../contexts/WeatherContext';

const Auth: React.FC = () => {
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');
  const { user } = useWeather();

  // Redirect to home if user is already logged in
  if (user) {
    return <Navigate to="/" replace />;
  }

  const toggleAuthMode = () => {
    setAuthMode(authMode === 'login' ? 'register' : 'login');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-400 via-blue-500 to-blue-600 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <CloudSun className="w-12 h-12 text-yellow-300" />
            <h1 className="text-4xl font-bold text-white">Weather Dashboard</h1>
          </div>
          <p className="text-xl text-white/90">
            Sign in to save your favorite cities and view search history
          </p>
        </div>

        <AuthModal
          isOpen={true}
          onClose={() => {}}
          mode={authMode}
          onToggleMode={toggleAuthMode}
        />
      </div>
    </div>
  );
};

export default Auth;
