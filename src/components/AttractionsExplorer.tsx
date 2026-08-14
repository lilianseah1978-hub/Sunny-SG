import { useState } from 'react';
import { 
  Search, 
  Filter, 
  Ticket, 
  Star, 
  MapPin, 
  ShieldCheck, 
  Clock, 
  Navigation, 
  ExternalLink, 
  Plus, 
  Check, 
  Sparkles,
  CloudRain,
  Sun,
  Crown,
  Tag,
  Copy,
  CheckCheck
} from 'lucide-react';
import { Attraction, SubscriptionTier } from '../types';
import { ATTRACTIONS_DATA, EXCLUSIVE_PROMO_VOUCHERS } from '../data/singaporeData';

interface AttractionsExplorerProps {
  onSelectAttractionDetail: (attraction: Attraction) => void;
  onAddToItinerary: (attraction: Attraction) => void;
  addedAttractionIds: string[];
  subscriptionTier: SubscriptionTier;
  onOpenSubscriptionModal: () => void;
}

export function AttractionsExplorer({
  onSelectAttractionDetail,
  onAddToItinerary,
  addedAttractionIds,
  subscriptionTier,
  onOpenSubscriptionModal
}: AttractionsExplorerProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [weatherFilter, setWeatherFilter] = useState<'all' | 'rain-proof' | 'outdoor'>('all');
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  const isPro = subscriptionTier !== 'free';

  const handleCopyVoucher = (code: string) => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(code);
      setCopiedCode(code);
      setTimeout(() => setCopiedCode(null), 2000);
    }
  };

  const categories = [
    { id: 'all', label: 'All Attractions' },
    { id: 'landmark', label: '🌟 Iconic Landmarks' },
    { id: 'indoor', label: '🌧️ 100% Rain-Proof Domes' },
    { id: 'wildlife', label: '🦁 Wildlife & Zoos' },
    { id: 'theme-park', label: '🎢 Sentosa & Thrills' },
    { id: 'culture', label: '🏛️ Cultural Heritage' },
    { id: 'nature', label: '🌿 UNESCO Parks' }
  ];

  const filteredAttractions = ATTRACTIONS_DATA.filter((attr) => {
    // Search query
    const matchQuery = 
      attr.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      attr.area.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (attr.chineseName && attr.chineseName.includes(searchQuery)) ||
      attr.nearestMrt.stationName.toLowerCase().includes(searchQuery.toLowerCase());

    // Category
    const matchCategory = selectedCategory === 'all' || attr.category === selectedCategory;

    // Weather
    const matchWeather = 
      weatherFilter === 'all' ||
      (weatherFilter === 'rain-proof' && attr.rainProofScore >= 4) ||
      (weatherFilter === 'outdoor' && attr.weatherSuitability === 'outdoor-best');

    return matchQuery && matchCategory && matchWeather;
  });

  return (
    <div className="space-y-6">
      {/* Hero Ticketing Header (Clean Minimalism) */}
      <div className="bg-slate-900 rounded-2xl p-5 sm:p-6 text-white shadow-xs border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="max-w-2xl">
          <div className="inline-flex items-center gap-1.5 bg-slate-800 text-amber-400 text-[10px] font-bold px-2 py-0.5 rounded border border-slate-700 uppercase tracking-wider mb-2">
            <Sparkles className="w-3 h-3" /> Singapore Attractions Hub
          </div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-white">
            Top Singapore Attractions & Passes
          </h1>
          <p className="text-xs text-slate-300 mt-1 leading-relaxed font-normal">
            Admission tickets, skip-the-line passes, and rain-proof indoor domes with direct MRT station connectivity.
          </p>

          {/* Quick Badges */}
          <div className="flex flex-wrap gap-2 mt-4 text-xs text-slate-300 font-medium">
            <div className="bg-slate-800/80 px-2.5 py-1 rounded-lg flex items-center gap-1.5 border border-slate-700 text-[11px]">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" /> Instant Mobile Confirmation
            </div>
            <div className="bg-slate-800/80 px-2.5 py-1 rounded-lg flex items-center gap-1.5 border border-slate-700 text-[11px]">
              <Navigation className="w-3.5 h-3.5 text-sky-400" /> Direct MRT Linkway Guides
            </div>
            <div className="bg-slate-800/80 px-2.5 py-1 rounded-lg flex items-center gap-1.5 border border-slate-700 text-[11px]">
              <CloudRain className="w-3.5 h-3.5 text-amber-400" /> Weather-Guaranteed Options
            </div>
          </div>
        </div>

        {/* Pass Upgrade Callout */}
        <div className="bg-slate-800/90 border border-slate-700 p-4 rounded-2xl md:w-72 shrink-0 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-1.5 text-amber-400 text-xs font-bold">
              <Crown className="w-4 h-4" />
              <span>{isPro ? 'Tourist Pass+ Perks Active' : 'Save 10-15% on Tickets'}</span>
            </div>
            <p className="text-[11px] text-slate-300 mt-1">
              {isPro
                ? 'Your exclusive promo discount codes for Gardens by the Bay, Cable Car & Mandai Wildlife are unlocked below.'
                : 'Unlock official Singapore partner discount vouchers and save up to S$65+ across top attractions.'}
            </p>
          </div>

          <button
            onClick={onOpenSubscriptionModal}
            className={`mt-3 w-full py-2 px-3 rounded-xl text-xs font-bold transition-colors flex items-center justify-center gap-1.5 ${
              isPro
                ? 'bg-amber-500 hover:bg-amber-600 text-slate-900'
                : 'bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white shadow-xs'
            }`}
          >
            <Tag className="w-3.5 h-3.5" />
            <span>{isPro ? 'View All 6 Unlocked Vouchers' : 'Unlock Tourist Pass+'}</span>
          </button>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-white rounded-2xl border border-slate-200/90 p-4 shadow-xs space-y-3">
        <div className="flex flex-col md:flex-row gap-2.5">
          {/* Search Input */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search attractions by name, MRT station, or area (e.g. Gardens, Bayfront, Sentosa)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-900 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:ring-1 focus:ring-slate-900 focus:border-slate-900"
            />
          </div>

          {/* Weather Filter Buttons */}
          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl shrink-0">
            <button
              onClick={() => setWeatherFilter('all')}
              className={`text-xs font-semibold px-2.5 py-1 rounded-lg transition-all ${
                weatherFilter === 'all'
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              All Weather
            </button>
            <button
              onClick={() => setWeatherFilter('rain-proof')}
              className={`text-xs font-semibold px-2.5 py-1 rounded-lg transition-all flex items-center gap-1 ${
                weatherFilter === 'rain-proof'
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <CloudRain className="w-3 h-3 text-sky-400" /> 100% Rainproof
            </button>
            <button
              onClick={() => setWeatherFilter('outdoor')}
              className={`text-xs font-semibold px-2.5 py-1 rounded-lg transition-all flex items-center gap-1 ${
                weatherFilter === 'outdoor'
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Sun className="w-3 h-3 text-amber-400" /> Outdoor Scenic
            </button>
          </div>
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 pt-0.5 no-scrollbar">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`text-xs font-medium px-3 py-1.5 rounded-xl whitespace-nowrap transition-all ${
                selectedCategory === cat.id
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'bg-slate-50 text-slate-600 hover:bg-slate-100 hover:text-slate-900 border border-slate-200/80'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Attractions Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredAttractions.map((attr) => {
          const isAdded = addedAttractionIds.includes(attr.id);

          return (
            <div
              key={attr.id}
              className="bg-white rounded-2xl border border-slate-200/90 overflow-hidden shadow-xs hover:border-slate-300 transition-all flex flex-col justify-between group"
            >
              <div>
                {/* Image Container with Badges */}
                <div className="relative h-48 overflow-hidden bg-slate-100 cursor-pointer" onClick={() => onSelectAttractionDetail(attr)}>
                  <img
                    src={attr.imageUrl}
                    alt={attr.name}
                    className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-300"
                    referrerPolicy="no-referrer"
                  />
                  {/* Category Pill */}
                  <div className="absolute top-2.5 left-2.5 bg-slate-950/80 backdrop-blur text-white text-[10px] font-semibold px-2 py-0.5 rounded-lg">
                    {attr.categoryLabel}
                  </div>

                  {/* Price Tag Badge */}
                  <div className="absolute bottom-2.5 right-2.5 bg-white text-slate-900 font-bold text-xs px-2.5 py-1 rounded-lg shadow-xs">
                    {attr.priceSGD === 0 ? 'FREE' : `From S$${attr.priceSGD}`}
                  </div>

                  {/* Weather Protection Tag */}
                  {attr.rainProofScore >= 4 && (
                    <div className="absolute bottom-2.5 left-2.5 bg-slate-900/90 text-emerald-400 text-[10px] font-semibold px-2 py-0.5 rounded flex items-center gap-1">
                      <ShieldCheck className="w-3 h-3 text-emerald-400" /> Rain-Proof
                    </div>
                  )}
                </div>

                {/* Body Content */}
                <div className="p-4 sm:p-4.5">
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-1 text-amber-500 text-xs font-semibold">
                      <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                      <span>{attr.rating}</span>
                      <span className="text-slate-400 font-normal">({attr.reviewCount.toLocaleString()})</span>
                    </div>
                    <span className="text-[10px] font-medium text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
                      {attr.area}
                    </span>
                  </div>

                  <h3
                    onClick={() => onSelectAttractionDetail(attr)}
                    className="text-base font-bold text-slate-900 mt-1 hover:text-amber-600 cursor-pointer transition-colors line-clamp-1"
                  >
                    {attr.name}
                  </h3>
                  {attr.chineseName && (
                    <span className="text-xs text-slate-400 font-normal block">
                      {attr.chineseName}
                    </span>
                  )}

                  <p className="text-xs text-slate-600 mt-1.5 line-clamp-2 leading-relaxed">
                    {attr.description}
                  </p>

                  {/* Highlights Bullet List */}
                  <div className="mt-3 pt-2.5 border-t border-slate-100 space-y-1">
                    {attr.ticketHighlights.slice(0, 2).map((hl, i) => (
                      <div key={i} className="flex items-center gap-1.5 text-[11px] text-slate-600">
                        <span className="w-1.5 h-1.5 rounded-full bg-slate-400 shrink-0" />
                        <span className="truncate">{hl}</span>
                      </div>
                    ))}
                  </div>

                  {/* Nearest MRT Station Indicator */}
                  <div className="mt-3 flex items-center gap-1.5 text-xs bg-slate-50 p-2 rounded-xl border border-slate-100">
                    <Navigation className="w-3 h-3 text-slate-700 shrink-0" />
                    <span className="font-semibold text-slate-800 truncate text-[11px]">
                      {attr.nearestMrt.stationName} MRT
                    </span>
                    <div className="flex gap-0.5 ml-auto">
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
                  </div>

                  {/* Promo Code Strip if Available */}
                  {(() => {
                    const matchedVoucher = EXCLUSIVE_PROMO_VOUCHERS.find(v => 
                      attr.name.toLowerCase().includes(v.attractionName.split(' ')[0].toLowerCase()) ||
                      (attr.id === 'gardens-by-the-bay' && v.id === 'voucher-gardens') ||
                      (attr.id === 'artscience-museum' && v.id === 'voucher-artscience') ||
                      (attr.id === 'singapore-flyer' && v.id === 'voucher-flyer') ||
                      (attr.id === 'singapore-zoo' && v.id === 'voucher-mandai') ||
                      (attr.id === 'sentosa-cable-car' && v.id === 'voucher-cablecar')
                    );

                    if (!matchedVoucher) return null;

                    return (
                      <div className="mt-2.5 bg-amber-50/80 border border-amber-200/80 rounded-xl p-2 flex items-center justify-between gap-2">
                        <div className="flex items-center gap-1.5 overflow-hidden">
                          <Tag className="w-3 h-3 text-amber-600 shrink-0" />
                          <div className="truncate">
                            <span className="text-[10px] font-bold text-amber-900 block truncate">
                              {isPro ? `${matchedVoucher.discountPercentage}% Discount Code:` : `Save ${matchedVoucher.discountPercentage}% with Pass+`}
                            </span>
                            {isPro && (
                              <code className="text-[10px] font-mono font-bold text-slate-800 bg-white px-1 py-0.2 rounded border border-amber-200">
                                {matchedVoucher.promoCode}
                              </code>
                            )}
                          </div>
                        </div>

                        {isPro ? (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleCopyVoucher(matchedVoucher.promoCode);
                            }}
                            className="shrink-0 text-[10px] font-bold text-amber-800 hover:text-amber-900 bg-white hover:bg-amber-100 border border-amber-200 px-2 py-1 rounded-lg transition-colors flex items-center gap-1"
                          >
                            {copiedCode === matchedVoucher.promoCode ? (
                              <>
                                <CheckCheck className="w-3 h-3 text-emerald-600" /> Copied
                              </>
                            ) : (
                              <>
                                <Copy className="w-3 h-3" /> Copy
                              </>
                            )}
                          </button>
                        ) : (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              onOpenSubscriptionModal();
                            }}
                            className="shrink-0 text-[10px] font-bold text-amber-800 hover:text-amber-900 underline"
                          >
                            Unlock
                          </button>
                        )}
                      </div>
                    );
                  })()}
                </div>
              </div>

              {/* Action Buttons Footer */}
              <div className="p-4 pt-0 sm:p-4.5 sm:pt-0 flex items-center gap-2">
                <button
                  onClick={() => onAddToItinerary(attr)}
                  className={`flex-1 text-xs font-semibold py-2 px-3 rounded-xl transition-all flex items-center justify-center gap-1.5 ${
                    isAdded
                      ? 'bg-slate-100 text-slate-800 border border-slate-300'
                      : 'bg-slate-100 hover:bg-slate-200 text-slate-800'
                  }`}
                >
                  {isAdded ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Added to Plan</span>
                    </>
                  ) : (
                    <>
                      <Plus className="w-3.5 h-3.5" />
                      <span>Add to Plan</span>
                    </>
                  )}
                </button>

                <button
                  onClick={() => onSelectAttractionDetail(attr)}
                  className="bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs py-2 px-3.5 rounded-xl transition-colors shadow-xs flex items-center gap-1"
                >
                  <Ticket className="w-3 h-3 text-amber-400" />
                  <span>Tickets</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
