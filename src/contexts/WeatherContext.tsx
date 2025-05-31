
import React, { createContext, useContext, useReducer, useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { User, Session } from '@supabase/supabase-js';
import { toast } from '@/hooks/use-toast';

interface WeatherData {
  name: string;
  country: string;
  temperature: number;
  description: string;
  icon: string;
  feelsLike: number;
  humidity: number;
  windSpeed: number;
  pressure: number;
  visibility: number;
}

interface ForecastData {
  date: string;
  temperature: {
    max: number;
    min: number;
  };
  description: string;
  icon: string;
}

interface WeatherState {
  currentWeather: WeatherData | null;
  forecast: ForecastData[];
  isLoading: boolean;
  error: string | null;
  unit: 'celsius' | 'fahrenheit';
}

interface WeatherContextType {
  state: WeatherState;
  dispatch: React.Dispatch<WeatherAction>;
  fetchWeather: (city: string) => Promise<void>;
  convertTemperature: (temp: number) => number;
  user: User | null;
  session: Session | null;
  signOut: () => Promise<void>;
  addToFavorites: (city: string, country: string) => Promise<void>;
  removeFromFavorites: (city: string) => Promise<void>;
  favoritesCities: Array<{id: string; city_name: string; country: string}>;
  searchHistory: Array<{id: string; city_name: string; country: string; temperature: number; weather_condition: string; searched_at: string}>;
}

type WeatherAction =
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_WEATHER'; payload: WeatherData }
  | { type: 'SET_FORECAST'; payload: ForecastData[] }
  | { type: 'SET_ERROR'; payload: string }
  | { type: 'TOGGLE_UNIT' }
  | { type: 'CLEAR_ERROR' };

const initialState: WeatherState = {
  currentWeather: null,
  forecast: [],
  isLoading: false,
  error: null,
  unit: 'celsius',
};

const weatherReducer = (state: WeatherState, action: WeatherAction): WeatherState => {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload };
    case 'SET_WEATHER':
      return { ...state, currentWeather: action.payload, isLoading: false, error: null };
    case 'SET_FORECAST':
      return { ...state, forecast: action.payload };
    case 'SET_ERROR':
      return { ...state, error: action.payload, isLoading: false };
    case 'TOGGLE_UNIT':
      return { ...state, unit: state.unit === 'celsius' ? 'fahrenheit' : 'celsius' };
    case 'CLEAR_ERROR':
      return { ...state, error: null };
    default:
      return state;
  }
};

const WeatherContext = createContext<WeatherContextType | undefined>(undefined);

