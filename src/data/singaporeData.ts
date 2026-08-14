import { Attraction, TrainAlert, WeatherCondition, SubscriptionPlan, PromoVoucher } from '../types';

export const MRT_LINES = [
  { code: 'NSL', name: 'North-South Line', color: '#d42e12', textColor: '#ffffff' },
  { code: 'EWL', name: 'East-West Line', color: '#009645', textColor: '#ffffff' },
  { code: 'NEL', name: 'North-East Line', color: '#8f4199', textColor: '#ffffff' },
  { code: 'CCL', name: 'Circle Line', color: '#fa9e0d', textColor: '#000000' },
  { code: 'DTL', name: 'Downtown Line', color: '#005ec4', textColor: '#ffffff' },
  { code: 'TEL', name: 'Thomson-East Coast Line', color: '#9d5b25', textColor: '#ffffff' },
  { code: 'LRT', name: 'LRT Lines (Bukit Panjang/Sengkang/Punggol)', color: '#748477', textColor: '#ffffff' },
];

export const INITIAL_TRAIN_STATUS: TrainAlert[] = [
  { line: 'NSL', lineName: 'North-South Line', lineColor: '#d42e12', status: 'Normal', message: 'All trains operating on normal weekday/weekend frequency (2-3 min intervals).' },
  { line: 'EWL', lineName: 'East-West Line', lineColor: '#009645', status: 'Normal', message: 'Regular service across Pasir Ris - Tuas Link & Changi Airport branch.' },
  { line: 'NEL', lineName: 'North-East Line', lineColor: '#8f4199', status: 'Normal', message: 'Full automated service running smoothly between HarbourFront and Punggol.' },
  { line: 'CCL', lineName: 'Circle Line', lineColor: '#fa9e0d', status: 'Normal', message: 'Normal intervals across Dhoby Ghaut / Marina Bay to HarbourFront.' },
  { line: 'DTL', lineName: 'Downtown Line', lineColor: '#005ec4', status: 'Normal', message: 'High frequency service across Bukit Panjang to Expo.' },
  { line: 'TEL', lineName: 'Thomson-East Coast Line', lineColor: '#9d5b25', status: 'Normal', message: 'All stations from Woodlands North to Bayshore operating on time.' },
  { line: 'LRT', lineName: 'LRT Feeder Network', lineColor: '#748477', status: 'Normal', message: 'Bukit Panjang, Sengkang and Punggol LRT systems operating normally.' },
];

export const SINGAPORE_AREAS = [
  'Marina Bay',
  'Civic District',
  'Orchard',
  'Chinatown',
  'Bugis & Kampong Glam',
  'Sentosa',
  'Mandai',
  'Changi',
  'Jurong',
  'Little India',
  'Botanic Gardens',
] as const;

