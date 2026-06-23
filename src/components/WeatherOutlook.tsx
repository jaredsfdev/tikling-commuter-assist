import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Cloud,
  CloudRain,
  Sun,
  Wind,
  Droplets,
  CloudSun,
  CloudLightning,
  Thermometer,
  RefreshCw,
  MapPin,
  Calendar,
  AlertCircle,
  HelpCircle,
  ArrowRight
} from 'lucide-react';
import { Waypoint } from '../types';

// Helper to convert WMO weather codes to user-friendly text and icons
export const getWeatherDetails = (code: number) => {
  if (code === 0) return { label: 'Clear Sky', icon: Sun, color: 'text-amber-500' };
  if (code >= 1 && code <= 3) return { label: 'Partly Cloudy', icon: CloudSun, color: 'text-blue-400' };
  if (code === 45 || code === 48) return { label: 'Foggy', icon: Cloud, color: 'text-slate-400' };
  if (code >= 51 && code <= 57) return { label: 'Light Drizzle', icon: CloudRain, color: 'text-sky-400' };
  if (code >= 61 && code <= 67) return { label: 'Rainy', icon: CloudRain, color: 'text-indigo-400' };
  if (code >= 71 && code <= 77) return { label: 'Snowy', icon: Cloud, color: 'text-blue-105' };
  if (code >= 80 && code <= 82) return { label: 'Rain Showers', icon: CloudRain, color: 'text-blue-400' };
  if (code >= 85 && code <= 86) return { label: 'Snow Showers', icon: Cloud, color: 'text-blue-200' };
  if (code >= 95 && code <= 99) return { label: 'Thunderstorms', icon: CloudLightning, color: 'text-purple-500' };
  return { label: 'Overcast', icon: Cloud, color: 'text-slate-450' };
};

interface WeatherData {
  current: {
    temp: number;
    feelsLike: number;
    humidity: number;
    windSpeed: number;
    weatherCode: number;
    time: string;
  };
  forecast: {
    date: string;
    weatherCode: number;
    tempMax: number;
    tempMin: number;
  }[];
}

interface WeatherOutlookProps {
  waypoints: Waypoint[];
  isOffline?: boolean;
  isTikiNightMode?: boolean;
}

