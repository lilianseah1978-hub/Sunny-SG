import { useState, useEffect } from 'react';
import { Compass, MapPin, Ticket, Bus, Bot, CloudSun, ShieldCheck, Clock, RefreshCw, Crown, Sparkles } from 'lucide-react';
import { WeatherCondition, SubscriptionTier } from '../types';

interface NavbarProps {
  activeTab: 'planner' | 'map' | 'tickets' | 'transit' | 'concierge';
  setActiveTab: (tab: 'planner' | 'map' | 'tickets' | 'transit' | 'concierge') => void;
  weather: WeatherCondition | null;
  onRefreshWeather: () => void;
  isWeatherLoading: boolean;
  subscriptionTier: SubscriptionTier;
  onOpenSubscriptionModal: () => void;
}

export function Navbar({
  activeTab,
  setActiveTab,
  weather,
  onRefreshWeather,
  isWeatherLoading,
  subscriptionTier,
  onOpenSubscriptionModal
}: NavbarProps) {
  const [sgtTime, setSgtTime] = useState<string>('');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const formatted = new Intl.DateTimeFormat('en-SG', {
        timeZone: 'Asia/Singapore',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: true
      }).format(now);
      setSgtTime(formatted);
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur border-b border-slate-200 shadow-xs">
      {/* Top Banner: Real-Time SGT & Weather Stats */}
      <div className="bg-slate-900 text-slate-200 text-xs py-1.5 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center space-x-4">
            <span className="flex items-center gap-1.5 font-medium text-amber-400">
              <Clock className="w-3.5 h-3.5" />
              Singapore Local Time: <span className="font-mono text-white">{sgtTime || '14:30:00 SGT'}</span>
            </span>
            <span className="hidden sm:inline-block text-slate-600">|</span>
            <span className="hidden sm:flex items-center gap-1.5 text-emerald-400">
              <ShieldCheck className="w-3.5 h-3.5" />
              LTA & MRT Network: <span className="text-white">Normal Frequency (2-3m)</span>
            </span>
          </div>

          <div className="flex items-center gap-3">
            {weather && (
              <div className="flex items-center gap-2 text-slate-300">
                <span className="text-amber-400 font-semibold">{weather.temperature}°C</span>
                <span className="hidden md:inline text-slate-400">({weather.forecast})</span>
                <span className="hidden lg:inline bg-slate-800 text-slate-300 px-1.5 py-0.5 rounded text-[11px]">
                  PSI: {weather.psi} (Good)
                </span>
                <button
                  onClick={onRefreshWeather}
                  title="Refresh Live Weather"
                  className="hover:text-white transition-colors p-0.5"
                  disabled={isWeatherLoading}
                >
                  <RefreshCw className={`w-3 h-3 ${isWeatherLoading ? 'animate-spin text-amber-400' : ''}`} />
                </button>
              </div>
            )}
            <button
              onClick={onOpenSubscriptionModal}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold border transition-all ${
                subscriptionTier === 'tourist-pass'
                  ? 'bg-amber-500 text-slate-900 border-amber-400 shadow-xs'
                  : subscriptionTier === 'resident-pro'
                  ? 'bg-emerald-500 text-slate-900 border-emerald-400 shadow-xs'
                  : 'bg-slate-800 hover:bg-slate-700 text-amber-300 border-amber-500/30'
              }`}
            >
              <Crown className="w-3.5 h-3.5" />
              <span>
                {subscriptionTier === 'tourist-pass'
                  ? 'Tourist Pass+'
                  : subscriptionTier === 'resident-pro'
                  ? 'Resident VIP'
                  : 'Pass & Plans'}
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Header & Nav Tabs */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Slogan */}
          <div
            className="flex items-center gap-3 cursor-pointer group"
            onClick={() => setActiveTab('planner')}
          >
            <div className="w-9 h-9 rounded-xl bg-slate-900 flex items-center justify-center text-amber-400 border border-slate-800 shadow-xs group-hover:scale-102 transition-transform">
              <CloudSun className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-lg font-bold tracking-tight text-slate-900">
                  Sunny<span className="text-amber-600">SG</span>
                </span>
                <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded border ${
                  subscriptionTier !== 'free'
                    ? 'bg-amber-100 text-amber-800 border-amber-300'
                    : 'bg-slate-100 text-slate-700 border-slate-200'
                }`}>
                  {subscriptionTier === 'tourist-pass' ? 'Tourist Pass+' : subscriptionTier === 'resident-pro' ? 'Resident VIP' : 'Live Planner'}
                </span>
              </div>
              <p className="text-xs text-slate-500 font-normal hidden sm:block">
                Weather & Public Transit Smart Itinerary
              </p>
            </div>
          </div>

          {/* Nav Controls */}
          <nav className="flex items-center gap-1 sm:gap-1.5">
            <button
              id="nav-planner"
              onClick={() => setActiveTab('planner')}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold transition-all ${
                activeTab === 'planner'
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <Compass className={`w-3.5 h-3.5 ${activeTab === 'planner' ? 'text-amber-400' : 'text-slate-500'}`} />
              <span>Itinerary</span>
            </button>

            <button
              id="nav-tickets"
              onClick={() => setActiveTab('tickets')}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold transition-all ${
                activeTab === 'tickets'
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <Ticket className={`w-3.5 h-3.5 ${activeTab === 'tickets' ? 'text-rose-400' : 'text-slate-500'}`} />
              <span>Attractions</span>
            </button>

            <button
              id="nav-map"
              onClick={() => setActiveTab('map')}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold transition-all ${
                activeTab === 'map'
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <MapPin className={`w-3.5 h-3.5 ${activeTab === 'map' ? 'text-sky-400' : 'text-slate-500'}`} />
              <span>Map & Radar</span>
            </button>

            <button
              id="nav-transit"
              onClick={() => setActiveTab('transit')}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold transition-all ${
                activeTab === 'transit'
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <Bus className={`w-3.5 h-3.5 ${activeTab === 'transit' ? 'text-emerald-400' : 'text-slate-500'}`} />
              <span>Transit</span>
            </button>

            <button
              id="nav-concierge"
              onClick={() => setActiveTab('concierge')}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold transition-all ${
                activeTab === 'concierge'
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <Bot className={`w-3.5 h-3.5 ${activeTab === 'concierge' ? 'text-purple-400' : 'text-slate-500'}`} />
              <span className="hidden md:inline">AI Concierge</span>
            </button>

            <button
              id="nav-plans-cta"
              onClick={onOpenSubscriptionModal}
              className={`ml-1 flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold transition-all shadow-xs ${
                subscriptionTier !== 'free'
                  ? 'bg-amber-50 text-amber-900 border border-amber-300 hover:bg-amber-100'
                  : 'bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white'
              }`}
            >
              <Crown className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">
                {subscriptionTier !== 'free' ? 'Pass Benefits' : 'Pass & Plans'}
              </span>
            </button>
          </nav>
        </div>
      </div>
    </header>
  );
}