export const ATTRACTIONS_DATA: Attraction[] = [
  {
    id: 'gardens-by-the-bay',
    name: 'Gardens by the Bay',
    chineseName: '滨海湾花园',
    category: 'landmark',
    categoryLabel: 'Iconic Landmark & Domes',
    description: 'A futuristic botanical wonderland featuring the world’s largest glass greenhouse (Flower Dome), a misty indoor mountain with a 35m waterfall (Cloud Forest), and monumental Supertree structures.',
    imageUrl: 'https://images.unsplash.com/photo-1525625293386-3f8f99389edd?auto=format&fit=crop&w=1200&q=80',
    rating: 4.8,
    reviewCount: 48200,
    priceSGD: 32,
    childPriceSGD: 18,
    ticketLink: 'https://www.gardensbythebay.com.sg',
    ticketHighlights: ['Access to Flower Dome & Cloud Forest', 'Includes Avatar / Orchid Haven exhibits', 'SuperTree Grove light show (free at 7:45 & 8:45 PM)'],
    recommendedDurationHours: 3.5,
    openingHours: '9:00 AM - 9:00 PM (Conservatories) | 5:00 AM - 2:00 AM (Outdoor Gardens)',
    weatherSuitability: 'all-weather',
    rainProofScore: 5,
    heatProofScore: 5,
    nearestMrt: {
      stationName: 'Bayfront',
      code: ['DT16', 'CE1'],
      lineColors: ['#005ec4', '#fa9e0d'],
      walkMinutes: 5,
      exit: 'Exit B (Underground sheltered linkway)'
    },
    busStops: [
      { stopCode: '03371', description: 'Gardens by the Bay', services: ['400'] },
      { stopCode: '03511', description: 'Marina Bay Sands Hotel', services: ['97', '106', '133', '502', '518'] }
    ],
    coordinates: { lat: 1.2816, lng: 103.8636 },
    area: 'Marina Bay',
    insiderTip: 'The Flower Dome and Cloud Forest are 100% temperature-controlled (23-25°C) and completely sheltered from rain. Visit Supertree Grove around 7:30 PM for the free Garden Rhapsody light & sound show.',
    indoorAlternativeId: 'artscience-museum',
    outdoorAlternativeId: 'gardens-by-the-bay'
  },
  {
    id: 'mbs-skypark',
    name: 'Marina Bay Sands SkyPark Observation Deck',
    chineseName: '金沙空中花园观景台',
    category: 'landmark',
    categoryLabel: 'Skyline & Observation',
    description: 'Perched 57 storeys above the heart of Singapore, offering 360-degree panoramic views of Marina Bay, the Singapore Strait, and the city skyline.',
    imageUrl: 'https://images.unsplash.com/photo-1506351421178-63b52a2d2562?auto=format&fit=crop&w=1200&q=80',
    rating: 4.7,
    reviewCount: 31500,
    priceSGD: 32,
    childPriceSGD: 24,
    ticketLink: 'https://www.marinabaysands.com/attractions/skypark.html',
    ticketHighlights: ['57th floor panoramic viewing terrace', 'Spectacular sunset views over Singapore Strait', 'Direct access from The Shoppes at MBS'],
    recommendedDurationHours: 1.5,
    openingHours: '11:00 AM - 9:00 PM Daily',
    weatherSuitability: 'outdoor-best',
    rainProofScore: 2,
    heatProofScore: 2,
    nearestMrt: {
      stationName: 'Bayfront',
      code: ['DT16', 'CE1'],
      lineColors: ['#005ec4', '#fa9e0d'],
      walkMinutes: 4,
      exit: 'Exit C or D'
    },
    busStops: [
      { stopCode: '03509', description: 'Marina Bay Sands MICE', services: ['97', '106', '133', '502'] }
    ],
    coordinates: { lat: 1.2840, lng: 103.8607 },
    area: 'Marina Bay',
    insiderTip: 'Book 5:30 PM - 6:30 PM time slot to catch day view, magical sunset, and illuminated night skyline all in one trip. If heavy rain occurs, deck might close temporarily—visit The Shoppes downstairs instead.',
    indoorAlternativeId: 'artscience-museum',
    outdoorAlternativeId: 'mbs-skypark'
  },
  {
    id: 'artscience-museum',
    name: 'ArtScience Museum (Future World)',
    chineseName: '艺术科学博物馆',
    category: 'indoor',
    categoryLabel: 'Immersive Art & Tech',
    description: 'Iconic lotus-inspired architectural marvel housing cutting-edge interactive digital art installations by teamLab, science exhibitions, and VR experiences.',
    imageUrl: 'https://images.unsplash.com/photo-1565967511849-76a60a516170?auto=format&fit=crop&w=1200&q=80',
    rating: 4.7,
    reviewCount: 22400,
    priceSGD: 25,
    childPriceSGD: 20,
    ticketLink: 'https://www.marinabaysands.com/museum.html',
    ticketHighlights: ['Future World: Where Art Meets Science', 'Interactive light crystals & digital waterfall', 'Completely indoor and rainproof'],
    recommendedDurationHours: 2.0,
    openingHours: '10:00 AM - 7:00 PM Daily',
    weatherSuitability: 'indoor-preferred',
    rainProofScore: 5,
    heatProofScore: 5,
    nearestMrt: {
      stationName: 'Bayfront',
      code: ['DT16', 'CE1'],
      lineColors: ['#005ec4', '#fa9e0d'],
      walkMinutes: 7,
      exit: 'Exit D via Marina Bay Sands Mall'
    },
    busStops: [
      { stopCode: '03501', description: 'ArtScience Museum', services: ['97', '106', '133'] }
    ],
    coordinates: { lat: 1.2863, lng: 103.8593 },
    area: 'Marina Bay',
    insiderTip: 'One of the best emergency rain shelters in Marina Bay! 100% sheltered connection directly to Bayfront MRT through the luxury Shoppes at MBS.',
    indoorAlternativeId: 'artscience-museum',
    outdoorAlternativeId: 'gardens-by-the-bay'
  },
  {
    id: 'jewel-changi',
    name: 'Jewel Changi Airport & Rain Vortex',
    chineseName: '星耀樟宜与雨漩涡',
    category: 'indoor',
    categoryLabel: 'World-Class Aviation & Nature',
    description: 'The world’s tallest indoor waterfall (HSBC Rain Vortex, 40m) surrounded by the 4-storey lush Shiseido Forest Valley and Canopy Park thrills inside an airport dome.',
    imageUrl: 'https://images.unsplash.com/photo-1579893529323-91ca85785023?auto=format&fit=crop&w=1200&q=80',
    rating: 4.9,
    reviewCount: 65000,
    priceSGD: 0, // Free main dome, Canopy park $8
    childPriceSGD: 0,
    ticketLink: 'https://www.jewelchangiairport.com',
    ticketHighlights: ['Free access to 40m HSBC Rain Vortex', 'Canopy Park & Sky Nets optional thrills', 'Luggage storage and Early Check-in facilities'],
    recommendedDurationHours: 3.0,
    openingHours: '24 Hours (Rain Vortex runs 10:00 AM - 10:00 PM)',
    weatherSuitability: 'indoor-preferred',
    rainProofScore: 5,
    heatProofScore: 5,
    nearestMrt: {
      stationName: 'Changi Airport',
      code: ['CG2'],
      lineColors: ['#009645'],
      walkMinutes: 2,
      exit: 'Terminal 1 / Direct Link Bridge'
    },
    busStops: [
      { stopCode: '95029', description: 'Changi Airport PTB1', services: ['24', '27', '34', '36', '53', '110', '858'] }
    ],
    coordinates: { lat: 1.3602, lng: 103.9897 },
    area: 'Changi',
    insiderTip: 'Perfect first stop upon landing or last stop before departing Singapore! Free light & music show at the Rain Vortex every hour from 7:30 PM to 10:30 PM.',
    indoorAlternativeId: 'jewel-changi',
    outdoorAlternativeId: 'singapore-zoo'
  },
  {
    id: 'universal-studios-singapore',
    name: 'Universal Studios Singapore (USS)',
    chineseName: '新加坡环球影城',
    category: 'theme-park',
    categoryLabel: 'Blockbuster Theme Park',
    description: 'Southeast Asia’s first and only Universal Studios theme park, boasting 6 themed zones with world-class rides like Battlestar Galactica, Transformers 3D, and the new Minion Land.',
    imageUrl: 'https://images.unsplash.com/photo-1572970979929-3738018e77a2?auto=format&fit=crop&w=1200&q=80',
    rating: 4.6,
    reviewCount: 42000,
    priceSGD: 83,
    childPriceSGD: 62,
    ticketLink: 'https://www.rwsentosa.com/uss',
    ticketHighlights: ['Transformers: The Ultimate 3D Battle', 'Battlestar Galactica: HUMAN vs. CYLON dual coaster', 'Express Pass skip-the-line upgrade available'],
    recommendedDurationHours: 6.0,
    openingHours: '10:00 AM - 7:00 PM Daily',
    weatherSuitability: 'all-weather',
    rainProofScore: 3,
    heatProofScore: 3,
    nearestMrt: {
      stationName: 'HarbourFront (Transfer to Sentosa Express)',
      code: ['NE1', 'CC29'],
      lineColors: ['#8f4199', '#fa9e0d'],
      walkMinutes: 3,
      exit: 'Exit E -> Sentosa Express to Waterfront Stn'
    },
    busStops: [
      { stopCode: '14519', description: 'Resorts World Sentosa', services: ['123', 'RWS8'] }
    ],
    coordinates: { lat: 1.2540, lng: 103.8238 },
    area: 'Sentosa',
    insiderTip: 'Many key rides (Transformers, Revenge of the Mummy, Lights Camera Action) are fully indoor and air-conditioned! If heavy rain causes outdoor rollercoasters to pause, head straight for indoor rides and S.E.A. Aquarium next door.',
    indoorAlternativeId: 'sea-aquarium',
    outdoorAlternativeId: 'universal-studios-singapore'
  },
  {
    id: 'sea-aquarium',
    name: 'S.E.A. Aquarium Singapore',
    chineseName: 'S.E.A. 海洋馆',
    category: 'indoor',
    categoryLabel: 'Marine Realm & Giant Oceanarium',
    description: 'Home to over 100,000 marine animals across 1,000 species, including majestic manta rays, hammerhead sharks, and goliath groupers viewed through one of the world’s largest viewing panels.',
    imageUrl: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=1200&q=80',
    rating: 4.7,
    reviewCount: 28900,
    priceSGD: 44,
    childPriceSGD: 33,
    ticketLink: 'https://www.rwsentosa.com/seaaquarium',
    ticketHighlights: ['Open Ocean giant viewing window', 'Shark Seas underwater tunnel', '100% air-conditioned indoor comfort'],
    recommendedDurationHours: 2.5,
    openingHours: '10:00 AM - 5:00 PM Daily',
    weatherSuitability: 'indoor-preferred',
    rainProofScore: 5,
    heatProofScore: 5,
    nearestMrt: {
      stationName: 'HarbourFront',
      code: ['NE1', 'CC29'],
      lineColors: ['#8f4199', '#fa9e0d'],
      walkMinutes: 4,
      exit: 'VivoCity Level 3 Sentosa Express'
    },
    busStops: [
      { stopCode: '14519', description: 'Resorts World Sentosa', services: ['123', 'RWS8'] }
    ],
    coordinates: { lat: 1.2583, lng: 103.8198 },
    area: 'Sentosa',
    insiderTip: 'Sentosa’s best indoor all-weather retreat. Stay for the manta ray feeding sessions at the Open Ocean tank.',
    indoorAlternativeId: 'sea-aquarium',
    outdoorAlternativeId: 'universal-studios-singapore'
  },
  {
    id: 'singapore-zoo',
    name: 'Singapore Zoo & Mandai Wildlife',
    chineseName: '新加坡动物园',
    category: 'wildlife',
    categoryLabel: 'Open-Concept Rainforest Zoo',
    description: 'Internationally acclaimed "open-concept" zoo set in lush rainforest, where animals roam in spacious, naturalistic enclosures separated by moats and foliage.',
    imageUrl: 'https://images.unsplash.com/photo-1534567153574-2b12153a87f0?auto=format&fit=crop&w=1200&q=80',
    rating: 4.8,
    reviewCount: 46000,
    priceSGD: 48,
    childPriceSGD: 33,
    ticketLink: 'https://www.mandai.com/singapore-zoo',
    ticketHighlights: ['Free unlimited guided tram ride', 'Splash Safari & animal presentations', 'Breakfast with Wildlife dining experience'],
    recommendedDurationHours: 4.5,
    openingHours: '8:30 AM - 6:00 PM Daily',
    weatherSuitability: 'outdoor-best',
    rainProofScore: 2,
    heatProofScore: 2,
    nearestMrt: {
      stationName: 'Khatib (Transfer to Mandai Shuttle)',
      code: ['NS14'],
      lineColors: ['#d42e12'],
      walkMinutes: 2,
      exit: 'Exit A (Mandai Khatib Shuttle $1 every 10 min)'
    },
    busStops: [
      { stopCode: '48131', description: 'Singapore Zoo / Night Safari', services: ['138', '927', 'MandaiShuttle'] }
    ],
    coordinates: { lat: 1.4043, lng: 103.7930 },
    area: 'Mandai',
    insiderTip: 'Take the fast Mandai Shuttle from Khatib MRT (NS14) for only S$1. If afternoon tropical downpours hit, take shelter in the tram or the nearby covered River Wonders giant panda exhibit.',
    indoorAlternativeId: 'jewel-changi',
    outdoorAlternativeId: 'singapore-zoo'
  },
  {
    id: 'night-safari',
    name: 'Night Safari Singapore',
    chineseName: '夜间野生动物园',
    category: 'wildlife',
    categoryLabel: 'World’s First Nocturnal Zoo',
    description: 'The world’s first nocturnal wildlife park, revealing the secretive lives of over 900 animals across 100 species in their nighttime jungle habitats.',
    imageUrl: 'https://images.unsplash.com/photo-1549366021-9f761d450615?auto=format&fit=crop&w=1200&q=80',
    rating: 4.6,
    reviewCount: 33000,
    priceSGD: 55,
    childPriceSGD: 38,
    ticketLink: 'https://www.mandai.com/night-safari',
    ticketHighlights: ['40-minute guided tram safari with audio commentary', '4 walking trails (Fishing Cat, Leopard, East Lodge, Wallaby)', 'Creatures of the Night live amphitheatre show'],
    recommendedDurationHours: 3.5,
    openingHours: '6:30 PM - 12:00 AM Daily',
    weatherSuitability: 'all-weather',
    rainProofScore: 3,
    heatProofScore: 4,
    nearestMrt: {
      stationName: 'Khatib',
      code: ['NS14'],
      lineColors: ['#d42e12'],
      walkMinutes: 2,
      exit: 'Mandai Khatib Shuttle Bus Stop'
    },
    busStops: [
      { stopCode: '48131', description: 'Night Safari / Singapore Zoo', services: ['138', '927'] }
    ],
    coordinates: { lat: 1.4022, lng: 103.7881 },
    area: 'Mandai',
    insiderTip: 'Evenings are cooler! Book the 7:15 PM entry slot to complete the walking trails during dusk, then board the tram around 8:30 PM when queues thin out.',
    indoorAlternativeId: 'national-gallery',
    outdoorAlternativeId: 'night-safari'
  },
  {
    id: 'bird-paradise',
    name: 'Bird Paradise (Mandai Wildlife Reserve)',
    chineseName: '飞禽公园',
    category: 'wildlife',
    categoryLabel: 'Asia’s Largest Avian Sanctuary',
    description: 'A brand-new state-of-the-art bird sanctuary housing 3,500 birds across 8 immersive walk-through aviaries representing global biomes.',
    imageUrl: 'https://images.unsplash.com/photo-1552728089-57bdde30beb3?auto=format&fit=crop&w=1200&q=80',
    rating: 4.8,
    reviewCount: 15400,
    priceSGD: 48,
    childPriceSGD: 33,
    ticketLink: 'https://www.mandai.com/bird-paradise',
    ticketHighlights: ['8 massive walk-in aviaries (Amazonian, African, etc.)', 'Penguin Cove 2-storey indoor sub-Antarctic realm', 'Predators of the Sky flight presentations'],
    recommendedDurationHours: 3.5,
    openingHours: '9:00 AM - 6:00 PM Daily',
    weatherSuitability: 'all-weather',
    rainProofScore: 4,
    heatProofScore: 3,
    nearestMrt: {
      stationName: 'Khatib',
      code: ['NS14'],
      lineColors: ['#d42e12'],
      walkMinutes: 2,
      exit: 'Exit A (Mandai Shuttle)'
    },
    busStops: [
      { stopCode: '48131', description: 'Bird Paradise Hub', services: ['138', '927'] }
    ],
    coordinates: { lat: 1.4085, lng: 103.7865 },
    area: 'Mandai',
    insiderTip: 'Penguin Cove is completely indoor, freezing cold (15°C) and features an underwater viewing dining area!',
    indoorAlternativeId: 'jewel-changi',
    outdoorAlternativeId: 'bird-paradise'
  },
  {
    id: 'national-gallery',
    name: 'National Gallery Singapore',
    chineseName: '新加坡国家美术馆',
    category: 'culture',
    categoryLabel: 'Heritage & Modern Art',
    description: 'Housed within the restored former Supreme Court and City Hall, overseeing the world’s largest public collection of Singapore and Southeast Asian modern art.',
    imageUrl: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b675?auto=format&fit=crop&w=1200&q=80',
    rating: 4.7,
    reviewCount: 19800,
    priceSGD: 20,
    childPriceSGD: 15,
    ticketLink: 'https://www.nationalgallery.sg',
    ticketHighlights: ['Over 9,000 artworks in historic courtrooms', 'Rooftop viewing deck of Padang & Marina Bay', 'Fully indoor, temperature-controlled historical precinct'],
    recommendedDurationHours: 2.5,
    openingHours: '10:00 AM - 7:00 PM Daily',
    weatherSuitability: 'indoor-preferred',
    rainProofScore: 5,
    heatProofScore: 5,
    nearestMrt: {
      stationName: 'City Hall',
      code: ['NS25', 'EW13'],
      lineColors: ['#d42e12', '#009645'],
      walkMinutes: 5,
      exit: 'Exit B (Underground passage to Padang)'
    },
    busStops: [
      { stopCode: '02049', description: 'Supreme Court', services: ['195', '961'] },
      { stopCode: '04168', description: 'Opp The Treasury', services: ['51', '61', '63', '80', '124', '145', '166', '174', '197'] }
    ],
    coordinates: { lat: 1.2903, lng: 103.8519 },
    area: 'Civic District',
    insiderTip: 'A premier cultural escape in downtown. The rooftop Smoke & Mirrors bar offers one of the best unobstructed Padang/MBS skyline vantage points.',
    indoorAlternativeId: 'national-gallery',
    outdoorAlternativeId: 'chinatown-heritage'
  },
  {
    id: 'singapore-flyer',
    name: 'Singapore Flyer & Time Capsule',
    chineseName: '新加坡摩天观景轮',
    category: 'landmark',
    categoryLabel: 'Giant Observation Wheel',
    description: 'Asia’s largest giant observation wheel standing 165 metres tall (approx 42 storeys), granting 30 minutes of 360-degree vistas stretching to Malaysia and Indonesia.',
    imageUrl: 'https://images.unsplash.com/photo-1549488344-1f9b8d2bd1f3?auto=format&fit=crop&w=1200&q=80',
    rating: 4.6,
    reviewCount: 24500,
    priceSGD: 40,
    childPriceSGD: 25,
    ticketLink: 'https://www.singaporeflyer.com',
    ticketHighlights: ['30-minute rotation in air-conditioned capsule', 'Includes Time Capsule multi-sensory heritage journey', 'Free Singapore Sling upgrade options available'],
    recommendedDurationHours: 1.5,
    openingHours: '10:00 AM - 10:00 PM Daily',
    weatherSuitability: 'indoor-preferred',
    rainProofScore: 5,
    heatProofScore: 5,
    nearestMrt: {
      stationName: 'Promenade',
      code: ['CC4', 'DT15'],
      lineColors: ['#fa9e0d', '#005ec4'],
      walkMinutes: 6,
      exit: 'Exit A'
    },
    busStops: [
      { stopCode: '02101', description: 'Singapore Flyer', services: ['56', '75', '77', '97', '171', '195', '960', '961C'] }
    ],
    coordinates: { lat: 1.2893, lng: 103.8631 },
    area: 'Marina Bay',
    insiderTip: 'The capsules are fully enclosed and climate-controlled, meaning you can ride even during light or moderate rain without getting wet!',
    indoorAlternativeId: 'singapore-flyer',
    outdoorAlternativeId: 'singapore-flyer'
  },
  {
    id: 'chinatown-heritage',
    name: 'Chinatown & Buddha Tooth Relic Temple',
    chineseName: '牛车水与佛牙寺龙华院',
    category: 'culture',
    categoryLabel: 'Heritage & Street Dining',
    description: 'A bustling cultural tapestry of Tang-style Buddhist architecture, historic shophouses, Michelin Bib Gourmand street food, and vibrant street markets.',
    imageUrl: 'https://images.unsplash.com/photo-1525625293386-3f8f99389edd?auto=format&fit=crop&w=1200&q=80',
    rating: 4.7,
    reviewCount: 38000,
    priceSGD: 0,
    childPriceSGD: 0,
    ticketLink: 'https://chinatown.sg',
    ticketHighlights: ['Free entrance to Buddha Tooth Relic Temple 4-storey stupa', 'Chinatown Complex Hawker Centre (over 260 food stalls)', 'Maxwell Food Centre Tian Tian Chicken Rice'],
    recommendedDurationHours: 2.5,
    openingHours: '7:00 AM - 7:00 PM (Temple) | Markets open till 10:00 PM',
    weatherSuitability: 'all-weather',
    rainProofScore: 4,
    heatProofScore: 3,
    nearestMrt: {
      stationName: 'Chinatown / Maxwell',
      code: ['NE4', 'DT19', 'TE18'],
      lineColors: ['#8f4199', '#005ec4', '#9d5b25'],
      walkMinutes: 2,
      exit: 'Chinatown Exit A or Maxwell Exit 1'
    },
    busStops: [
      { stopCode: '05059', description: 'Chinatown Stn Exit E', services: ['2', '12', '33', '54', '61', '143', '147', '190', '961'] },
      { stopCode: '05269', description: 'Opp Sri Mariamman Temple', services: ['61', '166', '197'] }
    ],
    coordinates: { lat: 1.2814, lng: 103.8443 },
    area: 'Chinatown',
    insiderTip: 'Sheltered shophouse 5-foot-ways (covered walkways) run along most streets. Head inside Chinatown Complex or Maxwell for lunch (S$4-8 per meal).',
    indoorAlternativeId: 'national-gallery',
    outdoorAlternativeId: 'chinatown-heritage'
  },
  {
    id: 'kampong-glam-haji-lane',
    name: 'Kampong Glam & Haji Lane',
    chineseName: '甘榜格南与哈芝巷',
    category: 'culture',
    categoryLabel: 'Bohemian Boutiques & Sultan Mosque',
    description: 'Singapore’s historic Malay-Arab enclave centered on the majestic golden dome of Sultan Mosque, indie fashion boutiques, Turkish lamps, and colorful wall murals along Haji Lane.',
    imageUrl: 'https://images.unsplash.com/photo-1596422846543-75c6fc197f07?auto=format&fit=crop&w=1200&q=80',
    rating: 4.7,
    reviewCount: 29000,
    priceSGD: 0,
    childPriceSGD: 0,
    ticketLink: '',
    ticketHighlights: ['Golden dome Sultan Mosque exterior & tours', 'Vibrant mural graffiti photography along Haji Lane & Muscat St', 'Artisanal cafes, teh tarik tea stands & Swedish candy shops'],
    recommendedDurationHours: 2.0,
    openingHours: '10:00 AM - 11:00 PM Daily',
    weatherSuitability: 'all-weather',
    rainProofScore: 3,
    heatProofScore: 3,
    nearestMrt: {
      stationName: 'Bugis',
      code: ['EW12', 'DT14'],
      lineColors: ['#009645', '#005ec4'],
      walkMinutes: 6,
      exit: 'Exit B (Victoria St) or Exit D'
    },
    busStops: [
      { stopCode: '01129', description: 'Sultan Mosque', services: ['7', '32', '51', '61', '63', '80', '145', '175', '197'] }
    ],
    coordinates: { lat: 1.3023, lng: 103.8590 },
    area: 'Bugis & Kampong Glam',
    insiderTip: 'Great late afternoon spot. Grab an authentic frothy Teh Tarik at Bhai Sarbat (Bus Stop 01129) and stroll Arab Street before checking out live indie music in Haji Lane.',
    indoorAlternativeId: 'national-gallery',
    outdoorAlternativeId: 'kampong-glam-haji-lane'
  },
  {
    id: 'botanic-gardens',
    name: 'Singapore Botanic Gardens (UNESCO)',
    chineseName: '新加坡植物园',
    category: 'nature',
    categoryLabel: 'UNESCO World Heritage Garden',
    description: 'A 165-year-old tropical botanical garden and Singapore’s first UNESCO World Heritage Site, housing the world’s largest orchid collection at the National Orchid Garden.',
    imageUrl: 'https://images.unsplash.com/photo-1563245372-f21724e3856d?auto=format&fit=crop&w=1200&q=80',
    rating: 4.8,
    reviewCount: 35000,
    priceSGD: 0, // Main grounds free, Orchid Garden $15
    childPriceSGD: 0,
    ticketLink: 'https://www.nparks.gov.sg/sbg',
    ticketHighlights: ['Free entrance to 82-hectare lush park & Swan Lake', 'National Orchid Garden with 1,000+ VIP orchid species ($15)', 'Eco Lake & historic bandstand pavilion'],
    recommendedDurationHours: 2.5,
    openingHours: '5:00 AM - 12:00 Midnight Daily (Orchid Garden: 8:30 AM - 7:00 PM)',
    weatherSuitability: 'outdoor-best',
    rainProofScore: 2,
    heatProofScore: 2,
    nearestMrt: {
      stationName: 'Botanic Gardens',
      code: ['CC19', 'DT9'],
      lineColors: ['#fa9e0d', '#005ec4'],
      walkMinutes: 1,
      exit: 'Exit A (Right into Bukit Timah Gate)'
    },
    busStops: [
      { stopCode: '41021', description: 'Botanic Gdns Stn', services: ['48', '66', '67', '151', '153', '154', '156', '170', '171', '186'] }
    ],
    coordinates: { lat: 1.3138, lng: 103.8159 },
    area: 'Botanic Gardens',
    insiderTip: 'Best explored early in the morning (7:30 AM - 10:00 AM) to beat the tropical midday heat. Direct step-off from Botanic Gardens MRT Station on Downtown & Circle lines.',
    indoorAlternativeId: 'gardens-by-the-bay',
    outdoorAlternativeId: 'botanic-gardens'
  },
  {
    id: 'singapore-river-cruise',
    name: 'Singapore River Cruise (Clarke Quay to Marina Bay)',
    chineseName: '新加坡河巡游船',
    category: 'landmark',
    categoryLabel: 'Historical Bumboats',
    description: 'A 40-minute scenic cruise aboard classic electric bumboats navigating past Clarke Quay, Boat Quay, Fullerton Hotel, the Merlion, and Marina Bay Sands.',
    imageUrl: 'https://images.unsplash.com/photo-1565967511849-76a60a516170?auto=format&fit=crop&w=1200&q=80',
    rating: 4.6,
    reviewCount: 18700,
    priceSGD: 28,
    childPriceSGD: 18,
    ticketLink: 'https://rivercruise.com.sg',
    ticketHighlights: ['Covered bumboat seating (operates in rain)', 'Passes historical bridges: Cavenagh, Anderson, Elgin', 'Breathtaking view of Merlion & Marina Bay skyline from the water'],
    recommendedDurationHours: 1.0,
    openingHours: '10:00 AM - 10:00 PM Daily',
    weatherSuitability: 'all-weather',
    rainProofScore: 4,
    heatProofScore: 4,
    nearestMrt: {
      stationName: 'Clarke Quay / Fort Canning',
      code: ['NE5', 'DT20'],
      lineColors: ['#8f4199', '#005ec4'],
      walkMinutes: 3,
      exit: 'Clarke Quay Exit E or Fort Canning Exit A'
    },
    busStops: [
      { stopCode: '04211', description: 'Clarke Quay Stn', services: ['2', '12', '33', '51', '54', '61', '63', '80', '124', '145', '147', '166', '174', '190'] }
    ],
    coordinates: { lat: 1.2887, lng: 103.8467 },
    area: 'Civic District',
    insiderTip: 'The bumboats have canopy roofs, keeping you dry even if a light tropical shower starts. Evening cruises (7:30 PM) catch the Marina Bay laser show from the water!',
    indoorAlternativeId: 'singapore-river-cruise',
    outdoorAlternativeId: 'singapore-river-cruise'
  }
];

