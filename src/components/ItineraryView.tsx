import { useState, FormEvent } from 'react';
import { 
  Sparkles, 
  MapPin, 
  Clock, 
  Navigation, 
  Utensils, 
  DollarSign, 
  ShieldCheck, 
  CloudRain, 
  Sun, 
  RefreshCw, 
  ArrowRight, 
  Share2, 
  Printer, 
  CheckCircle2, 
  ExternalLink,
  Users,
  Compass,
  Footprints,
  Train,
  Crown,
  Tag,
  Download
} from 'lucide-react';
import { GeneratedItinerary, Attraction, SubscriptionTier } from '../types';
import { ATTRACTIONS_DATA } from '../data/singaporeData';

interface ItineraryViewProps {
  itinerary: GeneratedItinerary;
  isLoading: boolean;
  onGenerateItinerary: (options: {
    duration: string;
    pacing: 'relaxed' | 'balanced' | 'packed';
    travelGroup: 'solo' | 'couple' | 'family' | 'seniors';
    startLocation: string;
  }) => void;
  onSwapAttraction: (dayNumber: number, itemId: string, targetAttractionId: string) => void;
  onSelectAttractionDetail: (attraction: Attraction) => void;
  subscriptionTier: SubscriptionTier;
  onOpenSubscriptionModal: () => void;
}

