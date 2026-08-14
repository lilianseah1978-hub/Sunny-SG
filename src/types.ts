export interface Attraction {
  id: string;
  name: string;
  chineseName?: string;
  category: 'landmark' | 'indoor' | 'wildlife' | 'theme-park' | 'culture' | 'food' | 'nature';
  categoryLabel: string;
  description: string;
  imageUrl: string;
  rating: number;
  reviewCount: number;
  priceSGD: number;
  childPriceSGD?: number;
  ticketLink?: string;
  ticketHighlights: string[];
  recommendedDurationHours: number;
  openingHours: string;
  weatherSuitability: 'all-weather' | 'indoor-preferred' | 'outdoor-best' | 'rain-sheltered';
  rainProofScore: number; // 1 to 5 (5 is completely indoor sheltered)
  heatProofScore: number; // 1 to 5
  nearestMrt: {
    stationName: string;
    code: string[]; // e.g. ['DT16', 'CE1']
    lineColors: string[]; // e.g. ['#005ec4', '#fa9e0d']
    walkMinutes: number;
    exit?: string;
  };
  busStops?: {
    stopCode: string;
    description: string;
    services: string[];
  }[];
  coordinates: {
    lat: number;
    lng: number;
  };
  area: 'Marina Bay' | 'Sentosa' | 'Civic District' | 'Orchard' | 'Mandai' | 'Chinatown' | 'Bugis & Kampong Glam' | 'Changi' | 'Jurong' | 'Little India' | 'Botanic Gardens';
  insiderTip: string;
  indoorAlternativeId?: string; // If it rains, swap to this
  outdoorAlternativeId?: string; // If it clears up, swap to this
}

export interface WeatherCondition {
  area: string;
  forecast: string;
  general24HrForecast?: string;
  temperature: number;
  tempRange24Hr?: { low: number; high: number };
  relativeHumidity: number;
  rainfallMm: number;
  uvIndex: number;
  psi: number;
  pm25: number;
  lightningAlert: boolean;
  rainRisk: 'none' | 'low' | 'moderate' | 'heavy';
  icon: string;
  updatedAt: string;
}

export interface TransitStep {
  type: 'walk' | 'mrt' | 'bus';
  instruction: string;
  durationMinutes: number;
  lineCode?: string;
  lineName?: string;
  lineColor?: string;
  fromStationOrStop?: string;
  toStationOrStop?: string;
  stopsCount?: number;
  isSheltered?: boolean;
}

export interface RouteOption {
  originName: string;
  destinationName: string;
  totalDurationMinutes: number;
  totalDistanceKm: number;
  estimatedFareSGD: number;
  shelterScorePercent: number;
  steps: TransitStep[];
}

export interface ItineraryItem {
  id: string;
  timeSlot: string; // e.g. "09:30 - 11:30"
  attraction: Attraction;
  weatherForecast: string;
  weatherIcon: string;
  rainRisk: 'none' | 'low' | 'moderate' | 'heavy';
  isIndoorSheltered: boolean;
  transitFromPrevious?: RouteOption;
  recommendedActivity: string;
  mealSuggestion?: {
    name: string;
    cuisine: string;
    location: string;
    famousDish: string;
    budgetSGD: string;
  };
}

export interface DayItinerary {
  dayNumber: number;
  title: string;
  dateStr?: string;
  summary: string;
  weatherOverview: string;
  items: ItineraryItem[];
  totalEstCostSGD: number;
  shelterRating: 'High' | 'Medium' | 'Low';
}

export interface GeneratedItinerary {
  id: string;
  title: string;
  theme: string;
  pacing: 'relaxed' | 'balanced' | 'packed';
  travelGroup: 'solo' | 'couple' | 'family' | 'seniors';
  days: DayItinerary[];
  overallTips: string[];
  weatherAlerts: string[];
  transitAdvice: string;
}

export interface BusArrivalInfo {
  busStopCode: string;
  roadName: string;
  description: string;
  services: {
    serviceNo: string;
    operator: string;
    nextBus: {
      estimatedArrival: string; // ISO or MM:SS
      etaMinutes: number;
      load: 'SEA' | 'SDA' | 'LSD'; // Seats Available, Standing Available, Limited Standing
      loadLabel: string;
      feature: 'WAB' | ''; // Wheelchair Accessible Bus
      type: 'SD' | 'DD' | 'BD'; // Single Decker, Double Decker, Bendy
    };
    nextBus2?: {
      etaMinutes: number;
      loadLabel: string;
      type: string;
    };
    nextBus3?: {
      etaMinutes: number;
      loadLabel: string;
      type: string;
    };
  }[];
}

export interface TrainAlert {
  line: string;
  lineName: string;
  lineColor: string;
  status: 'Normal' | 'Minor Delay' | 'Disrupted';
  message: string;
  affectedStations?: string[];
}

export type SubscriptionTier = 'free' | 'tourist-pass' | 'resident-pro';

export interface PromoVoucher {
  id: string;
  attractionName: string;
  discountPercentage: number;
  promoCode: string;
  description: string;
  validUntil: string;
  minSpendSGD?: number;
}

export interface SubscriptionPlan {
  id: SubscriptionTier;
  name: string;
  tagline: string;
  badge?: string;
  priceSGD: number;
  periodText: string;
  billingType: 'free' | 'pass' | 'subscription';
  isPopular?: boolean;
  features: string[];
  exclusivePerks: string[];
  promoVouchers: PromoVoucher[];
}