export const POPULAR_BUS_STOPS = [
  { code: '03071', name: 'Bayfront Stn Exit B/MBS', road: 'Bayfront Ave', services: ['97', '106', '133', '502', '518'], landmark: 'Marina Bay Sands & Gardens by the Bay' },
  { code: '03223', name: 'Peninsula Plaza', road: 'North Bridge Rd', services: ['32', '51', '63', '80', '124', '145', '166', '174', '197'], landmark: 'City Hall & National Gallery' },
  { code: '09048', name: 'Orchard Stn / Lucky Plaza', road: 'Orchard Rd', services: ['7', '14', '16', '65', '106', '111', '123', '175', '502'], landmark: 'Orchard Shopping Belt' },
  { code: '05059', name: 'Chinatown Stn Exit E', road: 'Eu Tong Sen St', services: ['2', '12', '33', '54', '61', '143', '147', '190', '961'], landmark: 'Chinatown & People’s Park' },
  { code: '01129', name: 'Sultan Mosque', road: 'Victoria St', services: ['7', '32', '51', '61', '63', '80', '145', '175', '197'], landmark: 'Kampong Glam & Haji Lane' },
  { code: '14519', name: 'Resorts World Sentosa', road: 'Sentosa Gateway', services: ['123', 'RWS8'], landmark: 'Universal Studios & S.E.A. Aquarium' },
  { code: '48131', name: 'Singapore Zoo', road: 'Mandai Lake Rd', services: ['138', '927', 'MandaiShuttle'], landmark: 'Singapore Zoo & Night Safari' },
  { code: '95029', name: 'Changi Airport PTB1', road: 'Airport Blvd', services: ['24', '27', '34', '36', '53', '110', '858'], landmark: 'Jewel Changi Rain Vortex' },
];