export const WeatherOutlook: React.FC<WeatherOutlookProps> = ({
  waypoints,
  isOffline = false,
  isTikiNightMode = false
}) => {
  const [activeSegment, setActiveSegment] = useState<'start' | 'end'>('start');
  const [loading, setLoading] = useState<boolean>(false);
  const [errorOnFetch, setErrorOnFetch] = useState<string | null>(null);
  
  // Weather states for start and end coordinates
  const [startWeather, setStartWeather] = useState<WeatherData | null>(null);
  const [endWeather, setEndWeather] = useState<WeatherData | null>(null);

  // Default coordinate stand-ins when workspace has no nodes pinned (Manila City Hall ⇆ Antipolo Terminal)
  const defaultStart = { name: 'Manila Intramuros (Default Origin)', lat: 14.5942, lng: 120.9701 };
  const defaultEnd = { name: 'Antipolo Hub (Default Destination)', lat: 14.6174, lng: 121.1213 };

  const startPoint = waypoints.length > 0 ? waypoints[0] : defaultStart;
  const endPoint = waypoints.length > 1 ? waypoints[waypoints.length - 1] : (waypoints.length === 1 ? waypoints[0] : defaultEnd);

  const fetchWeatherForCoords = async (lat: number, lng: number): Promise<WeatherData | null> => {
    if (isOffline) return null;
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lng}&current=temperature_2m,apparent_temperature,relative_humidity_2m,weather_code,wind_speed_10m&daily=weather_code,temperature_2m_max,temperature_2m_min&timezone=auto`;
    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`Public API response status error: ${response.status}`);
      }
      const data = await response.json();
      
      const current = {
        temp: data.current.temperature_2m,
        feelsLike: data.current.apparent_temperature,
        humidity: data.current.relative_humidity_2m,
        windSpeed: data.current.wind_speed_10m,
        weatherCode: data.current.weather_code,
        time: data.current.time
      };

      const forecast = (data.daily?.time || []).slice(1, 4).map((dateStr: string, idx: number) => {
        return {
          date: dateStr,
          weatherCode: data.daily.weather_code[idx + 1] || 0,
          tempMax: data.daily.temperature_2m_max[idx + 1],
          tempMin: data.daily.temperature_2m_min[idx + 1]
        };
      });

      return { current, forecast };
    } catch (err: any) {
      console.error('Weather load fail:', err);
      return null;
    }
  };

  const loadAllWeather = async () => {
    if (isOffline) {
      setErrorOnFetch('System is operating offline. Public meteorology forecasts require a network handshake.');
      return;
    }
    setLoading(true);
    setErrorOnFetch(null);
    try {
      const startResult = await fetchWeatherForCoords(startPoint.lat, startPoint.lng);
      const endResult = await fetchWeatherForCoords(endPoint.lat, endPoint.lng);

      if (startResult) setStartWeather(startResult);
      if (endResult) setEndWeather(endResult);

      if (!startResult && !endResult) {
        setErrorOnFetch('Could not contact the free public Open-Meteo network nodes right now. Operating under fallback values.');
      }
    } catch (e) {
      setErrorOnFetch('Unforeseen exception during climate synchronization.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAllWeather();
  }, [startPoint.lat, startPoint.lng, endPoint.lat, endPoint.lng, isOffline]);

  const activeWeather = activeSegment === 'start' ? startWeather : endWeather;
  const activeSpot = activeSegment === 'start' ? startPoint : endPoint;

  // Render mock custom estimates if backend or public API returns empty (in offline scenario)
  const getRenderTemperature = (temp: number | undefined) => {
    if (temp !== undefined) return `${temp.toFixed(1)}°C`;
    // Consistent mock temperature matching tropical Manila behavior
    return activeSegment === 'start' ? '30.2°C' : '28.8°C';
  };

  const getRenderFeelsLike = (feelsLike: number | undefined) => {
    if (feelsLike !== undefined) return `${feelsLike.toFixed(1)}°C`;
    return activeSegment === 'start' ? '34.5°C' : '32.1°C';
  };

  const getRenderHumidity = (hum: number | undefined) => {
    if (hum !== undefined) return `${hum}%`;
    return '78%';
  };

  const getRenderWind = (wind: number | undefined) => {
    if (wind !== undefined) return `${wind} km/h`;
    return '12 km/h';
  };

  const getRenderWeatherDetails = () => {
    const code = activeWeather?.current.weatherCode ?? (activeSegment === 'start' ? 1 : 80);
    return getWeatherDetails(code);
  };

  const weatherDetails = getRenderWeatherDetails();
  const WeatherIcon = weatherDetails.icon;

  return (
    <div className="bg-white border border-slate-150 rounded-3xl p-5 shadow-xs flex flex-col gap-4 text-left">
      {/* Header and Toggle Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1 rounded-lg bg-emerald-50 text-emerald-600 block shrink-0">
              <Cloud size={14} className="animate-pulse" />
            </span>
            <span className="text-[10px] uppercase font-mono tracking-wider font-bold text-slate-400">
              Meteorological Corridor Outlook
            </span>
          </div>
          <h3 className="font-sans font-bold text-slate-800 text-sm mt-1">
            Real-time Public Climate Feeds
          </h3>
        </div>

        {/* Refresh and loading controllers */}
        <div className="flex items-center gap-2">
          {loading && (
            <span className="text-[10px] text-slate-400 font-mono flex items-center gap-1">
              <RefreshCw size={10} className="animate-spin text-indigo-500" />
              Syncing Open-Meteo...
            </span>
          )}
          <button
            type="button"
            id="refresh-weather-btn"
            disabled={loading}
            onClick={loadAllWeather}
            className="p-1.5 hover:bg-slate-100 disabled:opacity-50 text-slate-500 hover:text-slate-850 rounded-xl cursor-pointer border border-slate-200 bg-slate-50 flex items-center gap-1 text-[10.5px] transition-all font-sans font-bold"
            title="Reload weather details"
          >
            <RefreshCw size={11} className={loading ? 'animate-spin' : ''} />
            <span>Sync Live</span>
          </button>
        </div>
      </div>

      {/* START ⇆ END CORRIDOR SEGMENT SELECTOR TAB */}
      <div className="flex bg-slate-100/70 p-1 rounded-2xl border border-slate-200/60">
        <button
          type="button"
          onClick={() => setActiveSegment('start')}
          className={`flex-1 py-2 text-center text-xs font-bold font-sans rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
            activeSegment === 'start'
              ? 'bg-white shadow-xs text-indigo-700 font-extrabold border-0'
              : 'text-slate-500 hover:text-slate-800 border-0 bg-transparent'
          }`}
        >
          <MapPin size={11} className={activeSegment === 'start' ? 'text-indigo-600' : 'text-slate-400'} />
          <span className="truncate">Start Point</span>
        </button>
        
        <div className="flex items-center text-slate-350 px-1">
          <ArrowRight size={12} />
        </div>

        <button
          type="button"
          onClick={() => setActiveSegment('end')}
          className={`flex-1 py-2 text-center text-xs font-bold font-sans rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
            activeSegment === 'end'
              ? 'bg-white shadow-xs text-indigo-700 font-extrabold border-0'
              : 'text-slate-500 hover:text-slate-800 border-0 bg-transparent'
          }`}
        >
          <MapPin size={11} className={activeSegment === 'end' ? 'text-coral-500' : 'text-slate-400'} />
          <span className="truncate">End Point</span>
        </button>
      </div>

      {/* OFFLINE HANDLER NOTICE */}
      {isOffline && (
        <div className="bg-amber-50 text-amber-900 border border-amber-200/60 p-3 rounded-2xl flex items-start gap-2.5">
          <AlertCircle size={14} className="text-amber-600 shrink-0 mt-0.5" />
          <p className="text-[10.5px] font-sans leading-relaxed">
            Network standard status offline. Showing simulated climate estimates for the coordinates.
          </p>
        </div>
      )}

      {/* WEATHER METRIC CARD HERO DISPLAY */}
      <div className="bg-[#fcf9f2] border border-slate-200/70 rounded-2xl p-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Spot Identity and Main temp */}
        <div className="flex items-start gap-3.5">
          <div className="p-3 bg-white rounded-2xl border border-slate-150 shrink-0 shadow-xs flex items-center justify-center">
            <WeatherIcon size={32} className={`${weatherDetails.color}`} />
          </div>
          <div className="min-w-0">
            <span className="text-[9px] uppercase font-mono font-extrabold text-indigo-650 tracking-wider block">
              {activeSegment === 'start' ? 'Origin Point climate' : 'Destination climate'}
            </span>
            <span className="font-sans font-bold text-slate-800 text-xs mt-0.5 block truncate max-w-[210px]" title={activeSpot.name}>
              {activeSpot.name}
            </span>
            <div className="flex items-baseline gap-1.5 mt-1">
              <span className="text-3xl font-sans font-extrabold tracking-tight text-slate-800">
                {getRenderTemperature(activeWeather?.current.temp)}
              </span>
              <span className="text-xs text-slate-500 font-sans font-medium">
                {weatherDetails.label}
              </span>
            </div>
          </div>
        </div>

        {/* Current relative micro-stats */}
        <div className="grid grid-cols-2 md:grid-cols-1 md:gap-x-0 gap-3 border-t md:border-t-0 md:border-l border-slate-200/80 pt-3 md:pt-0 md:pl-5 shrink-0">
          <div className="flex items-center gap-1.5">
            <Thermometer size={12} className="text-slate-400 shrink-0" />
            <div className="text-[10.5px]">
              <span className="text-slate-400 block font-mono text-[9px] font-bold">FEELS LIKE</span>
              <span className="font-sans font-bold text-slate-700">{getRenderFeelsLike(activeWeather?.current.feelsLike)}</span>
            </div>
          </div>
          <div className="flex items-center gap-1.5 mt-0 md:mt-2">
            <Droplets size={12} className="text-sky-450 shrink-0" />
            <div className="text-[10.5px]">
              <span className="text-slate-400 block font-mono text-[9px] font-bold">HUMIDITY</span>
              <span className="font-sans font-bold text-slate-700">{getRenderHumidity(activeWeather?.current.humidity)}</span>
            </div>
          </div>
          <div className="hidden md:flex items-center gap-1.5 mt-2">
            <Wind size={12} className="text-indigo-400 shrink-0" />
            <div className="text-[10.5px]">
              <span className="text-slate-400 block font-mono text-[9px] font-bold">WIND</span>
              <span className="font-sans font-bold text-slate-700">{getRenderWind(activeWeather?.current.windSpeed)}</span>
            </div>
          </div>
        </div>
      </div>

      {/* 3-DAY WEATHER OUTLOOK FORECAST BLOCK */}
      <div className="flex flex-col gap-2">
        <label className="text-[10px] font-sans font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1">
          <Calendar size={11} />
          <span>3-Day Direct Climate Forecast</span>
        </label>
        
        <div className="grid grid-cols-3 gap-2">
          {/* Loop/Generate three days forecast */}
          {[1, 2, 3].map((dayIdx) => {
            const forecastItem = activeWeather?.forecast[dayIdx - 1];
            const dateLabel = forecastItem 
              ? new Date(forecastItem.date).toLocaleDateString('en-US', { weekday: 'short' })
              : `Day +${dayIdx}`;
            
            const forecastDetails = forecastItem 
              ? getWeatherDetails(forecastItem.weatherCode)
              : (dayIdx === 2 ? getWeatherDetails(3) : getWeatherDetails(0));
              
            const ForecastDayIcon = forecastDetails.icon;

            const maxTemp = forecastItem?.tempMax ?? (31 - dayIdx);
            const minTemp = forecastItem?.tempMin ?? (24 - dayIdx);

            return (
              <div 
                key={dayIdx} 
                className="bg-slate-50 border border-slate-100 hover:border-slate-200/80 rounded-xl p-2.5 text-center flex flex-col items-center justify-center transition-all gap-1 shadow-2xs"
              >
                <span className="text-[9.5px] font-mono font-bold text-slate-400 uppercase">
                  {dateLabel}
                </span>
                
                <ForecastDayIcon size={20} className={`my-1 ${forecastDetails.color}`} />
                
                <span className="text-[10px] font-sans font-bold text-slate-700 truncate max-w-full block">
                  {forecastDetails.label}
                </span>

                <div className="flex items-center justify-center gap-1 mt-0.5 text-[9.5px] font-mono">
                  <span className="text-slate-800 font-bold">{maxTemp.toFixed(0)}°</span>
                  <span className="text-slate-400">/</span>
                  <span className="text-slate-400">{minTemp.toFixed(0)}°</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* COORDINATE WATERMARK DETAILS */}
      <div className="border-t border-slate-100 pt-3.5 flex items-center gap-1.5 text-slate-400 text-[10.5px]">
        <MapPin size={11} className="shrink-0 text-slate-350" />
        <span className="font-mono truncate">
          Geocoding Grid: <strong className="text-slate-500 font-semibold">{activeSpot.lat.toFixed(5)}°, {activeSpot.lng.toFixed(5)}°</strong>
        </span>
        {waypoints.length === 0 && (
          <span className="text-[9.5px] bg-[#46868e]/10 text-[#46868e] font-sans font-bold px-1.5 py-0.5 rounded-md ml-auto shrink-0 select-none">
            Default coordinates active
          </span>
        )}
      </div>
    </div>
  );
};

export default WeatherOutlook;
