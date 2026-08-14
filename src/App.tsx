import { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { WeatherWidget } from './components/WeatherWidget';
import { ItineraryView } from './components/ItineraryView';
import { AttractionsExplorer } from './components/AttractionsExplorer';
import { TransitTracker } from './components/TransitTracker';
import { InteractiveMap } from './components/InteractiveMap';
import { AIConciergeView } from './components/AIConciergeView';
import { AttractionModal } from './components/AttractionModal';
import { SubscriptionModal } from './components/SubscriptionModal';
import { DisqusForum } from './components/DisqusForum';
import { Attraction, GeneratedItinerary, WeatherCondition, SubscriptionTier } from './types';
import { ATTRACTIONS_DATA, MOCK_LIVE_WEATHER } from './data/singaporeData';
import { Sparkles, CheckCircle2, ShieldCheck, Heart } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState<'planner' | 'map' | 'tickets' | 'transit' | 'concierge'>('planner');
  const [weather, setWeather] = useState<WeatherCondition | null>(MOCK_LIVE_WEATHER['Marina Bay']);
  const [selectedScenario, setSelectedScenario] = useState<string>('sunny');
  const [isWeatherLoading, setIsWeatherLoading] = useState<boolean>(false);
  const [isItineraryLoading, setIsItineraryLoading] = useState<boolean>(false);
  
  // Subscription Plan State
  const [subscriptionTier, setSubscriptionTier] = useState<SubscriptionTier>('free');
  const [isSubscriptionModalOpen, setIsSubscriptionModalOpen] = useState<boolean>(false);

  // Selected Attraction for modal
  const [modalAttraction, setModalAttraction] = useState<Attraction | null>(null);
  const [addedAttractionIds, setAddedAttractionIds] = useState<string[]>([
    'gardens-by-the-bay',
    'mbs-skypark',
    'artscience-museum'
  ]);

  // Active Itinerary State
  const [itinerary, setItinerary] = useState<GeneratedItinerary>({
    id: 'itin-default',
    title: 'Sunny Singapore Iconic Landmarks & Waterfront Marvels',
    theme: 'Future-forward architecture, giant conservatories, and sky-high observation decks.',
    pacing: 'balanced',
    travelGroup: 'couple',
    overallTips: [
      'Simply tap your foreign or local Visa/Mastercard or Apple Pay at every MRT gantry with SimplyGo.',
      'Bayfront MRT (DT16/CE1) connects directly underground to Marina Bay Sands and Gardens by the Bay.',
      'Catch the free Garden Rhapsody light show at Supertree Grove at 7:45 PM and 8:45 PM daily.'
    ],
    weatherAlerts: [
      '☀️ Fair tropical weather expected (31°C). Peak UV around midday; stay hydrated.'
    ],
    transitAdvice: 'Take the Downtown Line (Blue) or Circle Line (Orange) to Bayfront for seamless underground sheltered access.',
    days: [
      {
        dayNumber: 1,
        title: 'Marina Bay & Architectural Icons',
        summary: 'Explore Singapore’s most famous landmarks with covered walkways and air-conditioned domes.',
        weatherOverview: 'Fair & Sunny (31°C)',
        shelterRating: 'High',
        totalEstCostSGD: 89,
        items: [
          {
            id: 'item-1',
            timeSlot: '09:30 - 12:30',
            attraction: ATTRACTIONS_DATA.find(a => a.id === 'gardens-by-the-bay') || ATTRACTIONS_DATA[0],
            weatherForecast: 'Partly Sunny (29°C)',
            weatherIcon: 'sun',
            rainRisk: 'low',
            isIndoorSheltered: true,
            recommendedActivity: 'Walk through the misty 35m waterfall inside the Cloud Forest and Flower Dome (cooled to 23°C).',
            mealSuggestion: {
              name: 'Satay by the Bay',
              cuisine: 'Local Singapore Hawker BBQ',
              location: 'Adjacent to Gardens by the Bay',
              famousDish: 'Hainanese Pork & Chicken Satay',
              budgetSGD: 'S$8 - S$14'
            }
          },
          {
            id: 'item-2',
            timeSlot: '13:30 - 15:30',
            attraction: ATTRACTIONS_DATA.find(a => a.id === 'artscience-museum') || ATTRACTIONS_DATA[2],
            weatherForecast: 'Passing Clouds (31°C)',
            weatherIcon: 'cloud',
            rainRisk: 'low',
            isIndoorSheltered: true,
            recommendedActivity: 'Immerse in the teamLab Future World interactive digital crystal light rooms in air-conditioned comfort.',
            mealSuggestion: {
              name: 'Rasapura Masters (MBS Food Court)',
              cuisine: 'Pan-Asian Gourmet Hawker',
              location: 'The Shoppes at Marina Bay Sands B2',
              famousDish: 'Bak Kut Teh & Beef Noodles',
              budgetSGD: 'S$10 - S$18'
            }
          },
          {
            id: 'item-3',
            timeSlot: '16:30 - 18:30',
            attraction: ATTRACTIONS_DATA.find(a => a.id === 'mbs-skypark') || ATTRACTIONS_DATA[1],
            weatherForecast: 'Golden Hour Sunset (30°C)',
            weatherIcon: 'sun',
            rainRisk: 'low',
            isIndoorSheltered: false,
            recommendedActivity: 'Catch 360-degree panoramic skyline views 57 levels above Singapore as the sunset turns into city lights.',
            mealSuggestion: {
              name: 'Lau Pa Sat Satay Street',
              cuisine: 'Heritage Victorian Hawker',
              location: 'Raffles Place MRT (10 min away)',
              famousDish: 'Street BBQ Satay (Stall 7 & 8)',
              budgetSGD: 'S$12 - S$20'
            }
          },
          {
            id: 'item-4',
            timeSlot: '19:30 - 21:00',
            attraction: ATTRACTIONS_DATA.find(a => a.id === 'singapore-river-cruise') || ATTRACTIONS_DATA[10],
            weatherForecast: 'Breezy Night (28°C)',
            weatherIcon: 'moon',
            rainRisk: 'none',
            isIndoorSheltered: true,
            recommendedActivity: 'Take a covered historic electric bumboat ride down the Singapore River passing Clarke Quay and the Merlion.',
            mealSuggestion: {
              name: 'Jumbo Seafood (Riverside)',
              cuisine: 'Iconic Singapore Seafood',
              location: 'Clarke Quay Waterfront',
              famousDish: 'Singapore Chilli Crab with Fried Buns',
              budgetSGD: 'S$40 - S$75'
            }
          }
        ]
      }
    ]
  });

  // Notification Toast
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Fetch Live Weather from Server API
  const fetchLiveWeather = async (area: string = 'Marina Bay') => {
    setIsWeatherLoading(true);
    try {
      const resp = await fetch(`/api/weather?area=${encodeURIComponent(area)}`);
      if (resp.ok) {
        const data = await resp.json();
        setWeather(data);
      }
    } catch (err) {
      console.error('Weather fetch error:', err);
    } finally {
      setIsWeatherLoading(false);
    }
  };

  useEffect(() => {
    fetchLiveWeather('Marina Bay');
  }, []);

  // Generate Itinerary API Handler
  const handleGenerateItinerary = async (options: {
    duration: string;
    pacing: 'relaxed' | 'balanced' | 'packed';
    travelGroup: 'solo' | 'couple' | 'family' | 'seniors';
    startLocation: string;
  }) => {
    setIsItineraryLoading(true);
    try {
      const resp = await fetch('/api/itinerary/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...options,
          weatherCondition: selectedScenario
        })
      });

      if (resp.ok) {
        const data = await resp.json();
        setItinerary(data);
        showToast('✨ New dynamic itinerary generated!');
      }
    } catch (err) {
      console.error('Itinerary generation error:', err);
    } finally {
      setIsItineraryLoading(false);
    }
  };

  // Instant Rain Reroute Action
  const handleInstantRainReroute = () => {
    setSelectedScenario('afternoon-rain');
    handleGenerateItinerary({
      duration: '1day',
      pacing: itinerary.pacing,
      travelGroup: itinerary.travelGroup,
      startLocation: 'Marina Bay'
    });
    showToast('🌧️ 100% Rain-Proof Itinerary Activated!');
  };

  // Swap specific attraction in itinerary
  const handleSwapAttraction = (dayNumber: number, itemId: string, targetAttractionId: string) => {
    const targetAttr = ATTRACTIONS_DATA.find(a => a.id === targetAttractionId);
    if (!targetAttr) return;

    setItinerary(prev => ({
      ...prev,
      days: prev.days.map(day => {
        if (day.dayNumber !== dayNumber) return day;
        const newItems = day.items.map(item => {
          if (item.id === itemId) {
            return {
              ...item,
              attraction: targetAttr,
              isIndoorSheltered: targetAttr.rainProofScore >= 4,
              recommendedActivity: `Visit ${targetAttr.name} with direct sheltered connection from ${targetAttr.nearestMrt.stationName} MRT.`
            };
          }
          return item;
        });
        return {
          ...day,
          items: newItems,
          totalEstCostSGD: newItems.reduce((sum, it) => sum + it.attraction.priceSGD, 0)
        };
      })
    }));

    showToast(`🔄 Swapped to ${targetAttr.name}!`);
  };

  // Add attraction from tickets hub
  const handleAddToItinerary = (attraction: Attraction) => {
    if (addedAttractionIds.includes(attraction.id)) {
      setAddedAttractionIds(prev => prev.filter(id => id !== attraction.id));
      showToast(`Removed ${attraction.name} from plan`);
    } else {
      setAddedAttractionIds(prev => [...prev, attraction.id]);

      // Add to Day 1 items
      const newItem = {
        id: `custom-item-${Date.now()}`,
        timeSlot: '16:00 - 18:00',
        attraction,
        weatherForecast: 'Passing Clouds (31°C)',
        weatherIcon: 'sun',
        rainRisk: 'low' as const,
        isIndoorSheltered: attraction.rainProofScore >= 4,
        recommendedActivity: `Experience ${attraction.name} via ${attraction.nearestMrt.stationName} MRT.`
      };

      setItinerary(prev => ({
        ...prev,
        days: prev.days.map((day, idx) => {
          if (idx === 0) {
            const updated = [...day.items, newItem];
            return {
              ...day,
              items: updated,
              totalEstCostSGD: updated.reduce((s, it) => s + it.attraction.priceSGD, 0)
            };
          }
          return day;
        })
      }));

      showToast(`➕ Added ${attraction.name} to Day Plan!`);
    }
  };

  // Plan Selection Handler
  const handleSelectPlan = (tier: SubscriptionTier) => {
    setSubscriptionTier(tier);
    if (tier === 'tourist-pass') {
      showToast('🎉 Activated Tourist Pass+ (3-7 Day Access & Vouchers)!');
    } else if (tier === 'resident-pro') {
      showToast('💎 Activated SG Resident VIP Pass!');
    } else {
      showToast('Switched to Free Explorer Plan.');
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col selection:bg-amber-500 selection:text-white">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white text-xs font-semibold px-4 py-2.5 rounded-xl shadow-lg border border-slate-800 flex items-center gap-2 animate-in fade-in slide-in-from-bottom-4 duration-200">
          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Main Navigation */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        weather={weather}
        onRefreshWeather={() => fetchLiveWeather()}
        isWeatherLoading={isWeatherLoading}
        subscriptionTier={subscriptionTier}
        onOpenSubscriptionModal={() => setIsSubscriptionModalOpen(true)}
      />

      {/* Main Viewport Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-6 sm:py-7">
        {/* Weather & Microclimate Banner (Global across views) */}
        <WeatherWidget
          weather={weather}
          selectedScenario={selectedScenario}
          onSelectScenario={(sc) => setSelectedScenario(sc)}
          onInstantReroute={handleInstantRainReroute}
        />

        {/* Tab Content Display */}
        {activeTab === 'planner' && (
          <ItineraryView
            itinerary={itinerary}
            isLoading={isItineraryLoading}
            onGenerateItinerary={handleGenerateItinerary}
            onSwapAttraction={handleSwapAttraction}
            onSelectAttractionDetail={(attr) => setModalAttraction(attr)}
            subscriptionTier={subscriptionTier}
            onOpenSubscriptionModal={() => setIsSubscriptionModalOpen(true)}
          />
        )}

        {activeTab === 'tickets' && (
          <AttractionsExplorer
            onSelectAttractionDetail={(attr) => setModalAttraction(attr)}
            onAddToItinerary={handleAddToItinerary}
            addedAttractionIds={addedAttractionIds}
            subscriptionTier={subscriptionTier}
            onOpenSubscriptionModal={() => setIsSubscriptionModalOpen(true)}
          />
        )}

        {activeTab === 'map' && (
          <InteractiveMap
            itinerary={itinerary}
            weather={weather}
            onSelectAttractionDetail={(attr) => setModalAttraction(attr)}
            onAddToItinerary={handleAddToItinerary}
          />
        )}

        {activeTab === 'transit' && (
          <TransitTracker />
        )}

        {activeTab === 'concierge' && (
          <AIConciergeView currentWeather={weather} />
        )}

        {/* Community & Traveler Discussion Forum (Disqus) */}
        <DisqusForum pageIdentifier="sunnysg-main-discussion" />
      </main>

      {/* Attraction Detail Modal */}
      <AttractionModal
        attraction={modalAttraction}
        onClose={() => setModalAttraction(null)}
        onAddToItinerary={handleAddToItinerary}
        isAdded={modalAttraction ? addedAttractionIds.includes(modalAttraction.id) : false}
      />

      {/* Subscription & Pass Management Modal */}
      <SubscriptionModal
        isOpen={isSubscriptionModalOpen}
        onClose={() => setIsSubscriptionModalOpen(false)}
        currentTier={subscriptionTier}
        onSelectPlan={handleSelectPlan}
      />

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200/90 mt-12 py-6 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-900 text-xs">Sunny SG Day Planner</span>
            <span>•</span>
            <span>Live NEA Weather, LTA DataMall, & Transit Feeds</span>
          </div>

          <div className="flex items-center gap-3 text-slate-400 text-xs">
            <span className="flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" /> WCAG 2.1 AA Compliant
            </span>
            <span>•</span>
            <span>Singapore Public Transit Network</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