export const MOCK_LIVE_WEATHER: Record<string, WeatherCondition> = {
  'Marina Bay': {
    area: 'Marina Bay',
    forecast: 'Partly Cloudy / Fair',
    temperature: 31.2,
    relativeHumidity: 72,
    rainfallMm: 0.0,
    uvIndex: 7,
    psi: 42,
    pm25: 11,
    lightningAlert: false,
    rainRisk: 'low',
    icon: 'sun-cloud',
    updatedAt: new Date().toLocaleTimeString('en-SG', { hour: '2-digit', minute: '2-digit', timeZone: 'Asia/Singapore' })
  },
  'Sentosa': {
    area: 'Sentosa',
    forecast: 'Sunny & Breeze',
    temperature: 32.0,
    relativeHumidity: 68,
    rainfallMm: 0.0,
    uvIndex: 8,
    psi: 40,
    pm25: 9,
    lightningAlert: false,
    rainRisk: 'none',
    icon: 'sun',
    updatedAt: new Date().toLocaleTimeString('en-SG', { hour: '2-digit', minute: '2-digit', timeZone: 'Asia/Singapore' })
  },
  'Civic District': {
    area: 'Civic District',
    forecast: 'Partly Cloudy',
    temperature: 31.0,
    relativeHumidity: 74,
    rainfallMm: 0.0,
    uvIndex: 6,
    psi: 44,
    pm25: 12,
    lightningAlert: false,
    rainRisk: 'low',
    icon: 'sun-cloud',
    updatedAt: new Date().toLocaleTimeString('en-SG', { hour: '2-digit', minute: '2-digit', timeZone: 'Asia/Singapore' })
  },
  'Orchard': {
    area: 'Orchard',
    forecast: 'Passing Clouds',
    temperature: 30.8,
    relativeHumidity: 75,
    rainfallMm: 0.0,
    uvIndex: 6,
    psi: 45,
    pm25: 13,
    lightningAlert: false,
    rainRisk: 'low',
    icon: 'cloud',
    updatedAt: new Date().toLocaleTimeString('en-SG', { hour: '2-digit', minute: '2-digit', timeZone: 'Asia/Singapore' })
  },
  'Mandai': {
    area: 'Mandai',
    forecast: 'Humid & Overcast',
    temperature: 29.8,
    relativeHumidity: 82,
    rainfallMm: 0.2,
    uvIndex: 5,
    psi: 38,
    pm25: 8,
    lightningAlert: false,
    rainRisk: 'moderate',
    icon: 'cloud-rain',
    updatedAt: new Date().toLocaleTimeString('en-SG', { hour: '2-digit', minute: '2-digit', timeZone: 'Asia/Singapore' })
  },
  'Changi': {
    area: 'Changi',
    forecast: 'Fair & Sunny',
    temperature: 31.5,
    relativeHumidity: 70,
    rainfallMm: 0.0,
    uvIndex: 7,
    psi: 39,
    pm25: 9,
    lightningAlert: false,
    rainRisk: 'none',
    icon: 'sun',
    updatedAt: new Date().toLocaleTimeString('en-SG', { hour: '2-digit', minute: '2-digit', timeZone: 'Asia/Singapore' })
  }
};

