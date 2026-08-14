import { 
  X, 
  Star, 
  MapPin, 
  Navigation, 
  Clock, 
  ShieldCheck, 
  Ticket, 
  ExternalLink, 
  CheckCircle2, 
  Utensils, 
  Bus, 
  CloudRain, 
  Sun,
  Plus,
  Check
} from 'lucide-react';
import { Attraction } from '../types';

interface AttractionModalProps {
  attraction: Attraction | null;
  onClose: () => void;
  onAddToItinerary: (attraction: Attraction) => void;
  isAdded: boolean;
}

export function AttractionModal({
  attraction,
  onClose,
  onAddToItinerary,
  isAdded
}: AttractionModalProps) {
  if (!attraction) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-2xl rounded-2xl overflow-hidden shadow-xl border border-slate-200 flex flex-col max-h-[90vh]">
        {/* Modal Header Image */}
        <div className="relative h-60 bg-slate-900 shrink-0">
          <img
            src={attraction.imageUrl}
            alt={attraction.name}
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/20 to-transparent" />

          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 bg-slate-950/60 hover:bg-slate-950 text-white rounded-full p-2 backdrop-blur transition-all"
          >
            <X className="w-4 h-4" />
          </button>

          {/* Header Info Overlay */}
          <div className="absolute bottom-4 left-4 right-4 text-white">
            <div className="flex flex-wrap items-center gap-2">
              <span className="bg-slate-800 text-amber-400 font-bold text-[10px] px-2 py-0.5 rounded border border-slate-700">
                {attraction.categoryLabel}
              </span>
              <span className="bg-white/20 backdrop-blur text-white font-medium text-[10px] px-2 py-0.5 rounded">
                {attraction.area}
              </span>
              {attraction.rainProofScore >= 4 && (
                <span className="bg-slate-900/90 text-emerald-400 font-semibold text-[10px] px-2 py-0.5 rounded flex items-center gap-1 border border-slate-700">
                  <ShieldCheck className="w-3 h-3 text-emerald-400" /> 100% Rainproof Domes
                </span>
              )}
            </div>

            <h2 className="text-xl font-bold text-white mt-1.5">
              {attraction.name}
            </h2>
            {attraction.chineseName && (
              <span className="text-xs text-white/80 font-normal">
                {attraction.chineseName}
              </span>
            )}
          </div>
        </div>

        {/* Scrollable Content Body */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-5 text-xs text-slate-700">
          {/* Rating, Price & Opening Hours Bar */}
          <div className="grid grid-cols-3 gap-3 bg-slate-50 p-3 rounded-xl border border-slate-100 text-center">
            <div>
              <span className="text-slate-400 text-[10px] block">Visitor Rating</span>
              <span className="text-sm font-bold text-amber-600 mt-0.5 flex items-center justify-center gap-1">
                <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" /> {attraction.rating}
              </span>
              <span className="text-[10px] text-slate-400">({attraction.reviewCount.toLocaleString()} reviews)</span>
            </div>

            <div>
              <span className="text-slate-400 text-[10px] block">Admission Price</span>
              <span className="text-sm font-bold text-slate-900 mt-0.5 block">
                {attraction.priceSGD === 0 ? 'FREE Entry' : `S$${attraction.priceSGD}`}
              </span>
              <span className="text-[10px] text-slate-400">Adult Standard</span>
            </div>

            <div>
              <span className="text-slate-400 text-[10px] block">Dwell Duration</span>
              <span className="text-sm font-bold text-slate-800 mt-0.5 block">
                {attraction.recommendedDurationHours} Hours
              </span>
              <span className="text-[10px] text-slate-400">Recommended</span>
            </div>
          </div>

          {/* Description */}
          <div>
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-1">About This Attraction</h3>
            <p className="leading-relaxed text-slate-600 text-xs">
              {attraction.description}
            </p>
          </div>

          {/* Ticket Inclusions */}
          <div className="bg-slate-50 border border-slate-200/80 rounded-xl p-3.5">
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <Ticket className="w-3.5 h-3.5 text-amber-500" /> Official Ticket Inclusions & Highlights
            </h3>
            <ul className="space-y-1.5">
              {attraction.ticketHighlights.map((hl, i) => (
                <li key={i} className="flex items-center gap-2 text-xs text-slate-700 font-medium">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span>{hl}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Transit & Access Guide */}
          <div className="border border-slate-200 rounded-xl p-3.5 space-y-2.5">
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
              <Navigation className="w-3.5 h-3.5 text-slate-700" /> Singapore Public Transit Directions
            </h3>

            {/* MRT */}
            <div className="flex items-start gap-2.5 bg-slate-50 p-2.5 rounded-lg border border-slate-100">
              <div className="p-1 rounded bg-slate-200 text-slate-800 shrink-0 font-bold text-[10px]">
                MRT
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="font-semibold text-slate-900 text-xs">
                    {attraction.nearestMrt.stationName} Station
                  </span>
                  <div className="flex gap-1">
                    {attraction.nearestMrt.code.map((c, i) => (
                      <span
                        key={c}
                        style={{ backgroundColor: attraction.nearestMrt.lineColors[i] || '#005ec4' }}
                        className="text-white text-[9px] font-bold px-1.5 py-0.2 rounded"
                      >
                        {c}
                      </span>
                    ))}
                  </div>
                </div>
                <p className="text-slate-500 text-[10px] mt-0.5">
                  {attraction.nearestMrt.exit} • {attraction.nearestMrt.walkMinutes} min walk (Sheltered linkway available)
                </p>
              </div>
            </div>

            {/* Bus */}
            {attraction.busStops && attraction.busStops.length > 0 && (
              <div className="flex items-start gap-2.5 bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                <div className="p-1 rounded bg-slate-200 text-slate-800 shrink-0 font-bold text-[10px]">
                  BUS
                </div>
                <div className="text-xs">
                  <span className="font-semibold text-slate-900 text-xs">
                    Stop #{attraction.busStops[0].stopCode}: {attraction.busStops[0].description}
                  </span>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {attraction.busStops[0].services.map((svc) => (
                      <span key={svc} className="bg-white border border-slate-200 text-slate-800 font-mono font-semibold text-[10px] px-1.5 py-0.2 rounded">
                        Bus {svc}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Insider Tip */}
          <div className="bg-slate-900 text-white rounded-xl p-3.5 border border-slate-800">
            <div className="flex items-center gap-1.5 text-amber-400 font-bold text-xs mb-1">
              <Sun className="w-3.5 h-3.5" /> Local Insider Tip
            </div>
            <p className="text-slate-300 text-xs leading-relaxed font-normal">
              {attraction.insiderTip}
            </p>
          </div>
        </div>

        {/* Modal Footer Controls */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between gap-3 shrink-0">
          <button
            onClick={() => onAddToItinerary(attraction)}
            className={`flex-1 font-semibold text-xs py-2.5 px-4 rounded-xl transition-all flex items-center justify-center gap-2 ${
              isAdded
                ? 'bg-slate-100 text-slate-800 border border-slate-300'
                : 'bg-slate-900 hover:bg-slate-800 text-white shadow-xs'
            }`}
          >
            {isAdded ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-600" />
                <span>Added to Your Itinerary</span>
              </>
            ) : (
              <>
                <Plus className="w-3.5 h-3.5" />
                <span>Add to Day Plan</span>
              </>
            )}
          </button>

          {attraction.ticketLink && (
            <a
              href={attraction.ticketLink}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs py-2.5 px-4 rounded-xl shadow-xs transition-colors flex items-center gap-1.5 shrink-0"
            >
              <Ticket className="w-3.5 h-3.5 text-amber-400" />
              <span>Official Tickets</span>
              <ExternalLink className="w-3 h-3 ml-0.5" />
            </a>
          )}
        </div>
      </div>
    </div>
  );
}