export const WeatherProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(weatherReducer, initialState);
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [favoritesCities, setFavoritesCities] = useState<Array<{id: string; city_name: string; country: string}>>([]);
  const [searchHistory, setSearchHistory] = useState<Array<{id: string; city_name: string; country: string; temperature: number; weather_condition: string; searched_at: string}>>([]);

  const API_KEY = '249436e1b1d48726a7b7a8e2d87abca9';

  useEffect(() => {
    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        
        if (session?.user) {
          setTimeout(() => {
            fetchUserData(session.user.id);
          }, 0);
        } else {
          setFavoritesCities([]);
          setSearchHistory([]);
        }
      }
    );

    // Check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      if (session?.user) {
        fetchUserData(session.user.id);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const fetchUserData = async (userId: string) => {
    try {
      // Fetch favorite cities
      const { data: favorites } = await supabase
        .from('favorite_cities')
        .select('id, city_name, country')
        .eq('user_id', userId);
      
      if (favorites) {
        setFavoritesCities(favorites);
      }

      // Fetch search history
      const { data: history } = await supabase
        .from('weather_searches')
        .select('id, city_name, country, temperature, weather_condition, searched_at')
        .eq('user_id', userId)
        .order('searched_at', { ascending: false })
        .limit(10);
      
      if (history) {
        setSearchHistory(history);
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
    }
  };

  const fetchWeather = async (city: string) => {
    dispatch({ type: 'SET_LOADING', payload: true });
    dispatch({ type: 'CLEAR_ERROR' });

    try {
      // Fetch current weather
      const currentResponse = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`
      );

      if (!currentResponse.ok) {
        throw new Error('City not found');
      }

      const currentData = await currentResponse.json();

      const weatherData: WeatherData = {
        name: currentData.name,
        country: currentData.sys.country,
        temperature: Math.round(currentData.main.temp),
        description: currentData.weather[0].description,
        icon: currentData.weather[0].icon,
        feelsLike: Math.round(currentData.main.feels_like),
        humidity: currentData.main.humidity,
        windSpeed: Math.round(currentData.wind.speed * 3.6), // Convert m/s to km/h
        pressure: currentData.main.pressure,
        visibility: Math.round(currentData.visibility / 1000), // Convert to km
      };

      dispatch({ type: 'SET_WEATHER', payload: weatherData });

      // Fetch 5-day forecast
      const forecastResponse = await fetch(
        `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${API_KEY}&units=metric`
      );

      if (forecastResponse.ok) {
        const forecastData = await forecastResponse.json();
        
        // Process forecast data - get daily min/max temperatures
        const dailyForecasts: ForecastData[] = [];
        const dailyData: { [key: string]: { temps: number[], descriptions: string[], icons: string[] } } = {};

        forecastData.list.forEach((item: any) => {
          const date = new Date(item.dt * 1000);
          const dateString = date.toDateString();
          
          if (!dailyData[dateString]) {
            dailyData[dateString] = { temps: [], descriptions: [], icons: [] };
          }
          
          dailyData[dateString].temps.push(item.main.temp);
          dailyData[dateString].descriptions.push(item.weather[0].description);
          dailyData[dateString].icons.push(item.weather[0].icon);
        });

        // Convert to daily forecasts with min/max temps
        Object.keys(dailyData).slice(0, 5).forEach(dateString => {
          const data = dailyData[dateString];
          const maxTemp = Math.round(Math.max(...data.temps));
          const minTemp = Math.round(Math.min(...data.temps));
          
          dailyForecasts.push({
            date: dateString,
            temperature: {
              max: maxTemp,
              min: minTemp
            },
            description: data.descriptions[0], // Use first description of the day
            icon: data.icons[0] // Use first icon of the day
          });
        });

        dispatch({ type: 'SET_FORECAST', payload: dailyForecasts });
      }

      // Save search to database if user is logged in
      if (user) {
        await supabase
          .from('weather_searches')
          .insert({
            user_id: user.id,
            city_name: weatherData.name,
            country: weatherData.country,
            temperature: weatherData.temperature,
            weather_condition: weatherData.description
          });
        
        // Refresh search history
        fetchUserData(user.id);
      }

   

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to fetch weather data';
      dispatch({ type: 'SET_ERROR', payload: errorMessage });
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    }
  };

  const convertTemperature = (temp: number): number => {
    if (state.unit === 'fahrenheit') {
      return Math.round((temp * 9/5) + 32);
    }
    return temp;
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    toast({
      title: "Signed out",
      description: "You have been successfully signed out",
    });
  };

  const addToFavorites = async (city: string, country: string) => {
    if (!user) {
      toast({
        title: "Please sign in",
        description: "You need to be signed in to add favorites",
        variant: "destructive",
      });
      return;
    }

    try {
      const { error } = await supabase
        .from('favorite_cities')
        .insert({
          user_id: user.id,
          city_name: city,
          country: country
        });

      if (error) throw error;

      toast({
        title: "Added to favorites",
        description: `${city} has been added to your favorites`,
      });

      // Refresh favorites
      fetchUserData(user.id);
    } catch (error: any) {
      if (error.code === '23505') {
        toast({
          title: "Already in favorites",
          description: `${city} is already in your favorites`,
          variant: "destructive",
        });
      } else {
        toast({
          title: "Error",
          description: "Failed to add city to favorites",
          variant: "destructive",
        });
      }
    }
  };

  const removeFromFavorites = async (city: string) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('favorite_cities')
        .delete()
        .eq('user_id', user.id)
        .eq('city_name', city);

      if (error) throw error;

      toast({
        title: "Removed from favorites",
        description: `${city} has been removed from your favorites`,
      });

      // Refresh favorites
      fetchUserData(user.id);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to remove city from favorites",
        variant: "destructive",
      });
    }
  };

  const value: WeatherContextType = {
    state,
    dispatch,
    fetchWeather,
    convertTemperature,
    user,
    session,
    signOut,
    addToFavorites,
    removeFromFavorites,
    favoritesCities,
    searchHistory,
  };

  return <WeatherContext.Provider value={value}>{children}</WeatherContext.Provider>;
};

export const useWeather = () => {
  const context = useContext(WeatherContext);
  if (context === undefined) {
    throw new Error('useWeather must be used within a WeatherProvider');
  }
  return context;
};