export const EXCLUSIVE_PROMO_VOUCHERS: PromoVoucher[] = [
  {
    id: 'voucher-gardens',
    attractionName: 'Gardens by the Bay (Domes Combo)',
    discountPercentage: 15,
    promoCode: 'SUNNYGARDENS15',
    description: '15% off adult & child admission tickets to Flower Dome & Cloud Forest.',
    validUntil: '31 Dec 2026',
    minSpendSGD: 30
  },
  {
    id: 'voucher-cablecar',
    attractionName: 'Singapore Cable Car Sky Pass',
    discountPercentage: 15,
    promoCode: 'SUNNYCABLE15',
    description: '15% off Round Trip Mount Faber + Sentosa line sky passes.',
    validUntil: '31 Dec 2026'
  },
  {
    id: 'voucher-artscience',
    attractionName: 'ArtScience Museum teamLab',
    discountPercentage: 12,
    promoCode: 'SUNNYLAB12',
    description: '12% discount on Future World all-peak admission passes.',
    validUntil: '31 Dec 2026',
    minSpendSGD: 25
  },
  {
    id: 'voucher-flyer',
    attractionName: 'Singapore Flyer Flight Pass',
    discountPercentage: 10,
    promoCode: 'SUNNYFLYER10',
    description: '10% off Giant Observation Wheel evening sunset tickets.',
    validUntil: '31 Dec 2026'
  },
  {
    id: 'voucher-mandai',
    attractionName: 'Mandai Wildlife Reserve (Zoo/River/Night Safari)',
    discountPercentage: 15,
    promoCode: 'SUNNYWILD15',
    description: '15% off single park or 2-Park admission tickets with tram.',
    validUntil: '31 Dec 2026',
    minSpendSGD: 40
  },
  {
    id: 'voucher-ducktour',
    attractionName: 'Singapore Captain Explorer DUKW Amphibious Tour',
    discountPercentage: 10,
    promoCode: 'SUNNYDUCK10',
    description: '10% off 60-min land & water bay explorer tours.',
    validUntil: '31 Dec 2026'
  }
];

