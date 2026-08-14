import { useState, useEffect, FormEvent } from 'react';
import { 
  Bus, 
  Train, 
  Search, 
  Clock, 
  Users, 
  Accessibility, 
  ShieldCheck, 
  Navigation, 
  ArrowRight, 
  AlertCircle,
  RefreshCw,
  Zap,
  Footprints,
  MapPin,
  Compass,
  Car,
  Bike,
  CheckCircle2,
  ExternalLink,
  Layers,
  Key
} from 'lucide-react';
import { BusArrivalInfo, TrainAlert, RouteOption } from '../types';
import { POPULAR_BUS_STOPS, MRT_LINES, ATTRACTIONS_DATA } from '../data/singaporeData';

interface OneMapSearchResult {
  SEARCHVAL: string;
  BLK_NO: string;
  ROAD_NAME: string;
  BUILDING: string;
  ADDRESS: string;
  POSTAL: string;
  X: string;
  Y: string;
  LATITUDE: string;
  LONGITUDE: string;
}

export function TransitTracker() {
  const [activeSubTab, setActiveSubTab] = useState<'bus' | 'mrt' | 'router' | 'onemap'>('bus');
  const [selectedBusStop, setSelectedBusStop] = useState<string>('03071');
  const [customStopCode, setCustomStopCode] = useState<string>('');
  const [busData, setBusData] = useState<BusArrivalInfo | null>(null);
  const [isBusLoading, setIsBusLoading] = useState<boolean>(false);
  const [trainStatus, setTrainStatus] = useState<TrainAlert[]>([]);
  
  // Router state
  const [originId, setOriginId] = useState<string>('gardens-by-the-bay');
  const [destinationId, setDestinationId] = useState<string>('chinatown-heritage');
  const [routeResult, setRouteResult] = useState<RouteOption | null>(null);
  const [isRouteLoading, setIsRouteLoading] = useState<boolean>(false);

  // OneMap Interactive State
  const [oneMapSearchVal, setOneMapSearchVal] = useState<string>('raffles place');
  const [oneMapSearchResults, setOneMapSearchResults] = useState<OneMapSearchResult[]>([]);
  const [isOneMapSearching, setIsOneMapSearching] = useState<boolean>(false);
  
  // OneMap Reverse Geocode State
  const [revGeoLocation, setRevGeoLocation] = useState<string>('1.2838,103.8591');
  const [revGeoResult, setRevGeoResult] = useState<any>(null);
  const [isRevGeoLoading, setIsRevGeoLoading] = useState<boolean>(false);

  // OneMap Direct Routing State
  const [omStart, setOmStart] = useState<string>('1.2816,103.8636'); // Gardens by the Bay
  const [omEnd, setOmEnd] = useState<string>('1.2847,103.8432'); // Chinatown
  const [omRouteType, setOmRouteType] = useState<'walk' | 'drive' | 'cycle' | 'pt'>('walk');
  const [omRouteResult, setOmRouteResult] = useState<any>(null);
  const [isOmRouteLoading, setIsOmRouteLoading] = useState<boolean>(false);

  // OneMap Token Status
  const [tokenStatus, setTokenStatus] = useState<{ token?: string; expiresAt?: string; status?: string } | null>(null);
  const [isTokenLoading, setIsTokenLoading] = useState<boolean>(false);

  // Fetch bus arrival times
  const fetchBusArrivals = async (stopCode: string) => {
    setIsBusLoading(true);
    try {
      const resp = await fetch(`/api/transit/bus?busStopCode=${stopCode}`);
      if (resp.ok) {
        const json = await resp.json();
        setBusData(json);
      }
    } catch (err) {
      console.error('Failed to fetch bus arrivals:', err);
    } finally {
      setIsBusLoading(false);
    }
  };

  // Fetch MRT status
  const fetchMrtStatus = async () => {
    try {
      const resp = await fetch('/api/transit/trains');
      if (resp.ok) {
        const json = await resp.json();
        setTrainStatus(json.alerts || []);
      }
    } catch (err) {
      console.error('Failed to fetch MRT status:', err);
    }
  };

  // Plan transit route
  const handlePlanRoute = async () => {
    setIsRouteLoading(true);
    try {
      const resp = await fetch('/api/route', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ originId, destinationId })
      });
      if (resp.ok) {
        const json = await resp.json();
        setRouteResult(json);
      }
    } catch (err) {
      console.error('Route calculation error:', err);
    } finally {
      setIsRouteLoading(false);
    }
  };

  // OneMap Actions
  const fetchOneMapTokenStatus = async () => {
    setIsTokenLoading(true);
    try {
      const resp = await fetch('/api/onemap/token', { method: 'POST' });
      if (resp.ok) {
        const json = await resp.json();
        setTokenStatus(json);
      }
    } catch (err) {
      console.error('OneMap token check error:', err);
    } finally {
      setIsTokenLoading(false);
    }
  };

  const handleOneMapSearch = async (e?: FormEvent) => {
    if (e) e.preventDefault();
    if (!oneMapSearchVal.trim()) return;
    setIsOneMapSearching(true);
    try {
      const resp = await fetch(`/api/onemap/search?searchVal=${encodeURIComponent(oneMapSearchVal.trim())}&returnGeom=Y&getAddrDetails=Y&pageNum=1`);
      if (resp.ok) {
        const json = await resp.json();
        setOneMapSearchResults(json.results || []);
      }
    } catch (err) {
      console.error('OneMap search error:', err);
    } finally {
      setIsOneMapSearching(false);
    }
  };

  const handleOneMapRevGeocode = async (e?: FormEvent) => {
    if (e) e.preventDefault();
    setIsRevGeoLoading(true);
    try {
      const resp = await fetch(`/api/onemap/revgeocode?location=${encodeURIComponent(revGeoLocation)}&buffer=40&addressType=All`);
      if (resp.ok) {
        const json = await resp.json();
        setRevGeoResult(json);
      }
    } catch (err) {
      console.error('OneMap revgeocode error:', err);
    } finally {
      setIsRevGeoLoading(false);
    }
  };

  const handleOneMapRoute = async (e?: FormEvent) => {
    if (e) e.preventDefault();
    setIsOmRouteLoading(true);
    try {
      const resp = await fetch(`/api/onemap/route?start=${encodeURIComponent(omStart)}&end=${encodeURIComponent(omEnd)}&routeType=${omRouteType}`);
      if (resp.ok) {
        const json = await resp.json();
        setOmRouteResult(json);
      }
    } catch (err) {
      console.error('OneMap routing error:', err);
    } finally {
      setIsOmRouteLoading(false);
    }
  };

  useEffect(() => {
    fetchBusArrivals(selectedBusStop);
    fetchMrtStatus();
    handlePlanRoute();
    fetchOneMapTokenStatus();
  }, []);

  const handleSelectPresetStop = (code: string) => {
    setSelectedBusStop(code);
    fetchBusArrivals(code);
  };

  const handleSearchCustomStop = (e: FormEvent) => {
    e.preventDefault();
    if (customStopCode.trim()) {
      setSelectedBusStop(customStopCode.trim());
      fetchBusArrivals(customStopCode.trim());
    }
  };

  return (
    <div className="space-y-6">
      {/* Sub navigation bar */}
      <div className="bg-white rounded-2xl border border-slate-200/90 p-1.5 shadow-xs flex items-center gap-1.5">
        <button
          onClick={() => setActiveSubTab('bus')}
          className={`flex-1 text-xs font-semibold py-2 px-3 rounded-xl transition-all flex items-center justify-center gap-1.5 ${
            activeSubTab === 'bus'
              ? 'bg-slate-900 text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
          }`}
        >
          <Bus className="w-3.5 h-3.5" />
          <span>Next Bus Arrivals (LTA)</span>
        </button>

        <button
          onClick={() => setActiveSubTab('mrt')}
          className={`flex-1 text-xs font-semibold py-2 px-3 rounded-xl transition-all flex items-center justify-center gap-1.5 ${
            activeSubTab === 'mrt'
              ? 'bg-slate-900 text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
          }`}
        >
          <Train className="w-3.5 h-3.5" />
          <span>MRT Network Status</span>
        </button>

        <button
          onClick={() => setActiveSubTab('router')}
          className={`flex-1 text-xs font-semibold py-2 px-3 rounded-xl transition-all flex items-center justify-center gap-1.5 ${
            activeSubTab === 'router'
              ? 'bg-slate-900 text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
          }`}
        >
          <Navigation className="w-3.5 h-3.5" />
          <span>Transit & Shelter Router</span>
        </button>

        <button
          onClick={() => setActiveSubTab('onemap')}
          className={`flex-1 text-xs font-semibold py-2 px-3 rounded-xl transition-all flex items-center justify-center gap-1.5 ${
            activeSubTab === 'onemap'
              ? 'bg-amber-600 text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
          }`}
        >
          <Layers className="w-3.5 h-3.5" />
          <span>OneMap SG (Gov API)</span>
        </button>
      </div>

      {/* 1. BUS ARRIVAL VIEW */}
      {activeSubTab === 'bus' && (
        <div className="space-y-5">
          {/* Quick Select & Search Form */}
          <div className="bg-white rounded-2xl border border-slate-200/90 p-4 sm:p-5 shadow-xs">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pb-3.5 border-b border-slate-100">
              <div>
                <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <Bus className="w-4 h-4 text-slate-900" />
                  Live Bus Arrivals
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Real-time GPS tracking, passenger load, and double-decker availability.
                </p>
              </div>

              {/* Stop Code Search */}
              <form onSubmit={handleSearchCustomStop} className="flex gap-2">
                <input
                  type="text"
                  placeholder="Enter Stop Code (e.g. 03223)"
                  value={customStopCode}
                  onChange={(e) => setCustomStopCode(e.target.value)}
                  className="bg-slate-50 border border-slate-200 text-xs font-medium rounded-xl px-3 py-1.5 text-slate-900 focus:bg-white focus:outline-none focus:ring-1 focus:ring-slate-900 focus:border-slate-900 w-44"
                />
                <button
                  type="submit"
                  className="bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs px-3 py-1.5 rounded-xl transition-colors shadow-xs"
                >
                  <Search className="w-3.5 h-3.5" />
                </button>
              </form>
            </div>

            {/* Tourist Hub Quick Presets */}
            <div className="mt-3.5">
              <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-2">
                Popular Bus Stops
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {POPULAR_BUS_STOPS.map((stop) => (
                  <button
                    key={stop.code}
                    onClick={() => handleSelectPresetStop(stop.code)}
                    className={`text-left p-2.5 rounded-xl border text-xs transition-all ${
                      selectedBusStop === stop.code
                        ? 'bg-slate-900 border-slate-900 text-white font-medium shadow-xs'
                        : 'bg-slate-50 hover:bg-slate-100 border-slate-200/80 text-slate-700 font-normal'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className={`font-mono text-[10px] font-bold ${selectedBusStop === stop.code ? 'text-amber-400' : 'text-slate-500'}`}>#{stop.code}</span>
                      <span className={`text-[10px] ${selectedBusStop === stop.code ? 'text-slate-300' : 'text-slate-400'}`}>{stop.services.length} lines</span>
                    </div>
                    <div className="font-semibold truncate mt-1 text-xs">{stop.name}</div>
                    <div className={`text-[10px] truncate ${selectedBusStop === stop.code ? 'text-slate-300' : 'text-slate-500'}`}>{stop.landmark}</div>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Bus Arrivals Live Board */}
          <div className="bg-white rounded-2xl border border-slate-200/90 p-4 sm:p-5 shadow-xs">
            <div className="flex items-center justify-between pb-3.5 border-b border-slate-100 mb-4">
              <div>
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                  Active Bus Stop: #{busData?.busStopCode || selectedBusStop}
                </span>
                <h4 className="text-base font-bold text-slate-900 mt-0.5">
                  {busData?.description || 'Bayfront Stn / Marina Bay Sands'}
                </h4>
                <p className="text-xs text-slate-500">
                  {busData?.roadName || 'Bayfront Ave'} • Real-time DataMall feed
                </p>
              </div>

              <button
                onClick={() => fetchBusArrivals(selectedBusStop)}
                disabled={isBusLoading}
                className="text-xs font-semibold text-slate-700 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 px-3 py-1.5 rounded-xl transition-colors flex items-center gap-1.5"
              >
                <RefreshCw className={`w-3 h-3 ${isBusLoading ? 'animate-spin text-slate-900' : ''}`} />
                <span>Refresh</span>
              </button>
            </div>

            {/* Bus Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
              {busData?.services?.map((svc) => {
                const nextEta = svc.nextBus.etaMinutes;
                const isArriving = nextEta <= 1;

                return (
                  <div
                    key={svc.serviceNo}
                    className="bg-slate-50 hover:bg-slate-100/70 rounded-xl border border-slate-200/80 p-3.5 transition-all"
                  >
                    <div className="flex items-center justify-between">
                      {/* Bus Number Pill */}
                      <span className="bg-slate-900 text-white font-mono font-bold text-lg px-2.5 py-0.5 rounded-lg shadow-xs">
                        {svc.serviceNo}
                      </span>

                      {/* Primary ETA Badge */}
                      <div className="text-right">
                        <span className={`text-base font-bold ${
                          isArriving ? 'text-emerald-600 font-bold' : 'text-slate-900'
                        }`}>
                          {isArriving ? 'Arriving Now' : `${nextEta} min`}
                        </span>
                        <span className="text-[10px] text-slate-500 block">
                          Next: {svc.nextBus2 ? `${svc.nextBus2.etaMinutes} min` : 'Scheduled'}
                        </span>
                      </div>
                    </div>

                    {/* Metadata Strip */}
                    <div className="mt-3 pt-2.5 border-t border-slate-200/60 flex items-center justify-between text-xs">
                      <div className="flex items-center gap-1.5">
                        <span className={`w-2 h-2 rounded-full ${
                          svc.nextBus.load === 'SEA'
                            ? 'bg-emerald-500'
                            : svc.nextBus.load === 'SDA'
                            ? 'bg-amber-500'
                            : 'bg-rose-500'
                        }`} />
                        <span className="font-medium text-slate-700 text-[11px]">
                          {svc.nextBus.loadLabel}
                        </span>
                      </div>

                      <div className="flex items-center gap-2 text-slate-500 text-[10px] font-semibold">
                        {svc.nextBus.type === 'DD' && (
                          <span className="bg-slate-200 text-slate-800 px-1.5 py-0.5 rounded font-mono">
                            Double Decker
                          </span>
                        )}
                        <span title="Wheelchair Accessible" className="text-slate-400">
                          ♿ WAB
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* 2. MRT STATUS VIEW */}
      {activeSubTab === 'mrt' && (
        <div className="space-y-5">
          <div className="bg-white rounded-2xl border border-slate-200/90 p-4 sm:p-5 shadow-xs">
            <div className="flex items-center justify-between pb-3.5 border-b border-slate-100">
              <div>
                <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <Train className="w-4 h-4 text-slate-900" />
                  Live MRT / LRT Network Status
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Operating on 2-3 min peak / 4-5 min off-peak intervals with automated signaling.
                </p>
              </div>
              <span className="bg-slate-100 text-slate-800 text-xs font-semibold px-2.5 py-1 rounded-full flex items-center gap-1 border border-slate-200">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" /> Normal Operations
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 mt-4">
              {trainStatus.map((line) => (
                <div
                  key={line.line}
                  className="bg-slate-50 rounded-xl border border-slate-200/80 p-3.5 flex items-start gap-3"
                >
                  <div
                    style={{ backgroundColor: line.lineColor }}
                    className="w-10 h-10 rounded-lg text-white flex items-center justify-center font-mono font-bold text-xs shadow-xs shrink-0"
                  >
                    {line.line}
                  </div>

                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <h4 className="font-bold text-slate-900 text-xs">
                        {line.lineName}
                      </h4>
                      <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-1.5 py-0.2 rounded border border-emerald-200">
                        {line.status}
                      </span>
                    </div>
                    <p className="text-xs text-slate-600 mt-0.5">
                      {line.message}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Tourist Transit Tips Bar */}
            <div className="mt-5 bg-slate-900 text-white rounded-xl p-4 text-xs border border-slate-800">
              <div className="font-bold text-amber-400 mb-1 flex items-center gap-1.5">
                <Zap className="w-3.5 h-3.5" /> Singapore MRT Essentials
              </div>
              <ul className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-slate-300 mt-2 text-xs">
                <li>
                  <strong className="text-white">SimplyGo:</strong> Tap any Visa / Mastercard or Apple Pay at the gate. No physical transit card needed.
                </li>
                <li>
                  <strong className="text-white">Sheltered Links:</strong> Bayfront, Orchard, City Hall, and Raffles Place have direct air-conditioned mall connections.
                </li>
                <li>
                  <strong className="text-white">Operating Hours:</strong> Trains run daily from 5:30 AM to approximately 12:15 AM midnight.
                </li>
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* 3. POINT-TO-POINT ROUTER VIEW */}
      {activeSubTab === 'router' && (
        <div className="space-y-5">
          <div className="bg-white rounded-2xl border border-slate-200/90 p-4 sm:p-5 shadow-xs">
            <div className="pb-3.5 border-b border-slate-100">
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Navigation className="w-4 h-4 text-slate-900" />
                Transit & Shelter Route Calculator
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Calculates fastest MRT & Bus paths with covered linkway index and fare estimates in SGD.
              </p>
            </div>

            {/* Select Origin & Destination */}
            <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 mt-4 items-end">
              <div className="sm:col-span-5">
                <label className="text-[11px] font-bold text-slate-600 uppercase tracking-wider block mb-1">
                  Origin (Starting Point)
                </label>
                <select
                  value={originId}
                  onChange={(e) => setOriginId(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 text-slate-900 text-xs font-medium rounded-xl px-3 py-2 focus:bg-white focus:outline-none focus:ring-1 focus:ring-slate-900 focus:border-slate-900"
                >
                  {ATTRACTIONS_DATA.map((a) => (
                    <option key={a.id} value={a.id}>
                      {a.name} ({a.nearestMrt.stationName} MRT)
                    </option>
                  ))}
                </select>
              </div>

              <div className="sm:col-span-5">
                <label className="text-[11px] font-bold text-slate-600 uppercase tracking-wider block mb-1">
                  Destination
                </label>
                <select
                  value={destinationId}
                  onChange={(e) => setDestinationId(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 text-slate-900 text-xs font-medium rounded-xl px-3 py-2 focus:bg-white focus:outline-none focus:ring-1 focus:ring-slate-900 focus:border-slate-900"
                >
                  {ATTRACTIONS_DATA.map((a) => (
                    <option key={a.id} value={a.id}>
                      {a.name} ({a.nearestMrt.stationName} MRT)
                    </option>
                  ))}
                </select>
              </div>

              <div className="sm:col-span-2">
                <button
                  onClick={handlePlanRoute}
                  disabled={isRouteLoading}
                  className="w-full bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs py-2 px-3 rounded-xl shadow-xs transition-colors flex items-center justify-center gap-1"
                >
                  {isRouteLoading ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : 'Find Route'}
                </button>
              </div>
            </div>
          </div>

          {/* Route Result Card */}
          {routeResult && (
            <div className="bg-white rounded-2xl border border-slate-200/90 p-4 sm:p-5 shadow-xs">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3.5 border-b border-slate-100">
                <div>
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                    Recommended Transit Route
                  </span>
                  <h4 className="text-base font-bold text-slate-900 mt-0.5">
                    {routeResult.originName} ➔ {routeResult.destinationName}
                  </h4>
                </div>

                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <span className="text-[10px] text-slate-400 block">Duration</span>
                    <span className="text-sm font-bold text-slate-900">
                      {routeResult.totalDurationMinutes} mins
                    </span>
                  </div>
                  <div className="text-right pl-3 border-l border-slate-200">
                    <span className="text-[10px] text-slate-400 block">Fare</span>
                    <span className="text-sm font-bold text-slate-900">
                      S${routeResult.estimatedFareSGD.toFixed(2)}
                    </span>
                  </div>
                  <div className="text-right pl-3 border-l border-slate-200">
                    <span className="text-[10px] text-slate-400 block">Shelter</span>
                    <span className="text-sm font-bold text-sky-700">
                      {routeResult.shelterScorePercent}% Covered
                    </span>
                  </div>
                </div>
              </div>

              {/* Step by Step list */}
              <div className="mt-4 space-y-2.5">
                {routeResult.steps.map((step, idx) => (
                  <div
                    key={idx}
                    className="flex items-start gap-3 p-3 rounded-xl bg-slate-50 border border-slate-100"
                  >
                    <div className={`w-7 h-7 rounded-lg flex items-center justify-center font-bold text-white shrink-0 ${
                      step.type === 'mrt'
                        ? 'bg-slate-900'
                        : step.type === 'bus'
                        ? 'bg-slate-700'
                        : 'bg-slate-500'
                    }`}>
                      {step.type === 'mrt' ? <Train className="w-3.5 h-3.5" /> : step.type === 'bus' ? <Bus className="w-3.5 h-3.5" /> : <Footprints className="w-3.5 h-3.5" />}
                    </div>

                    <div className="flex-1 text-xs">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-slate-900 text-xs">
                          {step.instruction}
                        </span>
                        <span className="font-medium text-slate-500">
                          {step.durationMinutes} mins
                        </span>
                      </div>
                      {step.lineName && (
                        <div className="mt-1 flex items-center gap-2 text-slate-600">
                          <span
                            style={{ backgroundColor: step.lineColor || '#005ec4' }}
                            className="text-white text-[9px] font-bold px-1.5 py-0.2 rounded"
                          >
                            {step.lineCode}
                          </span>
                          <span>From: {step.fromStationOrStop} ➔ To: {step.toStationOrStop}</span>
                        </div>
                      )}
                      {step.isSheltered && (
                        <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-emerald-700 mt-0.5">
                          <ShieldCheck className="w-3 h-3" /> Fully Sheltered Link
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* 4. ONEMAP SG GOVERNMENT API VIEW */}
      {activeSubTab === 'onemap' && (
        <div className="space-y-6">
          {/* Token & Authentication Status Card */}
          <div className="bg-slate-900 rounded-2xl p-4 sm:p-5 text-white shadow-xs border border-slate-800">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3.5 border-b border-slate-800">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-400">
                  <Key className="w-4 h-4" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm font-bold text-white">OneMap Singapore Gov API v2</h3>
                    <span className="bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3" /> Live Backend Connected
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Official SLA geospatial services with auto-refreshing 3-day bearer tokens.
                  </p>
                </div>
              </div>

              <button
                onClick={fetchOneMapTokenStatus}
                disabled={isTokenLoading}
                className="self-start sm:self-auto bg-slate-800 hover:bg-slate-700 text-amber-300 text-xs font-semibold px-3 py-1.5 rounded-xl border border-slate-700 transition-colors flex items-center gap-1.5"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isTokenLoading ? 'animate-spin' : ''}`} />
                <span>{isTokenLoading ? 'Checking...' : 'Refresh Token'}</span>
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-3.5 text-xs text-slate-300">
              <div className="bg-slate-800/80 p-2.5 rounded-xl border border-slate-700/80">
                <span className="text-[10px] text-slate-400 uppercase font-bold block mb-0.5">Token Minting</span>
                <span className="font-mono text-emerald-400 font-bold">Auto-Refreshed (3 Days)</span>
              </div>
              <div className="bg-slate-800/80 p-2.5 rounded-xl border border-slate-700/80">
                <span className="text-[10px] text-slate-400 uppercase font-bold block mb-0.5">Token Expiry</span>
                <span className="font-mono text-slate-200">
                  {tokenStatus?.expiresAt ? new Date(tokenStatus.expiresAt).toLocaleString('en-SG', { timeZone: 'Asia/Singapore', dateStyle: 'short', timeStyle: 'short' }) : 'Active in Session'}
                </span>
              </div>
              <div className="bg-slate-800/80 p-2.5 rounded-xl border border-slate-700/80">
                <span className="text-[10px] text-slate-400 uppercase font-bold block mb-0.5">Authorization Header</span>
                <span className="font-mono text-amber-300 truncate block">
                  {tokenStatus?.token ? `${tokenStatus.token.substring(0, 16)}...` : 'Bearer Access Attached'}
                </span>
              </div>
            </div>
          </div>

          {/* Feature 1: Geocoding & Address Search */}
          <div className="bg-white rounded-2xl border border-slate-200/90 p-4 sm:p-5 shadow-xs">
            <div className="pb-3.5 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <Search className="w-4 h-4 text-amber-600" />
                  OneMap Geocode & Address Search
                </h4>
                <p className="text-xs text-slate-500 mt-0.5">
                  ElasticSearch with SVY21 / WGS84 coordinate conversion, postal codes, and building metadata.
                </p>
              </div>
            </div>

            <form onSubmit={handleOneMapSearch} className="flex gap-2 mt-4">
              <input
                type="text"
                placeholder="Search place, building, or postal code (e.g. raffles place, marina bay sands, 049481)"
                value={oneMapSearchVal}
                onChange={(e) => setOneMapSearchVal(e.target.value)}
                className="flex-1 bg-slate-50 border border-slate-200 text-xs font-medium rounded-xl px-3 py-2 text-slate-900 focus:bg-white focus:outline-none focus:ring-1 focus:ring-slate-900 focus:border-slate-900"
              />
              <button
                type="submit"
                disabled={isOneMapSearching}
                className="bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs px-4 py-2 rounded-xl transition-colors shadow-xs flex items-center gap-1.5 shrink-0"
              >
                {isOneMapSearching ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Search className="w-3.5 h-3.5" />}
                <span>Search</span>
              </button>
            </form>

            {/* Presets */}
            <div className="flex flex-wrap gap-1.5 mt-2.5">
              {['raffles place', 'marina bay sands', 'orchard road', 'chinatown heritage', 'singapore flyer'].map((p) => (
                <button
                  key={p}
                  type="button"
                  onClick={() => {
                    setOneMapSearchVal(p);
                    fetch(`/api/onemap/search?searchVal=${encodeURIComponent(p)}&returnGeom=Y&getAddrDetails=Y&pageNum=1`)
                      .then(r => r.json())
                      .then(d => setOneMapSearchResults(d.results || []));
                  }}
                  className="text-[11px] bg-slate-100 hover:bg-slate-200 text-slate-700 px-2 py-0.5 rounded-lg transition-colors capitalize"
                >
                  {p}
                </button>
              ))}
            </div>

            {/* Results */}
            {oneMapSearchResults.length > 0 && (
              <div className="mt-4 space-y-2 max-h-60 overflow-y-auto pr-1">
                {oneMapSearchResults.map((res, i) => (
                  <div key={i} className="p-3 bg-slate-50 hover:bg-amber-50/50 border border-slate-200 rounded-xl transition-colors text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div>
                      <div className="font-bold text-slate-900">{res.BUILDING || res.SEARCHVAL}</div>
                      <div className="text-slate-600 text-[11px]">{res.ADDRESS} {res.POSTAL && res.POSTAL !== 'NIL' ? `(S${res.POSTAL})` : ''}</div>
                    </div>
                    <div className="flex items-center gap-2 text-[10px] font-mono text-slate-500 bg-white px-2 py-1 rounded-lg border border-slate-200 shrink-0">
                      <MapPin className="w-3 h-3 text-amber-600" />
                      <span>{Number(res.LATITUDE).toFixed(5)}, {Number(res.LONGITUDE).toFixed(5)}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Feature 2: Reverse Geocode */}
          <div className="bg-white rounded-2xl border border-slate-200/90 p-4 sm:p-5 shadow-xs">
            <div className="pb-3.5 border-b border-slate-100">
              <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <MapPin className="w-4 h-4 text-emerald-600" />
                OneMap Reverse Geocoder
              </h4>
              <p className="text-xs text-slate-500 mt-0.5">
                Convert geographic coordinates (WGS84 Lat, Lng) into Singapore addresses and building names within a buffer zone.
              </p>
            </div>

            <form onSubmit={handleOneMapRevGeocode} className="flex gap-2 mt-4">
              <input
                type="text"
                placeholder="Enter lat,lng (e.g. 1.3,103.8 or 1.2838,103.8591)"
                value={revGeoLocation}
                onChange={(e) => setRevGeoLocation(e.target.value)}
                className="flex-1 bg-slate-50 border border-slate-200 text-xs font-medium rounded-xl px-3 py-2 text-slate-900 focus:bg-white focus:outline-none focus:ring-1 focus:ring-slate-900 focus:border-slate-900"
              />
              <button
                type="submit"
                disabled={isRevGeoLoading}
                className="bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs px-4 py-2 rounded-xl transition-colors shadow-xs flex items-center gap-1.5 shrink-0"
              >
                {isRevGeoLoading ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <MapPin className="w-3.5 h-3.5" />}
                <span>Resolve Address</span>
              </button>
            </form>

            {/* Preset Coordinates */}
            <div className="flex flex-wrap gap-1.5 mt-2.5">
              {[
                { label: 'Marina Bay', loc: '1.2838,103.8591' },
                { label: 'Raffles Place', loc: '1.2830,103.8519' },
                { label: 'Changi Airport', loc: '1.3644,103.9915' },
                { label: 'Sentosa Express', loc: '1.2655,103.8201' },
                { label: 'Sample (1.3, 103.8)', loc: '1.3,103.8' }
              ].map((p) => (
                <button
                  key={p.label}
                  type="button"
                  onClick={() => {
                    setRevGeoLocation(p.loc);
                    fetch(`/api/onemap/revgeocode?location=${encodeURIComponent(p.loc)}&buffer=40&addressType=All`)
                      .then(r => r.json())
                      .then(d => setRevGeoResult(d));
                  }}
                  className="text-[11px] bg-slate-100 hover:bg-slate-200 text-slate-700 px-2 py-0.5 rounded-lg transition-colors"
                >
                  {p.label} ({p.loc})
                </button>
              ))}
            </div>

            {/* Reverse Geocode Result */}
            {revGeoResult && (
              <div className="mt-4 p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs">
                <div className="font-bold text-slate-900 mb-1 flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  Resolved Location Data
                </div>
                {revGeoResult.GeocodeInfo ? (
                  <div className="space-y-1">
                    {Array.isArray(revGeoResult.GeocodeInfo) ? (
                      revGeoResult.GeocodeInfo.map((info: any, idx: number) => (
                        <div key={idx} className="p-2 bg-white rounded-lg border border-slate-100">
                          <span className="font-semibold text-slate-900">{info.BUILDINGNAME || info.ROAD || 'Singapore Location'}</span>
                          <div className="text-[11px] text-slate-500">{info.BLOCK ? `Blk ${info.BLOCK} ` : ''}{info.ROAD} {info.POSTALCODE ? `(S${info.POSTALCODE})` : ''}</div>
                        </div>
                      ))
                    ) : (
                      <pre className="text-[11px] font-mono text-slate-700 bg-white p-2 rounded-lg overflow-x-auto">
                        {JSON.stringify(revGeoResult.GeocodeInfo, null, 2)}
                      </pre>
                    )}
                  </div>
                ) : (
                  <pre className="text-[11px] font-mono text-slate-700 bg-white p-2 rounded-lg overflow-x-auto">
                    {JSON.stringify(revGeoResult, null, 2)}
                  </pre>
                )}
              </div>
            )}
          </div>

          {/* Feature 3: Direct OneMap Routing (walk, drive, cycle, pt) */}
          <div className="bg-white rounded-2xl border border-slate-200/90 p-4 sm:p-5 shadow-xs">
            <div className="pb-3.5 border-b border-slate-100">
              <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <Navigation className="w-4 h-4 text-sky-600" />
                OneMap Routing Engine (walk | drive | cycle | pt)
              </h4>
              <p className="text-xs text-slate-500 mt-0.5">
                Official turn-by-turn routing with elevation, walking pathways, cycling tracks, and public transport modes.
              </p>
            </div>

            <form onSubmit={handleOneMapRoute} className="mt-4 space-y-3">
              <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
                <div className="sm:col-span-5">
                  <label className="text-[11px] font-bold text-slate-600 uppercase block mb-1">
                    Start Coordinates (Lat, Lng)
                  </label>
                  <input
                    type="text"
                    value={omStart}
                    onChange={(e) => setOmStart(e.target.value)}
                    placeholder="1.320981,103.844150"
                    className="w-full bg-slate-50 border border-slate-200 text-xs font-mono rounded-xl px-3 py-2 text-slate-900 focus:bg-white focus:outline-none focus:ring-1 focus:ring-slate-900"
                  />
                </div>

                <div className="sm:col-span-5">
                  <label className="text-[11px] font-bold text-slate-600 uppercase block mb-1">
                    End Coordinates (Lat, Lng)
                  </label>
                  <input
                    type="text"
                    value={omEnd}
                    onChange={(e) => setOmEnd(e.target.value)}
                    placeholder="1.326762,103.8559"
                    className="w-full bg-slate-50 border border-slate-200 text-xs font-mono rounded-xl px-3 py-2 text-slate-900 focus:bg-white focus:outline-none focus:ring-1 focus:ring-slate-900"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="text-[11px] font-bold text-slate-600 uppercase block mb-1">
                    Mode
                  </label>
                  <select
                    value={omRouteType}
                    onChange={(e) => setOmRouteType(e.target.value as any)}
                    className="w-full bg-slate-50 border border-slate-200 text-xs font-semibold rounded-xl px-3 py-2 text-slate-900 focus:bg-white focus:outline-none focus:ring-1 focus:ring-slate-900 capitalize"
                  >
                    <option value="walk">Walk</option>
                    <option value="drive">Drive</option>
                    <option value="cycle">Cycle</option>
                    <option value="pt">Public Transport (PT)</option>
                  </select>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pt-1">
                <div className="flex flex-wrap gap-1.5">
                  <button
                    type="button"
                    onClick={() => {
                      setOmStart('1.320981,103.844150');
                      setOmEnd('1.326762,103.8559');
                      setOmRouteType('walk');
                    }}
                    className="text-[10px] bg-slate-100 hover:bg-slate-200 text-slate-700 px-2 py-0.5 rounded-lg"
                  >
                    Novena ➔ Balestier (Walk)
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setOmStart('1.2816,103.8636');
                      setOmEnd('1.2847,103.8432');
                      setOmRouteType('walk');
                    }}
                    className="text-[10px] bg-slate-100 hover:bg-slate-200 text-slate-700 px-2 py-0.5 rounded-lg"
                  >
                    Gardens ➔ Chinatown (Walk)
                  </button>
                </div>

                <button
                  type="submit"
                  disabled={isOmRouteLoading}
                  className="bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs px-4 py-2 rounded-xl transition-colors shadow-xs flex items-center justify-center gap-1.5"
                >
                  {isOmRouteLoading ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Navigation className="w-3.5 h-3.5" />}
                  <span>Calculate OneMap Route</span>
                </button>
              </div>
            </form>

            {/* OneMap Route Result Output */}
            {omRouteResult && (
              <div className="mt-4 p-4 bg-slate-50 border border-slate-200 rounded-xl text-xs space-y-3">
                <div className="flex items-center justify-between pb-2 border-b border-slate-200/80">
                  <span className="font-bold text-slate-900 flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    OneMap Official Route Output ({omRouteType.toUpperCase()})
                  </span>
                  {omRouteResult.route_summary && (
                    <div className="flex gap-3 text-xs font-semibold text-slate-800">
                      <span>{(omRouteResult.route_summary.total_distance / 1000).toFixed(2)} km</span>
                      <span>•</span>
                      <span>{Math.round(omRouteResult.route_summary.total_time / 60)} mins</span>
                    </div>
                  )}
                </div>

                {omRouteResult.route_instructions ? (
                  <div className="space-y-1.5 max-h-56 overflow-y-auto pr-1">
                    {omRouteResult.route_instructions.map((step: any, i: number) => (
                      <div key={i} className="flex items-center justify-between p-2 bg-white rounded-lg border border-slate-100 text-[11px]">
                        <span className="text-slate-800 font-medium">{step[0] || step.instruction || JSON.stringify(step)}</span>
                        {step[2] !== undefined && (
                          <span className="text-slate-500 font-mono shrink-0 ml-2">{step[2]}m</span>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <pre className="text-[11px] font-mono text-slate-700 bg-white p-3 rounded-lg overflow-x-auto max-h-56">
                    {JSON.stringify(omRouteResult, null, 2)}
                  </pre>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