export function ItineraryView({
  itinerary,
  isLoading,
  onGenerateItinerary,
  onSwapAttraction,
  onSelectAttractionDetail,
  subscriptionTier,
  onOpenSubscriptionModal
}: ItineraryViewProps) {
  const [duration, setDuration] = useState<string>('1day');
  const [pacing, setPacing] = useState<'relaxed' | 'balanced' | 'packed'>('balanced');
  const [travelGroup, setTravelGroup] = useState<'solo' | 'couple' | 'family' | 'seniors'>('couple');
  const [startLocation, setStartLocation] = useState<string>('Marina Bay');
  const [copiedNotification, setCopiedNotification] = useState<boolean>(false);

  const isPro = subscriptionTier !== 'free';

  const handleDurationChange = (val: string) => {
    if ((val === '5days' || val === '7days') && !isPro) {
      onOpenSubscriptionModal();
      return;
    }
    setDuration(val);
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    onGenerateItinerary({ duration, pacing, travelGroup, startLocation });
  };

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      setCopiedNotification(true);
      setTimeout(() => setCopiedNotification(false), 2500);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  // Calculate total trip metrics
  const totalTicketsSGD = itinerary.days.reduce((acc, day) => acc + (day.totalEstCostSGD || 0), 0);
  const totalAttractionsCount = itinerary.days.reduce((acc, day) => acc + day.items.length, 0);

  return (
    <div className="space-y-6">
      {/* Control / Generator Form Card */}
      <div className="bg-white rounded-2xl border border-slate-200/90 p-4 sm:p-5 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3.5 border-b border-slate-100">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Compass className="w-4 h-4 text-amber-500" />
                Dynamic Itinerary Generator
              </h2>
              {isPro && (
                <span className="bg-amber-100 text-amber-800 text-[10px] font-bold px-2 py-0.5 rounded border border-amber-300 flex items-center gap-1">
                  <Crown className="w-3 h-3" /> Tourist Pass+ Unlocked
                </span>
              )}
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Synchronized with live Singapore NEA weather forecasts, MRT lines, and opening hours.
            </p>
          </div>
          <div className="flex items-center gap-2 self-start sm:self-auto">
            {isPro ? (
              <span className="text-[10px] font-semibold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200 flex items-center gap-1">
                <ShieldCheck className="w-3 h-3 text-emerald-600" /> Auto Rain-Shield Active
              </span>
            ) : (
              <button
                type="button"
                onClick={onOpenSubscriptionModal}
                className="text-[10px] font-bold text-amber-700 bg-amber-50 hover:bg-amber-100 px-2 py-0.5 rounded-full border border-amber-200 flex items-center gap-1 transition-colors"
              >
                <Crown className="w-3 h-3 text-amber-500" /> Unlock 7-Day Pass
              </button>
            )}
            <span className="text-[10px] font-semibold text-slate-700 bg-slate-100 px-2 py-0.5 rounded-full border border-slate-200 flex items-center gap-1">
              <CheckCircle2 className="w-3 h-3 text-emerald-600" /> LTA Transit Verified
            </span>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="mt-3.5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {/* Duration */}
          <div>
            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
              Trip Duration
            </label>
            <select
              value={duration}
              onChange={(e) => handleDurationChange(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 text-slate-900 text-xs font-semibold rounded-xl px-3 py-2 focus:bg-white focus:outline-none focus:ring-1 focus:ring-slate-900 focus:border-slate-900"
            >
              <option value="halfday">Half Day (4-5 Hours)</option>
              <option value="1day">1 Full Day (Iconic Tour)</option>
              <option value="2days">2 Days (Marina Bay + Sentosa)</option>
              <option value="3days">3 Days (Full Island Explorer)</option>
              <option value="5days">{isPro ? '5 Days (Complete Singapore Grand Tour)' : '⭐ 5 Days (Tourist Pass+)'}</option>
              <option value="7days">{isPro ? '7 Days (Ultimate Island & Nature Pass)' : '⭐ 7 Days (Tourist Pass+)'}</option>
            </select>
          </div>

          {/* Group */}
          <div>
            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
              Travel Group
            </label>
            <select
              value={travelGroup}
              onChange={(e) => setTravelGroup(e.target.value as 'solo' | 'couple' | 'family' | 'seniors')}
              className="w-full bg-slate-50 border border-slate-200 text-slate-900 text-xs font-semibold rounded-xl px-3 py-2 focus:bg-white focus:outline-none focus:ring-1 focus:ring-slate-900 focus:border-slate-900"
            >
              <option value="couple">Couple / Duo</option>
              <option value="solo">Solo Explorer</option>
              <option value="family">Family with Kids</option>
              <option value="seniors">Seniors / Relaxed Step</option>
            </select>
          </div>

          {/* Start Location */}
          <div>
            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
              Starting Base / Hotel
            </label>
            <select
              value={startLocation}
              onChange={(e) => setStartLocation(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 text-slate-900 text-xs font-semibold rounded-xl px-3 py-2 focus:bg-white focus:outline-none focus:ring-1 focus:ring-slate-900 focus:border-slate-900"
            >
              <option value="Marina Bay">Marina Bay (MBS / Bayfront)</option>
              <option value="Orchard">Orchard Road (Shopping Belt)</option>
              <option value="Chinatown">Chinatown / Outram Park</option>
              <option value="Civic District">City Hall / Civic District</option>
              <option value="Bugis">Bugis / Kampong Glam</option>
              <option value="Sentosa">Sentosa Island</option>
              <option value="Changi">Changi Airport / Jewel</option>
            </select>
          </div>

          {/* Pacing & Submit */}
          <div>
            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
              Tour Pacing
            </label>
            <div className="flex gap-2">
              <select
                value={pacing}
                onChange={(e) => setPacing(e.target.value as 'relaxed' | 'balanced' | 'packed')}
                className="flex-1 bg-slate-50 border border-slate-200 text-slate-900 text-xs font-semibold rounded-xl px-3 py-2 focus:bg-white focus:outline-none focus:ring-1 focus:ring-slate-900 focus:border-slate-900"
              >
                <option value="relaxed">Relaxed (Less walking)</option>
                <option value="balanced">Balanced (Optimal)</option>
                <option value="packed">Packed (See everything)</option>
              </select>

              <button
                type="submit"
                disabled={isLoading}
                className="bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs px-3.5 py-2 rounded-xl shadow-xs transition-all flex items-center gap-1.5 shrink-0"
              >
                {isLoading ? (
                  <>
                    <RefreshCw className="w-3.5 h-3.5 animate-spin text-amber-400" />
                    <span>Planning...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                    <span>Generate</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </form>
      </div>

      {/* Itinerary Header & Overview Strip */}
      <div className="bg-slate-900 text-white rounded-2xl p-5 sm:p-6 shadow-sm border border-slate-800">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <span className="bg-slate-800 text-amber-400 font-bold text-[10px] px-2 py-0.5 rounded border border-slate-700">
                AI OPTIMIZED PLAN
              </span>
              <span className="text-xs text-slate-400">
                Pacing: <span className="text-white capitalize font-medium">{itinerary.pacing}</span>
              </span>
              <span className="text-xs text-slate-400">
                Group: <span className="text-white capitalize font-medium">{itinerary.travelGroup}</span>
              </span>
            </div>
            <h1 className="text-lg sm:text-xl font-bold text-white mt-1.5">
              {itinerary.title}
            </h1>
            <p className="text-xs text-slate-300 mt-1 max-w-3xl leading-relaxed font-normal">
              {itinerary.theme}
            </p>
          </div>

          {/* Quick Action Buttons */}
          <div className="flex items-center gap-2 self-start lg:self-auto">
            <button
              onClick={handleShare}
              className="bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors border border-slate-700"
            >
              <Share2 className="w-3.5 h-3.5" />
              {copiedNotification ? 'Link Copied!' : 'Share'}
            </button>
            <button
              onClick={handlePrint}
              className="bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors border border-slate-700"
            >
              <Printer className="w-3.5 h-3.5" />
              Print
            </button>
          </div>
        </div>

        {/* Budget & Shelter Key Metrics */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-4 pt-3.5 border-t border-slate-800 text-xs">
          <div>
            <span className="text-slate-400 block text-[10px]">Attractions Included</span>
            <span className="text-sm font-bold text-white mt-0.5 block">{totalAttractionsCount} Highlights</span>
          </div>
          <div>
            <span className="text-slate-400 block text-[10px]">Est. Attractions Cost</span>
            <span className="text-sm font-bold text-amber-400 mt-0.5 block">S${totalTicketsSGD} / adult</span>
          </div>
          <div>
            <span className="text-slate-400 block text-[10px]">Transit Fares (SimplyGo)</span>
            <span className="text-sm font-bold text-emerald-400 mt-0.5 block">~S$4.80 - S$7.50</span>
          </div>
          <div>
            <span className="text-slate-400 block text-[10px]">Weather Shelter Index</span>
            <span className="text-sm font-bold text-sky-400 mt-0.5 block">95% Sheltered / Indoor</span>
          </div>
        </div>
      </div>

      {/* Advisory & Tips Strip */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {/* Weather Alerts */}
        <div className="bg-slate-50 border border-slate-200/80 rounded-xl p-3.5 text-xs">
          <div className="font-bold text-slate-900 flex items-center gap-1.5 mb-1.5">
            <Sun className="w-3.5 h-3.5 text-amber-500" />
            Live Weather Strategy
          </div>
          <ul className="space-y-1 text-slate-600">
            {itinerary.weatherAlerts?.map((alert, i) => (
              <li key={i} className="flex items-start gap-1.5">
                <span className="text-amber-500 font-bold">•</span>
                <span>{alert}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Transit Advice */}
        <div className="bg-slate-50 border border-slate-200/80 rounded-xl p-3.5 text-xs">
          <div className="font-bold text-slate-900 flex items-center gap-1.5 mb-1.5">
            <Train className="w-3.5 h-3.5 text-sky-600" />
            Singapore Transit Advice
          </div>
          <p className="text-slate-600 mb-1.5">
            {itinerary.transitAdvice}
          </p>
          <div className="text-[11px] text-slate-500 font-normal">
            💡 Tap contactless Visa/Mastercard or Apple Pay on any MRT/Bus gantry.
          </div>
        </div>
      </div>

      {/* Days Timeline */}
      <div className="space-y-6">
        {itinerary.days.map((day) => (
          <div key={day.dayNumber} className="bg-white rounded-2xl border border-slate-200/90 p-4 sm:p-5 shadow-xs">
            {/* Day Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3.5 border-b border-slate-100 mb-5">
              <div>
                <div className="flex items-center gap-2">
                  <span className="bg-slate-900 text-white font-bold text-[11px] px-2 py-0.5 rounded">
                    Day {day.dayNumber}
                  </span>
                  <h3 className="text-base font-bold text-slate-900">
                    {day.title}
                  </h3>
                </div>
                <p className="text-xs text-slate-500 mt-0.5">
                  {day.summary}
                </p>
              </div>

              <div className="flex items-center gap-2 text-xs">
                <span className="bg-slate-100 text-slate-700 px-2 py-0.5 rounded font-medium text-[11px]">
                  {day.weatherOverview}
                </span>
                <span className="bg-slate-100 text-slate-900 border border-slate-200 px-2 py-0.5 rounded font-semibold text-[11px]">
                  S${day.totalEstCostSGD} Tickets
                </span>
              </div>
            </div>

            {/* Timeline Items */}
            <div className="space-y-5 relative before:absolute before:inset-0 before:left-3.5 before:w-0.5 before:bg-slate-200/80 before:hidden sm:before:block">
              {day.items.map((item, idx) => {
                const attr = item.attraction;
                const isLast = idx === day.items.length - 1;

                return (
                  <div key={item.id || idx} className="relative sm:pl-9">
                    {/* Timeline Node Dot */}
                    <div className="hidden sm:flex absolute left-1.5 top-5 -translate-x-1/2 w-3.5 h-3.5 rounded-full bg-slate-900 border-2 border-white shadow-xs items-center justify-center text-white" />

                    {/* Main Attraction Card */}
                    <div className="bg-slate-50/60 hover:bg-slate-50 rounded-2xl border border-slate-200/80 p-4 sm:p-4.5 transition-all">
                      {/* Top Slot Header */}
                      <div className="flex flex-wrap items-center justify-between gap-2 pb-2.5 border-b border-slate-200/60 mb-3">
                        <div className="flex items-center gap-2">
                          <span className="bg-white border border-slate-200 text-slate-800 font-semibold text-xs px-2.5 py-0.5 rounded-lg flex items-center gap-1.5 shadow-2xs">
                            <Clock className="w-3 h-3 text-amber-500" />
                            {item.timeSlot}
                          </span>
                          <span className="text-xs font-medium text-slate-500">
                            {attr.categoryLabel}
                          </span>
                        </div>

                        {/* Weather Forecast for this slot */}
                        <div className="flex items-center gap-1.5 text-xs font-medium">
                          {item.rainRisk === 'heavy' ? (
                            <span className="bg-sky-50 text-sky-800 border border-sky-200 px-2 py-0.5 rounded-full flex items-center gap-1 text-[10px] font-semibold">
                              <CloudRain className="w-3 h-3 text-sky-600" /> Rain Expected (Sheltered)
                            </span>
                          ) : (
                            <span className="bg-amber-50 text-amber-900 border border-amber-200 px-2 py-0.5 rounded-full flex items-center gap-1 text-[10px] font-semibold">
                              <Sun className="w-3 h-3 text-amber-600" /> {item.weatherForecast}
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Content Grid: Photo + Information */}
                      <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
                        {/* Attraction Image */}
                        <div className="md:col-span-4 relative group overflow-hidden rounded-xl bg-slate-200 h-40 sm:h-auto">
                          <img
                            src={attr.imageUrl}
                            alt={attr.name}
                            className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-300"
                            referrerPolicy="no-referrer"
                          />
                          <div className="absolute top-2 left-2 bg-slate-950/75 backdrop-blur text-white text-[10px] font-bold px-2 py-0.5 rounded">
                            ⭐ {attr.rating} ({attr.reviewCount.toLocaleString()})
                          </div>
                          {attr.rainProofScore >= 4 && (
                            <div className="absolute bottom-2 left-2 bg-slate-900/90 text-emerald-400 text-[10px] font-semibold px-2 py-0.5 rounded flex items-center gap-1">
                              <ShieldCheck className="w-3 h-3 text-emerald-400" /> 100% Rainproof
                            </div>
                          )}
                        </div>

                        {/* Details & Actions */}
                        <div className="md:col-span-8 flex flex-col justify-between">
                          <div>
                            <div className="flex flex-wrap items-start justify-between gap-2">
                              <div>
                                <h4
                                  onClick={() => onSelectAttractionDetail(attr)}
                                  className="text-base font-bold text-slate-900 hover:text-amber-600 cursor-pointer transition-colors"
                                >
                                  {attr.name}
                                </h4>
                                {attr.chineseName && (
                                  <span className="text-xs text-slate-400 font-normal">
                                    {attr.chineseName}
                                  </span>
                                )}
                              </div>

                              <div className="text-right">
                                <span className="text-base font-bold text-slate-900">
                                  {attr.priceSGD === 0 ? 'FREE' : `S$${attr.priceSGD}`}
                                </span>
                                {attr.priceSGD > 0 && (
                                  <span className="text-[10px] text-slate-500 block">per adult</span>
                                )}
                              </div>
                            </div>

                            <p className="text-xs text-slate-600 mt-1.5 line-clamp-2 leading-relaxed">
                              {item.recommendedActivity || attr.description}
                            </p>

                            {/* MRT Access Bar */}
                            <div className="mt-2.5 flex flex-wrap items-center gap-2 text-xs">
                              <div className="flex items-center gap-1 bg-white border border-slate-200 px-2 py-0.5 rounded-lg">
                                <Navigation className="w-3 h-3 text-slate-700" />
                                <span className="font-semibold text-slate-800">
                                  {attr.nearestMrt.stationName} MRT
                                </span>
                                <div className="flex gap-0.5 ml-1">
                                  {attr.nearestMrt.code.map((c, i) => (
                                    <span
                                      key={c}
                                      style={{ backgroundColor: attr.nearestMrt.lineColors[i] || '#005ec4' }}
                                      className="text-white text-[9px] font-bold px-1 py-0.2 rounded"
                                    >
                                      {c}
                                    </span>
                                  ))}
                                </div>
                                <span className="text-slate-400 text-[10px] ml-1">
                                  ({attr.nearestMrt.walkMinutes} min walk)
                                </span>
                              </div>

                              <span className="text-slate-400 text-[10px]">
                                {attr.nearestMrt.exit}
                              </span>
                            </div>
                          </div>

                          {/* Action Footer & Rain Swap Trigger */}
                          <div className="mt-3 pt-2.5 border-t border-slate-200/60 flex flex-wrap items-center justify-between gap-2">
                            <div className="flex items-center gap-2">
                              <button
                                onClick={() => onSelectAttractionDetail(attr)}
                                className="text-xs font-semibold text-slate-700 hover:text-slate-900 bg-white border border-slate-200 px-2.5 py-1 rounded-lg shadow-2xs transition-colors"
                              >
                                View Inclusions
                              </button>

                              {/* Rain Swap Option */}
                              {attr.indoorAlternativeId && attr.indoorAlternativeId !== attr.id && (
                                <button
                                  onClick={() => onSwapAttraction(day.dayNumber, item.id, attr.indoorAlternativeId!)}
                                  className="text-xs font-medium text-slate-700 hover:text-slate-900 bg-white hover:bg-slate-100 border border-slate-200 px-2.5 py-1 rounded-lg transition-colors flex items-center gap-1"
                                  title="Swap to indoor shelter if raining"
                                >
                                  <CloudRain className="w-3 h-3 text-sky-600" />
                                  <span>Rain Swap: {ATTRACTIONS_DATA.find(a => a.id === attr.indoorAlternativeId)?.name.split(' ')[0] || 'Indoor'}</span>
                                </button>
                              )}
                            </div>

                            {attr.ticketLink && (
                              <a
                                href={attr.ticketLink}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 px-3 py-1 rounded-lg transition-colors flex items-center gap-1 shadow-xs"
                              >
                                <span>Book Tickets</span>
                                <ExternalLink className="w-3 h-3" />
                              </a>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Hawker Food Recommendation for this stop */}
                      {item.mealSuggestion && (
                        <div className="mt-3 bg-white border border-slate-200/80 rounded-xl p-2.5 sm:p-3 flex items-start gap-2.5 text-xs">
                          <div className="p-1 rounded-lg bg-slate-100 text-slate-700 shrink-0">
                            <Utensils className="w-3.5 h-3.5" />
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center justify-between">
                              <span className="font-bold text-slate-900">
                                Food Tip: {item.mealSuggestion.name}
                              </span>
                              <span className="font-medium text-slate-600 bg-slate-100 px-2 py-0.5 rounded text-[10px]">
                                {item.mealSuggestion.budgetSGD}
                              </span>
                            </div>
                            <p className="text-slate-600 text-[11px] mt-0.5">
                              Famous Dish: <span className="font-medium text-slate-900">{item.mealSuggestion.famousDish}</span> ({item.mealSuggestion.cuisine})
                            </p>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Step-by-Step Transit Route Connector between stops */}
                    {!isLast && (
                      <div className="my-2.5 py-1.5 px-3 bg-white border border-slate-200/70 rounded-xl flex flex-wrap items-center justify-between gap-2 text-xs">
                        <div className="flex items-center gap-2">
                          <div className="w-5 h-5 rounded-full bg-slate-100 text-slate-800 flex items-center justify-center font-bold text-[10px]">
                            <Train className="w-3 h-3 text-slate-700" />
                          </div>
                          <div>
                            <span className="font-semibold text-slate-800">
                              Transit: {attr.nearestMrt.stationName} MRT ➔ Next Attraction MRT
                            </span>
                            <span className="text-slate-400 text-[10px] block sm:inline sm:ml-2">
                              (Underground sheltered • ~12 mins • S$1.45)
                            </span>
                          </div>
                        </div>
                        <span className="bg-slate-100 text-slate-700 font-medium text-[10px] px-2 py-0.5 rounded-full border border-slate-200">
                          Covered Walkway
                        </span>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