export const SUBSCRIPTION_PLANS: SubscriptionPlan[] = [
  {
    id: 'free',
    name: 'Free Explorer',
    tagline: 'Essential day trips and standard open transit queries.',
    priceSGD: 0,
    periodText: 'Forever Free',
    billingType: 'free',
    features: [
      'Single-day smart itinerary generation',
      'Real-time NEA 2-hour rain radar & temperature feeds',
      'LTA public bus live arrivals & MRT operational line status',
      'Catalog access to top 15+ Singapore attractions & ticketing',
      'Up to 3 AI Concierge requests per day',
      'Manual point-to-point shelter route calculation'
    ],
    exclusivePerks: [
      'Standard web experience',
      'Live weather radar'
    ],
    promoVouchers: []
  },
  {
    id: 'tourist-pass',
    name: 'Tourist Pass Plus',
    tagline: 'The ultimate all-inclusive trip pass for Singapore visitors & tourists.',
    badge: 'Most Popular',
    isPopular: true,
    priceSGD: 8.99,
    periodText: '7-Day Trip Pass (or S$4.99 / mo)',
    billingType: 'pass',
    features: [
      'Multi-day AI smart itinerary planning (1, 2, 3, 5, or 7 full days)',
      '🛡️ Automated Rain-Shield Engine (instant swap to indoor domes during storms)',
      '⚡ Real-time Heat & Crowd Optimization (routes around midday humidity)',
      '🎟️ Unlocked 10% - 15% Official Attraction Partner promo discount vouchers',
      '🤖 Unlimited Gemini 3.7 Flash AI Tour Concierge queries & voice advice',
      '📄 1-Click Printable / Offline PDF Singapore Tourist Itinerary & Map Export',
      'Sheltered underground linkway step-by-step navigation guides'
    ],
    exclusivePerks: [
      '6 Exclusive Promo Vouchers (Save up to S$65+)',
      'Auto-Rain Rerouting Shield',
      '7-Day Multi-Day Itinerary Planner',
      'Offline PDF Travel Pack'
    ],
    promoVouchers: EXCLUSIVE_PROMO_VOUCHERS
  },
  {
    id: 'resident-pro',
    name: 'SG Resident VIP',
    tagline: 'Tailored for Singapore locals, expats, and frequent transit commuters.',
    badge: 'Best Value',
    priceSGD: 14.99,
    periodText: 'Annual Pass (S$1.25 / mo)',
    billingType: 'subscription',
    features: [
      'Everything included in Tourist Pass Plus',
      '🚲 Custom Weekend Nature & Rail Corridor cycling/walking itinerary generator',
      '🍜 Curated Michelin Bib Gourmand & Heritage Hawker Trail unlocker',
      '🚇 Priority MRT disruption alerts & sheltered detour recommendations',
      '🌧️ Microclimate rain & flash-flood push alert forecasts',
      '👨‍👩‍👧‍👦 Multi-profile family sharing & group itinerary collaboration',
      'Early access to new Singapore attraction passes & pop-up events'
    ],
    exclusivePerks: [
      'Annual Unlimited Access',
      'Hawker & Hidden Gems Database',
      'Priority Transit Disruption Alerts',
      'Family Sharing Support'
    ],
    promoVouchers: EXCLUSIVE_PROMO_VOUCHERS
  }
];

