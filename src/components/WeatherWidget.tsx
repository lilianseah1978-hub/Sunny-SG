import { useState } from 'react';
import { CloudRain, Sun, Zap, Droplets, Thermometer, Wind, AlertTriangle, Sparkles, Navigation, Activity, ChevronDown, ChevronUp, Radio } from 'lucide-react';
import { WeatherCondition } from '../types';

interface WeatherWidgetProps {
  weather: WeatherCondition | null;
  selectedScenario: string;
  onSelectScenario: (scenario: string) => void;
  onInstantReroute: () => void;
}

export function WeatherWidget({
  weather,
  selectedScenario,
  onSelectScenario,
  onInstantReroute
}: WeatherWidgetProps) {
  const [selectedArea, setSelectedArea] = useState<string>('Marina Bay');
  const [showV2Feeds, setShowV2Feeds] = useState<boolean>(false);
  const [feedData, setFeedData] = useState<any>(null);
  const [activeFeedTab, setActiveFeedTab] = useState<string>('two-hr');
  const [isFeedLoading, setIsFeedLoading] = useState<boolean>(false);

  const areas = ['Marina Bay', 'Sentosa', 'Civic District', 'Orchard', 'Mandai', 'Changi'];

  const isRain = selectedScenario === 'afternoon-rain' || selectedScenario === 'all-day-rain' || (weather?.rainRisk === 'heavy');
  const isHighHeat = selectedScenario === 'extreme-heat' || ((weather?.temperature || 31) >= 33);

  const fetchSpecificFeed = async (feedType: string) => {
    setActiveFeedTab(feedType);
    setIsFeedLoading(true);
    let endpoint = '/api/weather/two-hr-forecast';
    if (feedType === '24hr') endpoint = '/api/weather/twenty-four-hr-forecast';
    if (feedType === 'temp') endpoint = '/api/weather/air-temperature';
    if (feedType === 'rainfall') endpoint = '/api/weather/rainfall';
    if (feedType === 'psi') endpoint = '/api/weather/psi';
    if (feedType === 'uv') endpoint = '/api/weather/uv';

    try {
      const resp = await fetch(endpoint);
      if (resp.ok) {
        const json = await resp.json();
        setFeedData(json);
      }
    } catch (err) {
      console.error('Error fetching v2 feed:', err);
    } finally {
      setIsFeedLoading(false);
    }
  };

  const handleToggleV2Feeds = () => {
    const nextState = !showV2Feeds;
    setShowV2Feeds(nextState);
    if (nextState && !feedData) {
      fetchSpecificFeed('two-hr');
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 p-4 sm:p-5 shadow-xs mb-6">
      {/* Weather Header & Simulator Switcher */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 pb-3.5 border-b border-slate-100">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Thermometer className="w-4 h-4 text-amber-500" />
              Live Singapore Weather & Microclimate Radar
            </h2>
            <span className="bg-emerald-50 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded-full border border-emerald-200 flex items-center gap-1">
              <Radio className="w-2.5 h-2.5 text-emerald-600 animate-pulse" /> Data.gov.sg v2 Live
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Real-time 2-hr nowcast, 24-hr outlook, station temperatures, rain gauges, PSI & UV index.
          </p>
        </div>

        {/* Weather Scenarios */}
        <div className="flex flex-wrap items-center gap-1 bg-slate-50 p-1 rounded-xl border border-slate-200/60">
          <span className="text-[10px] font-semibold text-slate-500 px-1.5 py-0.5 flex items-center gap-1">
            <Sparkles className="w-3 h-3 text-amber-500" /> Scenario:
          </span>
          <button
            onClick={() => onSelectScenario('sunny')}
            className={`text-xs font-semibold px-2.5 py-1 rounded-lg transition-all flex items-center gap-1 ${
              selectedScenario === 'sunny'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <Sun className="w-3 h-3 text-amber-400" /> Sunny
          </button>

          <button
            onClick={() => onSelectScenario('afternoon-rain')}
            className={`text-xs font-semibold px-2.5 py-1 rounded-lg transition-all flex items-center gap-1 ${
              selectedScenario === 'afternoon-rain'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <CloudRain className="w-3 h-3 text-sky-400" /> Afternoon Rain
          </button>

          <button
            onClick={() => onSelectScenario('extreme-heat')}
            className={`text-xs font-semibold px-2.5 py-1 rounded-lg transition-all flex items-center gap-1 ${
              selectedScenario === 'extreme-heat'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <Thermometer className="w-3 h-3 text-orange-400" /> High Heat
          </button>

          <button
            onClick={() => onSelectScenario('all-day-rain')}
            className={`text-xs font-semibold px-2.5 py-1 rounded-lg transition-all flex items-center gap-1 ${
              selectedScenario === 'all-day-rain'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <Zap className="w-3 h-3 text-indigo-400" /> Thunderstorm
          </button>
        </div>
      </div>

      {/* District Selector & Real-Time Metric Strip */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-3.5 items-center">
        {/* District Tabs */}
        <div className="md:col-span-1 border-r border-slate-100 pr-0 md:pr-4">
          <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
            Singapore District
          </label>
          <div className="grid grid-cols-2 md:grid-cols-1 gap-1">
            {areas.map(area => (
              <button
                key={area}
                onClick={() => setSelectedArea(area)}
                className={`text-left text-xs font-medium px-2 py-1 rounded-lg transition-all flex items-center justify-between ${
                  selectedArea === area
                    ? 'bg-slate-100 text-slate-900 font-bold border-l-2 border-amber-500'
                    : 'text-slate-600 hover:bg-slate-50'
                }`}
              >
                <span>{area}</span>
                <span className="text-[10px] text-slate-400">
                  {selectedScenario === 'afternoon-rain' && (area === 'Marina Bay' || area === 'Mandai')
                    ? '🌧️ Rain'
                    : selectedScenario === 'extreme-heat'
                    ? '☀️ 34°C'
                    : '🌤️ 31°C'}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Live Metrics Grid */}
        <div className="md:col-span-3 grid grid-cols-2 sm:grid-cols-4 gap-2.5">
          {/* Temperature */}
          <div className="bg-slate-50/80 border border-slate-200/70 p-3 rounded-xl">
            <span className="text-[10px] font-medium text-slate-500 flex items-center gap-1">
              <Thermometer className="w-3 h-3 text-amber-500" /> Air Temp
            </span>
            <div className="text-lg font-bold text-slate-900 mt-0.5">
              {selectedScenario === 'extreme-heat' ? '34.4°C' : `${weather?.temperature || 31.2}°C`}
            </div>
            <span className="text-[10px] text-slate-500">
              {weather?.tempRange24Hr ? `24h: ${weather.tempRange24Hr.low}° - ${weather.tempRange24Hr.high}°C` : (isHighHeat ? '🔥 High Heat Warning' : 'Tropical Warmth')}
            </span>
          </div>

          {/* Rain Status */}
          <div className={`p-3 rounded-xl border ${
            isRain
              ? 'bg-sky-50/70 border-sky-200 text-sky-900'
              : 'bg-slate-50/80 border-slate-200/70 text-slate-900'
          }`}>
            <span className="text-[10px] font-medium text-slate-500 flex items-center gap-1">
              <CloudRain className="w-3 h-3 text-sky-500" /> Rainfall Gauges
            </span>
            <div className="text-lg font-bold mt-0.5">
              {isRain ? '3.8 mm' : `${weather?.rainfallMm || 0.0} mm`}
            </div>
            <span className={`text-[10px] font-medium ${isRain ? 'text-sky-700 font-semibold' : 'text-slate-500'}`}>
              {isRain ? '⚠️ Active Downpour' : 'Dry / Clear Roads'}
            </span>
          </div>

          {/* Humidity & UV Index */}
          <div className="bg-slate-50/80 border border-slate-200/70 p-3 rounded-xl">
            <span className="text-[10px] font-medium text-slate-500 flex items-center gap-1">
              <Droplets className="w-3 h-3 text-blue-500" /> Humidity & UV
            </span>
            <div className="text-lg font-bold text-slate-900 mt-0.5">
              {isRain ? '89%' : `${weather?.relativeHumidity || 73}%`} <span className="text-xs font-normal text-slate-400">/ UV {isRain ? '3' : (weather?.uvIndex || 7)}</span>
            </div>
            <span className="text-[10px] text-slate-500">
              {isHighHeat ? 'UV Alert: Sunscreen' : (weather?.uvIndex && weather.uvIndex > 7 ? 'High UV Radiation' : 'Normal Tropical')}
            </span>
          </div>

          {/* Air Quality (PSI) */}
          <div className="bg-slate-50/80 border border-slate-200/70 p-3 rounded-xl">
            <span className="text-[10px] font-medium text-slate-500 flex items-center gap-1">
              <Wind className="w-3 h-3 text-emerald-500" /> PSI / PM2.5
            </span>
            <div className="text-lg font-bold text-emerald-700 mt-0.5">
              {weather?.psi || 42} <span className="text-xs font-semibold text-emerald-600">Good</span>
            </div>
            <span className="text-[10px] text-slate-500">
              PM2.5: {weather?.pm25 || 11} µg/m³ (Safe)
            </span>
          </div>
        </div>
      </div>

      {/* Dynamic "Right Now In Singapore" Advice Banner */}
      <div className={`mt-3.5 p-3 rounded-xl border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 ${
        isRain
          ? 'bg-sky-50/60 border-sky-200 text-sky-950'
          : isHighHeat
          ? 'bg-amber-50/60 border-amber-200 text-amber-950'
          : 'bg-slate-50 border-slate-200 text-slate-900'
      }`}>
        <div className="flex items-start gap-2.5">
          <div className={`p-1.5 rounded-lg shrink-0 ${
            isRain ? 'bg-sky-600 text-white' : isHighHeat ? 'bg-amber-500 text-white' : 'bg-slate-900 text-white'
          }`}>
            {isRain ? <CloudRain className="w-4 h-4" /> : isHighHeat ? <AlertTriangle className="w-4 h-4" /> : <Navigation className="w-4 h-4 text-amber-400" />}
          </div>
          <div>
            <div className="text-xs font-bold tracking-tight">
              {isRain
                ? 'Rain Alert Active: Dynamic Indoor Protection Triggered'
                : isHighHeat
                ? 'Midday Heat Caution: Air-Conditioned Route Recommended'
                : `Current Singapore Conditions: ${weather?.general24HrForecast || 'Optimal For Exploration'}`}
            </div>
            <p className="text-xs text-slate-600 mt-0.5">
              {isRain
                ? 'Rain detected around central Singapore. We recommend sheltering at Flower Dome & Cloud Forest, Jewel Changi, ArtScience Museum, or National Gallery via underground MRT.'
                : isHighHeat
                ? 'Peak UV & temperature. Explore outdoor gardens before 11:30 AM, then stay cool inside the Marina Bay Sands mall or S.E.A. Aquarium.'
                : `24-hr outlook: ${weather?.general24HrForecast || 'Partly cloudy with pleasant coastal breeze'}. Ideal conditions for Gardens by the Bay, Marina Bay SkyPark, and Botanic Gardens.`}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto shrink-0">
          <button
            onClick={handleToggleV2Feeds}
            className="text-[11px] font-semibold text-slate-700 bg-white hover:bg-slate-100 border border-slate-200 px-2.5 py-1.5 rounded-lg transition-colors flex items-center gap-1"
          >
            <Activity className="w-3.5 h-3.5 text-amber-600" />
            <span>Gov v2 Feeds</span>
            {showV2Feeds ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
          </button>

          {isRain && (
            <button
              onClick={onInstantReroute}
              className="w-full sm:w-auto shrink-0 bg-sky-600 hover:bg-sky-700 text-white text-xs font-semibold px-3 py-1.5 rounded-lg shadow-xs transition-colors flex items-center justify-center gap-1.5"
            >
              <Sparkles className="w-3.5 h-3.5" /> Apply Rain Reroute
            </button>
          )}
        </div>
      </div>

      {/* Live Data.gov.sg v2 Environmental Feeds Inspector */}
      {showV2Feeds && (
        <div className="mt-3.5 pt-3.5 border-t border-slate-100 text-xs">
          <div className="flex flex-wrap items-center justify-between gap-2 mb-2.5">
            <span className="font-bold text-slate-900 text-xs flex items-center gap-1.5">
              <Radio className="w-3.5 h-3.5 text-emerald-600" /> Live Data.gov.sg (v2) Raw Feeds
            </span>
            <div className="flex flex-wrap gap-1">
              {[
                { id: 'two-hr', label: '2-Hr Forecast' },
                { id: '24hr', label: '24-Hr Outlook' },
                { id: 'temp', label: 'Air Temp' },
                { id: 'rainfall', label: 'Rainfall' },
                { id: 'psi', label: 'PSI & PM2.5' },
                { id: 'uv', label: 'UV Index' },
              ].map(f => (
                <button
                  key={f.id}
                  onClick={() => fetchSpecificFeed(f.id)}
                  className={`text-[11px] font-semibold px-2 py-0.5 rounded-md transition-colors ${
                    activeFeedTab === f.id
                      ? 'bg-slate-900 text-white'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </div>
          </div>

          <div className="bg-slate-900 text-slate-200 p-3 rounded-xl font-mono text-[11px] max-h-48 overflow-y-auto border border-slate-800">
            {isFeedLoading ? (
              <div className="text-slate-400 py-2">Loading live feed from Data.gov.sg v2 host...</div>
            ) : feedData ? (
              <pre>{JSON.stringify(feedData, null, 2)}</pre>
            ) : (
              <div className="text-slate-400 py-2">Select a feed tab above to view live payload.</div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
