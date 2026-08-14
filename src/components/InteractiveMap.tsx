import { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import { MapPin, Navigation, Star, Ticket, CloudRain, Sun, ShieldCheck, Layers, ExternalLink } from 'lucide-react';
import { Attraction, GeneratedItinerary, WeatherCondition } from '../types';
import { ATTRACTIONS_DATA, MOCK_LIVE_WEATHER } from '../data/singaporeData';

interface InteractiveMapProps {
  itinerary?: GeneratedItinerary;
  weather?: WeatherCondition | null;
  onSelectAttractionDetail: (attraction: Attraction) => void;
  onAddToItinerary: (attraction: Attraction) => void;
}

export function InteractiveMap({
  itinerary,
  weather,
  onSelectAttractionDetail,
  onAddToItinerary
}: InteractiveMapProps) {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markersLayerRef = useRef<L.LayerGroup | null>(null);
  const routeLayerRef = useRef<L.Polyline | null>(null);

  const [activeFilter, setActiveFilter] = useState<'all' | 'rain-proof' | 'itinerary'>('all');
  const [selectedAttraction, setSelectedAttraction] = useState<Attraction | null>(null);

  // Initialize Map
  useEffect(() => {
    if (!mapContainerRef.current) return;
    if (mapInstanceRef.current) return; // already initialized

    // Center on Singapore
    const map = L.map(mapContainerRef.current, {
      center: [1.3200, 103.8400],
      zoom: 12,
      zoomControl: true,
      attributionControl: false
    });

    // Clean OpenStreetMap tiles
    L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
      maxZoom: 19,
      subdomains: 'abcd',
    }).addTo(map);

    const markersGroup = L.layerGroup().addTo(map);
    markersLayerRef.current = markersGroup;
    mapInstanceRef.current = map;

    return () => {
      map.remove();
      mapInstanceRef.current = null;
    };
  }, []);

  // Update Markers based on filter and attractions
  useEffect(() => {
    if (!mapInstanceRef.current || !markersLayerRef.current) return;

    const markersGroup = markersLayerRef.current;
    markersGroup.clearLayers();

    // If polyline exists, remove it
    if (routeLayerRef.current) {
      mapInstanceRef.current.removeLayer(routeLayerRef.current);
      routeLayerRef.current = null;
    }

    let targetAttractions = ATTRACTIONS_DATA;

    if (activeFilter === 'rain-proof') {
      targetAttractions = ATTRACTIONS_DATA.filter((a) => a.rainProofScore >= 4);
    } else if (activeFilter === 'itinerary' && itinerary?.days?.[0]?.items) {
      targetAttractions = itinerary.days[0].items.map((i) => i.attraction);
    }

    targetAttractions.forEach((attr) => {
      const isRainproof = attr.rainProofScore >= 4;
      const markerColor = isRainproof ? '#059669' : (attr.category === 'landmark' ? '#d97706' : '#2563eb');

      // Create Custom HTML Icon
      const customIcon = L.divIcon({
        className: 'custom-map-pin',
        html: `
          <div style="
            background-color: ${markerColor};
            color: white;
            padding: 6px 10px;
            border-radius: 12px;
            font-size: 11px;
            font-weight: 800;
            white-space: nowrap;
            box-shadow: 0 4px 12px rgba(0,0,0,0.25);
            display: flex;
            align-items: center;
            gap: 4px;
            border: 2px solid white;
            cursor: pointer;
          ">
            <span>${isRainproof ? '🌧️' : '📍'}</span>
            <span>${attr.name.split(' ')[0]}</span>
          </div>
        `,
        iconSize: [80, 30],
        iconAnchor: [40, 15]
      });

      const marker = L.marker([attr.coordinates.lat, attr.coordinates.lng], { icon: customIcon });
      marker.on('click', () => {
        setSelectedAttraction(attr);
      });

      markersGroup.addLayer(marker);
    });

    // Draw route polyline if itinerary mode
    if (activeFilter === 'itinerary' && itinerary?.days?.[0]?.items?.length) {
      const latlngs = itinerary.days[0].items.map((item) => [
        item.attraction.coordinates.lat,
        item.attraction.coordinates.lng
      ] as [number, number]);

      if (latlngs.length > 1) {
        const polyline = L.polyline(latlngs, {
          color: '#d97706',
          weight: 4,
          dashArray: '8, 8',
          opacity: 0.85
        }).addTo(mapInstanceRef.current);

        routeLayerRef.current = polyline;
        mapInstanceRef.current.fitBounds(polyline.getBounds(), { padding: [40, 40] });
      }
    }
  }, [activeFilter, itinerary]);

  return (
    <div className="space-y-4">
      {/* Map Control Bar */}
      <div className="bg-white rounded-2xl border border-slate-200/90 p-4 shadow-xs flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-slate-100 text-slate-800 flex items-center justify-center font-bold">
            <MapPin className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
              Interactive Singapore Map & Weather Radar
            </h3>
            <p className="text-xs text-slate-500">
              Inspect ticket inclusions, nearest MRT station, and weather protection.
            </p>
          </div>
        </div>

        {/* Filters */}
        <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl">
          <button
            onClick={() => setActiveFilter('all')}
            className={`text-xs font-semibold px-2.5 py-1 rounded-lg transition-all ${
              activeFilter === 'all'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            All Spots
          </button>
          <button
            onClick={() => setActiveFilter('rain-proof')}
            className={`text-xs font-semibold px-2.5 py-1 rounded-lg transition-all flex items-center gap-1 ${
              activeFilter === 'rain-proof'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <ShieldCheck className="w-3 h-3 text-emerald-400" /> 100% Rainproof
          </button>
          <button
            onClick={() => setActiveFilter('itinerary')}
            className={`text-xs font-semibold px-2.5 py-1 rounded-lg transition-all flex items-center gap-1 ${
              activeFilter === 'itinerary'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Navigation className="w-3 h-3 text-amber-400" /> Day Route Line
          </button>
        </div>
      </div>

      {/* Map Display Box */}
      <div className="relative w-full h-[520px] rounded-2xl overflow-hidden border border-slate-200 shadow-xs bg-slate-100">
        <div ref={mapContainerRef} className="w-full h-full" />

        {/* Selected Attraction Popup Overlay */}
        {selectedAttraction && (
          <div className="absolute bottom-4 left-4 right-4 sm:left-auto sm:right-4 sm:w-88 bg-white/95 backdrop-blur-md rounded-2xl border border-slate-200 p-4 shadow-xl z-[1000] animate-in fade-in slide-in-from-bottom-4 duration-200">
            <div className="flex items-start justify-between gap-2">
              <div>
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider bg-slate-100 px-2 py-0.5 rounded">
                  {selectedAttraction.categoryLabel}
                </span>
                <h4 className="text-sm font-bold text-slate-900 mt-1">
                  {selectedAttraction.name}
                </h4>
              </div>
              <button
                onClick={() => setSelectedAttraction(null)}
                className="text-slate-400 hover:text-slate-600 text-xs font-bold p-1"
              >
                ✕
              </button>
            </div>

            <div className="mt-2 flex items-center gap-2 text-xs">
              <span className="font-semibold text-amber-600 flex items-center gap-0.5">
                <Star className="w-3 h-3 fill-amber-400 text-amber-400" /> {selectedAttraction.rating}
              </span>
              <span className="text-slate-300">•</span>
              <span className="font-bold text-slate-900">
                {selectedAttraction.priceSGD === 0 ? 'FREE' : `From S$${selectedAttraction.priceSGD}`}
              </span>
              {selectedAttraction.rainProofScore >= 4 && (
                <span className="ml-auto bg-slate-100 text-slate-700 text-[10px] font-medium px-1.5 py-0.2 rounded border border-slate-200">
                  🌧️ Rainproof
                </span>
              )}
            </div>

            <p className="text-xs text-slate-600 mt-1.5 line-clamp-2 leading-relaxed">
              {selectedAttraction.description}
            </p>

            {/* MRT badge */}
            <div className="mt-2.5 flex items-center gap-1.5 text-xs bg-slate-50 p-2 rounded-lg border border-slate-100">
              <Navigation className="w-3 h-3 text-slate-700 shrink-0" />
              <span className="font-medium text-slate-800 text-[11px]">
                {selectedAttraction.nearestMrt.stationName} MRT ({selectedAttraction.nearestMrt.walkMinutes} min walk)
              </span>
            </div>

            <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center gap-2">
              <button
                onClick={() => onSelectAttractionDetail(selectedAttraction)}
                className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold text-xs py-2 px-3 rounded-xl transition-colors text-center"
              >
                View Details
              </button>
              <button
                onClick={() => onAddToItinerary(selectedAttraction)}
                className="bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs py-2 px-3 rounded-xl transition-colors shadow-xs"
              >
                + Add to Plan
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
