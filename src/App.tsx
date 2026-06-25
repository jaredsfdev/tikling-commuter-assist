/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Menu,
  Bell,
  Search,
  Compass,
  Star,
  Home,
  Route as RouteIcon,
  Plus,
  Users,
  User,
  Locate,
  ZapOff,
  MapPin,
  Check,
  AlertCircle,
  HelpCircle,
  Smartphone,
  ChevronRight,
  Info,
  X,
  Settings,
  Sparkles,
  Trash2,
  RefreshCw,
  Footprints,
  Bike,
  Inbox,
  Award,
  Gift,
  Heart,
  Leaf,
  Train,
  Lock,
  Map,
  Sun,
  Moon
} from 'lucide-react';
import { CommuterRoute, AppStateMode, TabType, Waypoint, TransitMode } from './types';
import InteractiveMap from './components/InteractiveMap';
import RouteCard from './components/RouteCard';
import StatusController from './components/StatusController';
import GtfsScheduleBrowser from './components/GtfsScheduleBrowser';
import WeatherOutlook from './components/WeatherOutlook';
import HeroBannerImg from '/src/assets/images/tikling_banner_1781772207983.jpg';
// Hardcoded default community and preset routes matching the design specification
const DEFAULT_ROUTES: CommuterRoute[] = [
  {
    id: 'base-1',
    title: 'Intramuros morning breeze walk',
    creator: 'Maya',
    transitMode: 'walk',
    durationMinutes: 20,
    distanceKm: 1.5,
    tags: ['Scenic', 'Historic'],
    likes: 214,
    isSaved: false,
  },
  {
    id: 'base-2',
    title: 'Quiet commute to Taft Campus',
    creator: 'Leo',
    transitMode: 'bus',
    durationMinutes: 35,
    distanceKm: 6.8,
    tags: ['Low emissions'],
    likes: 176,
    isSaved: true,
  },
  {
    id: 'base-3',
    title: 'MRT-3 Metro loop Ayala-Cubao',
    creator: 'Sara',
    transitMode: 'metro',
    durationMinutes: 18,
    distanceKm: 9.3,
    tags: ['Fastest'],
    likes: 309,
    isSaved: false,
  },
];

function TiklingMascot({ size = 'md', animated = true }: { size?: 'sm' | 'md' | 'lg' | 'xl'; animated?: boolean }) {
  const sizeClasses = {
    sm: 'w-10 h-10',
    md: 'w-16 h-16',
    lg: 'w-24 h-24',
    xl: 'w-32 h-32',
  };

  return (
    <div className={`relative ${sizeClasses[size]} flex items-center justify-center shrink-0`}>
      {/* Animated micro bird aura using the terracotta brand theme shadow */}
      {animated && (
        <div className="absolute inset-0 bg-[#cd5f39]/10 rounded-full animate-ping duration-[1600ms]" />
      )}
      
      {/* Outer body - modeled after Tikling's round 3D silhouette */}
      <div className="absolute inset-0.5 rounded-full bg-[#cbac91] shadow-md flex items-center justify-center border-2 border-white/60">
        <div className="relative w-full h-full overflow-hidden rounded-full font-sans select-none">
          {/* 1. Hair Tuft at the center header (Clay brown, matches render) */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 flex gap-0.5 z-25">
            <span className="w-1 md:w-1.5 h-3 bg-[#a5846a] rounded-full rotate-[-12deg] origin-bottom" />
            <span className="w-1 md:w-1.5 h-3.5 bg-[#a5846a] rounded-full rotate-[12deg] origin-bottom" />
          </div>

          {/* 2. Soft off-white face mask/chest (curved heart shape block) */}
          <div 
            className="absolute bottom-[-5%] inset-x-[4%] h-[78%] bg-[#faf6ed] rounded-t-[50%] z-10 border-t border-[#f2ece3]"
            style={{ borderRadius: '60% 60% 40% 40%' }}
          >
            {/* 3. Eyes (Deep slate charcoal) */}
            <div className="absolute top-[22%] left-[18%] w-3 h-3 bg-[#283641] rounded-full flex items-center justify-center z-20">
              <div className="absolute top-0.5 left-0.5 w-[3.5px] h-[3.5px] bg-white rounded-full" />
            </div>
            <div className="absolute top-[22%] right-[18%] w-3 h-3 bg-[#283641] rounded-full flex items-center justify-center z-20">
              <div className="absolute top-0.5 left-0.5 w-[3.5px] h-[3.5px] bg-white rounded-full" />
            </div>

            {/* 4. Small cute brownish beak in center */}
            <div 
              className="absolute top-[32%] left-1/2 -translate-x-1/2 w-4 h-3 bg-[#d57745] z-20 shadow-2xs"
              style={{ clipPath: 'polygon(50% 100%, 0 0, 100% 0)', borderRadius: '3px 3px 6px 6px' }}
            />

            {/* 5. Blush (Soft rosy terracotta blend) */}
            <div className="absolute top-[32%] left-[6%] w-[10px] h-[5px] bg-[#d06341]/40 rounded-full blur-[0.5px]" />
            <div className="absolute top-[32%] right-[6%] w-[10px] h-[5px] bg-[#d06341]/40 rounded-full blur-[0.5px]" />

            {/* 6. Signature Cross-body Strap and Teal Messenger Bag */}
            {size !== 'sm' && (
              <>
                {/* Strap stretching from right shoulder to left hip */}
                <div 
                  className="absolute bottom-[28%] left-[-10%] right-[-10%] h-1 bg-[#283641]/85 z-15 rotate-[18deg] origin-center shadow-2xs"
                />
                
                {/* Micro Teal Messenger Bag hanging on left waist */}
                <div 
                  className="absolute bottom-[10%] left-[8%] w-[26%] h-[20%] bg-[#5398a0] rounded-md border border-[#44868e] z-20 rotate-[12deg] shadow-xs flex items-center justify-center"
                >
                  {/* Flap of the bag */}
                  <div className="absolute top-0 inset-x-0 h-[45%] bg-[#407e86] rounded-t-sm border-b border-[#2d5d63]" />
                </div>

                {/* Compass Medallion Badge (Terracotta with Compass design) */}
                <div 
                  className="absolute bottom-[20%] right-[12%] w-[22%] h-[22%] bg-[#cd5f39] rounded-full border border-white z-20 flex items-center justify-center shadow-xs rotate-[-10deg]"
                >
                  {/* Compass bezel tick */}
                  <div className="w-[85%] h-[85%] bg-[#faf6ed] rounded-full flex items-center justify-center relative">
                    {/* Compass needle */}
                    <div className="w-1.5 h-1.5 bg-[#cd5f39] rotate-45 rounded-xs" style={{ clipPath: 'polygon(50% 100%, 15% 15%, 85% 15%)' }} />
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function App() {
  // Predefined Mascot Animals that users can select as their profile companion
  const MASCOT_OPTIONS = [
    {
      id: 'tikling',
      name: 'Tiki',
      species: 'Tikling Bird',
      description: 'Your default wetlands guide! Sprightly and loves high-altitude lookouts.',
      src: '/src/assets/images/tikling_avatar_1781772190998.jpg'
    },
    {
      id: 'pio',
      name: 'Pio',
      species: 'Golden Chick',
      description: 'Bright and energetic! Thrives on analyzing speedy shortcuts and bike lanes.',
      src: '/src/assets/images/pio_mascot_avatar_1781771380237.jpg'
    },
    {
      id: 'tarsier',
      name: 'Tarsi',
      species: 'Bohol Tarsier',
      description: 'Wide-eyed forest pathfinder. Super-friendly and specialized in detailed mapping.',
      src: '/src/assets/images/tarsier_mascot_avatar_1782175325934.jpg'
    },
    {
      id: 'carabao',
      name: 'Cara',
      species: 'Water Buffalo',
      description: 'Dependable and strong! Represents steady pace and zero-carbon walking routes.',
      src: '/src/assets/images/carabao_mascot_avatar_1782175343853.jpg'
    }
  ];

  const [selectedMascotId, setSelectedMascotId] = useState<string>(() => {
    return localStorage.getItem('tikling_selected_mascot_id') || 'tikling';
  });

  const [profileName, setProfileName] = useState<string>(() => {
    return localStorage.getItem('tikling_profile_name') || 'Jared SF';
  });

  const [profileSubtitle, setProfileSubtitle] = useState<string>(() => {
    return localStorage.getItem('tikling_profile_subtitle') || 'Vancity Commuter • Tier 3 Pioneer';
  });

  const [kilometersTracked, setKilometersTracked] = useState<number>(() => {
    const saved = localStorage.getItem('tikling_kilometers_tracked');
    return saved ? parseInt(saved, 10) : 920;
  });

  const activeMascot = MASCOT_OPTIONS.find(m => m.id === selectedMascotId) || MASCOT_OPTIONS[0];

  // Global Compliance state variables
  const [appState, setAppState] = useState<AppStateMode>('hasData');
  const [isLowData, setIsLowData] = useState<boolean>(false);
  const [isOffline, setIsOffline] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Active Tab state
  const [activeTab, setActiveTab] = useState<TabType>('home');

  // Route Custom Waypoints state (for custom route intelligence system)
  const [waypoints, setWaypoints] = useState<Waypoint[]>([]);
  const [transitMode, setTransitMode] = useState<TransitMode>('walk');

  // Custom user-loaded routes from local storage
  const [customRoutes, setCustomRoutes] = useState<CommuterRoute[]>([]);
  const [bellCount, setBellCount] = useState(2);

  // Custom mascot alerts state
  const [tiklingAlert, setTiklingAlert] = useState<{
    show: boolean;
    title: string;
    message: string;
    type?: 'info' | 'success' | 'warning';
  } | null>(null);

  // Sidebar Drawer state
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(false);

  // Global theme switcher state (Tiki Night Mode)
  const [isTikiNightMode, setIsTikiNightMode] = useState<boolean>(() => {
    return localStorage.getItem('tikling_night_mode') === 'true';
  });

  // Donation and rewards pool state
  const [donationPoolGoal, setDonationPoolGoal] = useState<number>(25000);
  const [donationPoolCurrent, setDonationPoolCurrent] = useState<number>(18450);
  const [selectedDonationPreset, setSelectedDonationPreset] = useState<number>(150);
  const [customDonationInput, setCustomDonationInput] = useState<string>('');
  const [isCustomDonation, setIsCustomDonation] = useState<boolean>(false);
  const [donationSuccessMsg, setDonationSuccessMsg] = useState<boolean>(false);
  const [lastContributedAmount, setLastContributedAmount] = useState<number>(0);
  const [topContributors, setTopContributors] = useState([
    { id: '1', name: 'Keesha Santos', quantity: 1200, category: 'LRT pass sponsor', date: '2 hours ago' },
    { id: '2', name: 'Mark Ramos', quantity: 600, category: 'Bike Helmet Pool', date: '1 day ago' },
    { id: '3', name: 'Auntie Brenda', quantity: 300, category: 'Water Bottle Microfund', date: '2 days ago' },
    { id: '4', name: 'LRT Commuters Guild', quantity: 2500, category: 'Commute subsidy grant', date: '4 days ago' }
  ]);

  // Synchronize body class for Tiki Night Mode
  useEffect(() => {
    if (isTikiNightMode) {
      document.body.classList.add('tiki-night-active');
    } else {
      document.body.classList.remove('tiki-night-active');
    }
  }, [isTikiNightMode]);

  // Notification Popover state & initial feed of alerts
  const [isNotificationOpen, setIsNotificationOpen] = useState<boolean>(false);
  const [notifications, setNotifications] = useState([
    {
      id: 'n-1',
      title: 'Tiki Weather Warning',
      message: 'A rainy day overhead. Tiki recommends walking segments to have custom coats and umbrellas prepared!',
      read: false,
      time: 'Just now',
      type: 'warning'
    },
    {
      id: 'n-2',
      title: 'Manila Loop Active',
      message: 'Active route sync verifies Intramuros pathways and Ayala MRT terminals are running with zero transit transfer delay!',
      read: false,
      time: '15 mins ago',
      type: 'success'
    },
    {
      id: 'n-3',
      title: 'Eco Savings Unlocked!',
      message: 'Your custom commute bookmarks saved roughly 12.4 Kilograms of carbon gases compared to standard SUVs!',
      read: true,
      time: '3 hours ago',
      type: 'info'
    }
  ]);

  // Load custom routes from LocalStorage
  const loadCustomRoutes = () => {
    try {
      const saved = localStorage.getItem('pio_custom_routes');
      if (saved) {
        setCustomRoutes(JSON.parse(saved));
      }
    } catch (e) {
      console.error('Error reading custom routes storage', e);
    }
  };

  // Calculation of Saved Routes count
  const getSavedRoutesCount = (): number => {
    const savedCustom = customRoutes.filter(r => r.isSaved).length;
    let savedDefaults = 0;
    DEFAULT_ROUTES.forEach(route => {
      const savedVal = localStorage.getItem(`pio_saved_ref_${route.id}`);
      if (savedVal === 'true') {
        savedDefaults++;
      } else if (savedVal === null && route.isSaved) {
        savedDefaults++;
      }
    });
    return savedCustom + savedDefaults;
  };

  const savedCount = getSavedRoutesCount();

  // Milestone Selection state
  const [selectedMilestoneId, setSelectedMilestoneId] = useState<string | null>(null);

  const MILESTONES = [
    {
      id: 'jeepney_joyrider',
      title: 'Jeepney Joyrider',
      requirement: 'Save 1+ route',
      condition: savedCount >= 1,
      currentValue: savedCount,
      targetValue: 1,
      metricLabel: 'saved',
      icon: Map,
      description: 'Bookmarked your first active corridor. Ready to speed through the streets!',
      rewardText: '+50 Commuter XP'
    },
    {
      id: 'tikis_scout',
      title: "Tiki's Scholar",
      requirement: 'Save 3+ routes',
      condition: savedCount >= 3,
      currentValue: savedCount,
      targetValue: 3,
      metricLabel: 'saved',
      icon: Compass,
      description: "Mapped 3+ corridors. Tiki sings your praiseworthy pathfinding guidance!",
      rewardText: '+150 Commuter XP'
    },
    {
      id: 'route_architect',
      title: 'Metro Coordinator',
      requirement: 'Save 5+ routes',
      condition: savedCount >= 5,
      currentValue: savedCount,
      targetValue: 5,
      metricLabel: 'saved',
      icon: RouteIcon,
      description: 'Integrated 5+ comprehensive transits. You possess your own transit blueprint!',
      rewardText: '+300 Commuter XP'
    },
    {
      id: 'metro_voyager',
      title: 'Taft Voyager',
      requirement: 'Track 100+ km',
      condition: kilometersTracked >= 100,
      currentValue: kilometersTracked,
      targetValue: 100,
      metricLabel: 'km',
      icon: Train,
      description: 'Logged 100 kilometers of low-carbon voyages alongside nature companions.',
      rewardText: '+100 Travel XP'
    },
    {
      id: 'eco_pioneer',
      title: 'Eco Field Pioneer',
      requirement: 'Track 500+ km',
      condition: kilometersTracked >= 500,
      currentValue: kilometersTracked,
      targetValue: 500,
      metricLabel: 'km',
      icon: Leaf,
      description: 'Logged 500 kilometers! Huge carbon reductions registered inside nature reserve trackers.',
      rewardText: '+500 Travel XP'
    },
    {
      id: 'centurion_commuter',
      title: 'Centurion Commuter',
      requirement: 'Track 1000+ km',
      condition: kilometersTracked >= 1000,
      currentValue: kilometersTracked,
      targetValue: 1000,
      metricLabel: 'km',
      icon: Award,
      description: 'The ultimate legendary tier representing over 1000km covered! Simply magnificent.',
      rewardText: 'Legendary Companion Tag'
    }
  ];

  const handleSimulateKm = (additionalKm: number) => {
    let newKm = additionalKm === -1 ? 0 : kilometersTracked + additionalKm;
    if (newKm < 0) newKm = 0;
    
    // Check for new unlocks and throw celebrations
    MILESTONES.forEach(badge => {
      // If it wasn't unlocked, but is now unlocked
      const wasUnlockedBefore = kilometersTracked >= badge.targetValue;
      const isUnlockedNow = newKm >= badge.targetValue;
      if (badge.metricLabel === 'km' && !wasUnlockedBefore && isUnlockedNow) {
        setTiklingAlert({
          show: true,
          title: `🏆 Badge Unlocked: ${badge.title}! 🐦`,
          message: `${activeMascot.name} has proudly pinned the "${badge.title}" badge to your transit vest! "${badge.description}"`,
          type: 'success'
        });
      }
    });

    setKilometersTracked(newKm);
    localStorage.setItem('tikling_kilometers_tracked', newKm.toString());
  };

  const prevSavedCountRef = React.useRef<number>(savedCount);

  useEffect(() => {
    // Check if we gained a new badge from savedCount
    const previouslyUnlocked = {
      jeepney_joyrider: prevSavedCountRef.current >= 1,
      tikis_scout: prevSavedCountRef.current >= 3,
      route_architect: prevSavedCountRef.current >= 5,
    };

    const currentlyUnlocked = {
      jeepney_joyrider: savedCount >= 1,
      tikis_scout: savedCount >= 3,
      route_architect: savedCount >= 5,
    };

    if (currentlyUnlocked.route_architect && !previouslyUnlocked.route_architect) {
      setTiklingAlert({
        show: true,
        title: "🏆 Badge Unlocked: Metro Coordinator! 🗺️",
        message: `Absolute legend! You programmed over 5 custom transit corridors in Metro Manila!`,
        type: 'success'
      });
    } else if (currentlyUnlocked.tikis_scout && !previouslyUnlocked.tikis_scout) {
      setTiklingAlert({
        show: true,
        title: "🏆 Badge Unlocked: Tiki's Scholar! 🧭",
        message: `Outstanding! ${activeMascot.name} says you mapped 3+ active corridors, and awards +150 Commuter XP.`,
        type: 'success'
      });
    } else if (currentlyUnlocked.jeepney_joyrider && !previouslyUnlocked.jeepney_joyrider) {
      setTiklingAlert({
        show: true,
        title: "🏆 Badge Unlocked: Jeepney Joyrider! 🚌",
        message: `${activeMascot.name} is cheerful! You saved your first transit corridor. "Ready to speed through the streets!"`,
        type: 'success'
      });
    }

    prevSavedCountRef.current = savedCount;
  }, [savedCount, activeMascot.name]);

  useEffect(() => {
    loadCustomRoutes();

    // Listen for custom routes created in map explorer
    const handleRouteCreated = (e: any) => {
      loadCustomRoutes();
      setActiveTab('home'); // jump back to home to see updated list
    };

    // Listen for custom Tikling mascot alerts dispatched anywhere
    const handleTiklingAlert = (e: any) => {
      if (e.detail) {
        setTiklingAlert({
          show: true,
          title: e.detail.title || 'Mascot Alert!',
          message: e.detail.message || '',
          type: e.detail.type || 'info',
        });
      }
    };

    window.addEventListener('pio_route_created', handleRouteCreated);
    window.addEventListener('tikling_alert', handleTiklingAlert);
    return () => {
      window.removeEventListener('pio_route_created', handleRouteCreated);
      window.removeEventListener('tikling_alert', handleTiklingAlert);
    };
  }, []);

  // Consolidate list of available routes
  const getDisplayRoutes = (): CommuterRoute[] => {
    if (appState === 'empty') return [];

    let list = [...customRoutes, ...DEFAULT_ROUTES];

    // Filter by search query
    if (searchQuery.trim() !== '') {
      list = list.filter((r) =>
        r.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        r.creator.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // In Low Data mode, prioritize cached or short offline routes
    if (isLowData) {
      list = list.map((r) => ({
        ...r,
        tags: [...r.tags, 'Cached'],
      }));
    }

    return list;
  };

  const handlePerformDonation = (amountToDonate: number) => {
    if (amountToDonate <= 0 || isNaN(amountToDonate)) {
      setTiklingAlert({
        show: true,
        title: 'Invalid Amount',
        message: 'Please enter a valid donation value greater than zero PHP.',
        type: 'warning'
      });
      return;
    }

    setDonationPoolCurrent(prev => prev + amountToDonate);
    setLastContributedAmount(amountToDonate);
    setDonationSuccessMsg(true);

    // Append to top contributors list instantly for live simulation feedback
    const newContributor = {
      id: Math.random().toString(),
      name: profileName || 'Anonymous Supporter',
      quantity: amountToDonate,
      category: amountToDonate >= 1000 ? 'Weekly Pass Hero' : amountToDonate >= 300 ? 'Eco Commute Angel' : 'Single Ride Sponsor',
      date: 'Just now'
    };

    setTopContributors(prev => [newContributor, ...prev]);

    // Send a message via Tikling Mascot Alert
    setTiklingAlert({
      show: true,
      title: 'Tibi & Tikling Grateful!',
      message: `Tweeet! Huge thanks to ${profileName}! Your contribution of ₱${amountToDonate} keeps daily transport green, active, and rewarding.`,
      type: 'success'
    });
  };

  const toggleSaveRoute = (id: string) => {
    // Check if it's a custom route first
    const isCustom = customRoutes.some((r) => r.id === id);
    if (isCustom) {
      const updated = customRoutes.map((r) =>
        r.id === id ? { ...r, isSaved: !r.isSaved } : r
      );
      setCustomRoutes(updated);
      localStorage.setItem('pio_custom_routes', JSON.stringify(updated));
    } else {
      // Toggle saved state locally for default routes
      const savedKey = `pio_saved_ref_${id}`;
      const isCurrentlySaved = localStorage.getItem(savedKey) === 'true';
      localStorage.setItem(savedKey, (!isCurrentlySaved).toString());
      // trigger simple React re-render by loading
      loadCustomRoutes();
    }
  };

  // Helper check if default route is saved
  const isRouteSaved = (route: CommuterRoute): boolean => {
    if (route.creator === 'Your Custom Route') {
      return !!route.isSaved;
    }
    const saved = localStorage.getItem(`pio_saved_ref_${route.id}`);
    if (saved !== null) {
      return saved === 'true';
    }
    return !!route.isSaved;
  };

  // Trigger select route and center in route workspace
  const handleSelectRouteToEdit = (route: CommuterRoute) => {
    let routeWaypoints: Waypoint[] = [];

    if (route.id === 'base-1' || route.title.toLowerCase().includes('intramuros')) {
      routeWaypoints = [
        { id: '1', name: 'Fort Santiago, Intramuros', lat: 14.5942, lng: 120.9701, transitMode: route.transitMode },
        { id: '2', name: 'Manila Cathedral, Intramuros', lat: 14.5916, lng: 120.9734, transitMode: route.transitMode },
        { id: '3', name: 'National Museum of Fine Arts', lat: 14.5869, lng: 120.9812, transitMode: route.transitMode }
      ];
    } else if (route.id === 'base-2' || route.title.toLowerCase().includes('taft')) {
      routeWaypoints = [
        { id: '1', name: 'Rizal Monument, Luneta', lat: 14.5826, lng: 120.9787, transitMode: route.transitMode },
        { id: '2', name: 'Cultural Center of the Philippines', lat: 14.5571, lng: 120.9886, transitMode: route.transitMode },
        { id: '3', name: 'Taft Avenue DLSU Campus', lat: 14.5648, lng: 120.9932, transitMode: route.transitMode }
      ];
    } else if (route.id === 'base-3' || route.title.toLowerCase().includes('ayala') || route.title.toLowerCase().includes('mrt-3')) {
      routeWaypoints = [
        { id: '1', name: 'Ayala Triangle Gardens (Makati)', lat: 14.5574, lng: 121.0252, transitMode: route.transitMode },
        { id: '2', name: 'Ortigas Crossing Terminal', lat: 14.5847, lng: 121.0610, transitMode: route.transitMode },
        { id: '3', name: 'MRT-3 North Avenue Station', lat: 14.6533, lng: 121.0315, transitMode: route.transitMode }
      ];
    } else {
      // Custom/Other routes get smart mock points around Manila center
      const baseLat = 14.5995;
      const baseLng = 120.9842;
      routeWaypoints = [
        { id: '1', name: `${route.title} Origin`, lat: baseLat + (Math.random() - 0.5) * 0.02, lng: baseLng + (Math.random() - 0.5) * 0.02, transitMode: route.transitMode },
        { id: '2', name: `${route.title} Midway Hub`, lat: baseLat + (Math.random() - 0.5) * 0.01, lng: baseLng + (Math.random() - 0.5) * 0.01, transitMode: route.transitMode },
        { id: '3', name: `${route.title} Destination`, lat: baseLat + (Math.random() - 0.5) * 0.02, lng: baseLng + (Math.random() - 0.5) * 0.02, transitMode: route.transitMode }
      ];
    }

    setWaypoints(routeWaypoints);
    setTransitMode(route.transitMode);
    setActiveTab('routes');
  };

  // Asset CDN Fallback placeholders matching AI generated file name structure
  const HERO_BANNER_IMG = HeroBannerImg;
  const MASCOT_AVATAR_IMG = activeMascot.src;

  const displayRoutes = getDisplayRoutes();

  return (
    <div className={`min-h-screen transition-colors duration-300 flex flex-col items-center justify-start p-0 md:p-6 lg:p-10 font-sans ${isTikiNightMode ? 'bg-[#0b0f19] text-slate-200 tiki-night' : 'bg-[#f7f4ee] text-slate-800'}`}>
      {/* Absolute Header Ribbon */}
      <header className="hidden md:flex w-full max-w-6xl mx-auto mb-4 px-4 pt-4 md:px-0 items-center justify-between">
        <div className="flex items-center gap-3">
          <TiklingMascot size="sm" animated={true} />
          <div>
            <h1 className="font-sans font-bold text-slate-900 text-lg leading-tight tracking-tight">Tikling Assistant</h1>
            <p className="text-[10px] text-slate-400 font-mono tracking-widest uppercase">Route Intelligence</p>
          </div>
        </div>

        {/* Global Action Banner */}
        <div className="hidden sm:flex items-center gap-3">
          <div className="bg-white border border-slate-200 rounded-full px-3 py-1 text-xs font-medium text-slate-600 flex items-center gap-1.5 shadow-xs">
            <span className={`w-2 h-2 rounded-full ${isOffline ? 'bg-amber-400 animate-pulse' : 'bg-emerald-500'}`} />
            <span>{isOffline ? 'Offline Mode' : 'Direct Sync Live'}</span>
          </div>
          {isLowData && (
            <div className="bg-indigo-50 border border-indigo-100 rounded-full px-3 py-1 text-xs font-bold text-indigo-700 flex items-center gap-1">
              Low Data Active
            </div>
          )}
        </div>
      </header>

      {/* Main Container: Clean, fully responsive web and mobile workspace */}
      <div className="w-full max-w-6xl mx-auto md:mb-10 mb-0 px-0 md:px-4">
        {/* Main App Canvas */}
        <div className={`bg-white border-0 md:border border-slate-150 shadow-lg rounded-none md:rounded-3xl overflow-hidden flex flex-col lg:grid lg:grid-cols-[280px_1fr] lg:h-[820px] relative min-h-[780px] w-full transition-colors duration-300 ${isTikiNightMode ? 'tiki-night bg-slate-900 border-slate-800' : 'bg-white'}`}>
          
          {/* Persistent Desktop Left Sidebar (Visible only on lg displays) */}
          <aside className={`hidden lg:flex flex-col h-full border-r shrink-0 select-none overflow-y-auto text-left transition-colors duration-300 ${isTikiNightMode ? 'bg-[#0f172a] text-slate-200 border-slate-800' : 'bg-slate-900 text-white border-slate-800'}`}>
            {/* Sidebar Branding Header */}
            <div className="p-6 border-b border-slate-800 flex items-center gap-3 shrink-0">
              <TiklingMascot size="sm" animated={true} />
              <div>
                <h2 className="font-sans font-bold text-sm leading-tight text-white">Tikling Assistant</h2>
                <p className="text-[9px] text-indigo-400 font-mono tracking-wider mt-0.5">METEOROLOGICAL TRANSIT</p>
              </div>
            </div>

            {/* Navigation and Support Items */}
            <div className="p-5 flex flex-col gap-5 flex-grow overflow-y-auto">
              <div className="flex flex-col gap-1.5 shrink-0">
                <span className="text-[9px] font-sans font-bold text-slate-500 uppercase tracking-wider pl-2 mb-1">
                  Primary Views
                </span>
                
                <button
                  type="button"
                  onClick={() => setActiveTab('home')}
                  className={`w-full py-2.5 px-3.5 rounded-xl text-xs font-semibold font-sans flex items-center gap-3 transition-all cursor-pointer border-0 text-left ${
                    activeTab === 'home'
                      ? 'bg-indigo-600 text-white font-extrabold shadow-sm'
                      : 'bg-transparent text-slate-300 hover:text-white hover:bg-slate-800/60'
                  }`}
                >
                  <Home size={15} />
                  <span>Dashboard Home</span>
                </button>

                <button
                  type="button"
                  onClick={() => setActiveTab('routes')}
                  className={`w-full py-2.5 px-3.5 rounded-xl text-xs font-semibold font-sans flex items-center gap-3 transition-all cursor-pointer border-0 text-left ${
                    activeTab === 'routes'
                      ? 'bg-indigo-600 text-white font-extrabold shadow-sm'
                      : 'bg-transparent text-slate-300 hover:text-white hover:bg-slate-800/60'
                  }`}
                >
                  <RouteIcon size={15} />
                  <span>Corridor Designer</span>
                </button>

                <button
                  type="button"
                  onClick={() => setActiveTab('community')}
                  className={`w-full py-2.5 px-3.5 rounded-xl text-xs font-semibold font-sans flex items-center gap-3 transition-all cursor-pointer border-0 text-left ${
                    activeTab === 'community'
                      ? 'bg-indigo-600 text-white font-extrabold shadow-sm'
                      : 'bg-transparent text-slate-300 hover:text-white hover:bg-slate-800/60'
                  }`}
                >
                  <Users size={15} />
                  <span>Community Paths</span>
                </button>

                <button
                  type="button"
                  onClick={() => setActiveTab('profile')}
                  className={`w-full py-2.5 px-3.5 rounded-xl text-xs font-semibold font-sans flex items-center gap-3 transition-all cursor-pointer border-0 text-left ${
                    activeTab === 'profile'
                      ? 'bg-indigo-600 text-white font-extrabold shadow-sm'
                      : 'bg-transparent text-slate-300 hover:text-white hover:bg-slate-800/60'
                  }`}
                >
                  <User size={15} />
                  <span>User Profile</span>
                </button>
              </div>

              {/* Eco Savings Stat Widget */}
              <div className="bg-slate-800/40 border border-slate-800 p-4 rounded-2xl shrink-0">
                <div className="flex items-center gap-2 text-indigo-400">
                  <Sparkles size={14} className="animate-pulse" />
                  <span className="text-[11px] font-sans font-bold">Eco-Savings Badge</span>
                </div>
                <p className="text-slate-400 font-sans text-[10.5px] mt-1.5 leading-relaxed">
                  Active smart-transit mapping contribution is live.
                </p>
                <div className="flex gap-2.5 mt-3">
                  <div className="flex-1 bg-slate-900/60 p-2 rounded-xl text-center border border-slate-800/75">
                    <span className="text-[8px] text-slate-500 font-sans block">Carbon Saved</span>
                    <span className="text-[11px] font-sans font-bold text-emerald-400">12.4 Kg</span>
                  </div>
                  <div className="flex-1 bg-slate-900/60 p-2 rounded-xl text-center border border-slate-800/75">
                    <span className="text-[8px] text-slate-500 font-sans block">Level Status</span>
                    <span className="text-[11px] font-sans font-bold text-indigo-300">Tier 3</span>
                  </div>
                </div>
              </div>

              {/* Support Me Section in Sidebar as requested */}
              <div className="bg-amber-950/20 border border-amber-900/40 p-4 rounded-2xl shrink-0">
                <div className="flex items-center gap-2 text-amber-400">
                  <Heart size={14} className="fill-amber-400/20 animate-pulse" />
                  <span className="text-[11px] font-sans font-bold">Support Me</span>
                </div>
                <p className="text-slate-400 font-sans text-[10.5px] mt-1.5 leading-relaxed">
                  If Tikling Assistant has made your route planning easier, please consider supporting the ongoing development.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setTiklingAlert({
                      show: true,
                      title: 'Thank You for Supporting! 💖',
                      message: 'Your support is deeply appreciated! Connecting with jaredsfdev keeps the server running and updates rolling out.',
                      type: 'success'
                    });
                  }}
                  className="mt-3 w-full py-2 bg-amber-500 hover:bg-amber-600 text-white font-sans font-bold rounded-xl text-[10px] shadow-sm cursor-pointer text-center border-0 transition-colors"
                >
                  Buy Me a Coffee ☕
                </button>
              </div>
            </div>

            {/* Sidebar Footer credit line */}
            <div className="p-4 border-t border-slate-800 bg-slate-950/40 text-[10px] text-slate-500 font-sans flex flex-col gap-1.5 shrink-0">
              <div className="flex items-center justify-between font-mono text-[9px]">
                <span>Tiki Version 2.8</span>
                <span className="text-indigo-400 font-bold">Mascot Protected</span>
              </div>
              <div className="border-t border-slate-800/60 pt-2 flex items-center justify-between text-[10px]">
                <span className="text-slate-400 font-medium">Developed by</span>
                <span className="text-indigo-400 font-extrabold">jaredsfdev</span>
              </div>
            </div>
          </aside>

          {/* Actual Content Screen */}
          <div className={`pt-0 flex flex-col flex-grow pb-20 lg:pb-0 ${isTikiNightMode ? 'bg-[#0f172a]' : 'bg-white'} lg:h-[820px] lg:overflow-hidden relative`}>
            {/* Nav Header Row */}
            <div className={`px-5 py-3.5 flex items-center justify-between border-b border-slate-100 relative z-30 shrink-0 ${isTikiNightMode ? 'bg-slate-900 border-slate-800 text-white' : 'bg-white'}`}>
              <button
                onClick={() => setIsSidebarOpen(true)}
                className="lg:hidden text-slate-700 hover:text-indigo-600 p-2 rounded-xl bg-slate-50 border border-slate-100 transition-colors cursor-pointer"
                title="Open Tiki sidebar menu"
              >
                <Menu size={18} />
              </button>

              <div 
                onClick={() => {
                  setTiklingAlert({
                    show: true,
                    title: 'Hello from Tiki! 🐦',
                    message: "I'm Tiki, your friendly Philippine Tikling bird mascot! I run up and down the wetlands of OpenStreetMap to keep your custom travel planning simple, scenic, and super eco-positive!",
                    type: 'success'
                  });
                }}
                className="flex items-center gap-1.5 bg-indigo-50 hover:bg-indigo-100/80 px-3 py-1.5 rounded-full border border-indigo-100 transition-colors cursor-pointer"
              >
                <span className="text-[11px] font-sans font-bold text-indigo-800">Tiki Assistant 🐦</span>
              </div>

              <div className="flex items-center gap-2">
                {/* Tiki Night Mode Toggle Button */}
                <button
                  type="button"
                  onClick={() => {
                    const nextMode = !isTikiNightMode;
                    setIsTikiNightMode(nextMode);
                    localStorage.setItem('tikling_night_mode', nextMode ? 'true' : 'false');
                    setTiklingAlert({
                      show: true,
                      title: nextMode ? 'Under the Stars! ✨' : 'Good Morning! ☀️',
                      message: nextMode 
                        ? 'Cozy, low-light navigation active. Switched UI colors to deep midnight indigos and comfortable dark slates.' 
                        : 'Switched back to warm daylight papers. Pleasant safe transits ahead!',
                      type: 'success'
                    });
                  }}
                  className={`p-2 rounded-xl border transition-colors cursor-pointer ${
                    isTikiNightMode 
                      ? 'bg-slate-800 border-slate-750 text-amber-400 hover:text-amber-300' 
                      : 'bg-slate-50 border-slate-100 text-slate-700 hover:text-indigo-600 hover:bg-slate-100'
                  }`}
                  title={isTikiNightMode ? 'Switch to Light Mode' : 'Switch to Night Mode'}
                >
                  {isTikiNightMode ? <Sun size={18} /> : <Moon size={18} />}
                </button>

                {/* Notification Bell */}
                <div className="relative">
                  <button
                    onClick={() => {
                      setIsNotificationOpen(!isNotificationOpen);
                      setBellCount(0);
                    }}
                    className={`p-2 rounded-xl border transition-colors cursor-pointer ${
                      isNotificationOpen 
                        ? 'bg-indigo-50 border-indigo-200 text-indigo-600' 
                        : isTikiNightMode 
                          ? 'bg-slate-800 border-slate-750 text-slate-300 hover:text-white' 
                          : 'text-slate-700 hover:text-indigo-600 bg-slate-50 border-slate-100'
                    }`}
                    title="Tiki bulletins feed"
                  >
                    <Bell size={18} />
                  </button>
                  {bellCount > 0 && (
                    <span className="absolute -top-1 -right-1 w-4 h-4 bg-rose-500 rounded-full text-[10px] text-white font-bold flex items-center justify-center animate-bounce select-none">
                      {bellCount}
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Simulated Error Banner if App State is Error */}
            {appState === 'error' && (
              <div className="bg-rose-50 border-b border-rose-100 p-4 shrink-0">
                <div className="max-w-2xl mx-auto flex items-start gap-3">
                  <AlertCircle className="text-rose-500 mt-0.5 shrink-0" size={18} />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-bold text-rose-800 font-sans uppercase">SYSTEM ROUTE DISRUPTION</p>
                    <p className="text-xs text-rose-600 font-sans mt-0.5 leading-relaxed">
                      We experienced a timeout synchronizing with the central transit API. Standard schedules are temporarily restricted.
                    </p>
                    <button
                      onClick={() => {
                        setAppState('hasData');
                        setTiklingAlert({
                          show: true,
                          title: 'Sync Revitalized!',
                          message: 'Tiki successfully re-established contact with central transit lines! Standard grid options are back online.',
                          type: 'success'
                        });
                      }}
                      className="mt-2 bg-rose-600 hover:bg-rose-700 text-white font-sans text-[10px] font-bold py-1.5 px-3 rounded-lg transition-colors cursor-pointer inline-flex items-center gap-1"
                    >
                      Reset State and Force Recovery
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Scrollable Smartphone Content */}
            <main className="flex-1 overflow-y-auto px-5 py-4 flex flex-col gap-5 overflow-x-hidden">
              <AnimatePresence mode="wait">
                {activeTab === 'home' && (
                  <motion.div
                    key="home"
                    initial={{ opacity: 0, y: 15, scale: 0.98 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -15, scale: 0.98 }}
                    transition={{ type: "spring", stiffness: 350, damping: 26 }}
                    className="flex flex-col gap-5 w-full"
                  >
                  {/* Hero Image section referencing specific layout design */}
                  {appState !== 'empty' && appState !== 'error' && (
                    <div className="relative rounded-3xl h-52 overflow-hidden shadow-xs border border-slate-100 shrink-0">
                      <img
                        src={HERO_BANNER_IMG}
                        alt="PIO Mascot commuter guide in subway station"
                        className="w-full h-full object-cover"
                        referrerPolicy="no-referrer"
                      />
                      {/* Gradient shader for high reading contrast */}
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-900/10 to-transparent" />

                      {/* Cover Typography overlay */}
                      <div className="absolute bottom-4 left-5 right-5 text-white">
                        <span className="text-[10px] font-mono tracking-widest text-indigo-300 uppercase font-bold">
                          COMMUTER INTEL
                        </span>
                        <h2 className="font-sans font-bold text-xl md:text-2xl text-white tracking-tight mt-1">
                          Where to today?
                        </h2>
                        <p className="text-xs text-slate-200 mt-0.5 font-sans">
                          Let's sketch a calm corridor with PIO Mascot.
                        </p>
                      </div>

                      {/* Tiny Category Overlay badge */}
                      <div className="absolute top-4 right-4 bg-slate-900/70 backdrop-blur-md text-[9px] text-white font-mono uppercase px-2.5 py-1 rounded-full border border-slate-800">
                        Philippines Grid
                      </div>
                    </div>
                  )}

                  {/* Search Destination input with targets */}
                  <div className="relative shrink-0">
                    <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400">
                      <Search size={16} />
                    </span>
                    <input
                      type="text"
                      placeholder="Search a shared destination corridor..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-2xl pl-10 pr-10 py-3.5 text-sm text-slate-800 placeholder-slate-400 focus:outline-hidden focus:ring-2 focus:ring-indigo-600 font-sans shadow-xs"
                      aria-label="Search shared destination corridors"
                    />
                    <button
                      onClick={() => {
                        setSearchQuery('campus');
                        setTiklingAlert({
                          show: true,
                          title: 'Tiki Quick Search',
                          message: 'Filtered commute corridors containing the "Campus" keyword instantly!',
                          type: 'info'
                        });
                      }}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-indigo-600 transition-colors p-1 rounded-lg hover:bg-slate-100 cursor-pointer"
                      title="Quick Search Campus"
                      aria-label="Filter corridors containing the word campus"
                    >
                      <Locate size={15} />
                    </button>
                  </div>

                  {/* Category Pills Scroller Row (Teal active state for New Route) */}
                  <div className="flex gap-2 overflow-x-auto pb-1.5 pt-0.5 no-scrollbar shrink-0">
                    <button
                      onClick={() => {
                        setActiveTab('routes');
                      }}
                      className="bg-indigo-600 text-white py-2.5 px-4 rounded-xl text-xs font-semibold font-sans flex items-center gap-1.5 transition-all shadow-xs shrink-0 cursor-pointer hover:bg-indigo-700"
                    >
                      <RouteIcon size={14} /> New route
                    </button>

                    <button
                      onClick={() => {
                        setTiklingAlert({
                          show: true,
                          title: 'Favorite Feeds Highlighted',
                          message: 'Tiki has highlighted and pin-sorted your bookmarks at the head of theSuggested feed!',
                          type: 'success'
                        });
                      }}
                      className="bg-white hover:bg-slate-50 border border-slate-150 text-slate-700 py-2.5 px-4 rounded-xl text-xs font-semibold font-sans flex items-center gap-1.5 transition-all shrink-0 cursor-pointer"
                    >
                      <Star size={14} className="text-amber-400 fill-amber-100" /> Saved
                    </button>

                    <button
                      onClick={() => {
                        setTiklingAlert({
                          show: true,
                          title: 'Discovering Corridors',
                          message: 'Welcome to custom corridor discovery. Explore user pathways shared by students and professionals in the Philippines!',
                          type: 'info'
                        });
                        setActiveTab('community');
                      }}
                      className="bg-white hover:bg-slate-50 border border-slate-150 text-slate-700 py-2.5 px-4 rounded-xl text-xs font-semibold font-sans flex items-center gap-1.5 transition-all shrink-0 cursor-pointer"
                    >
                      <Compass size={14} /> Discover
                    </button>

                    {/* Low Data fast switch indicator pill button matching illustration screen */}
                    <button
                      onClick={() => {
                        setIsLowData(!isLowData);
                        setTiklingAlert({
                          show: true,
                          title: 'Data-Save Shield Switched',
                          message: `Tiki has toggled Low-Data mode ${!isLowData ? 'ON' : 'OFF'}. Vector layers are optimized to consume 60% fewer background bundles!`,
                          type: 'info'
                        });
                      }}
                      className={`py-2.5 px-4 rounded-xl text-xs font-semibold font-sans flex items-center gap-1.5 transition-all shrink-0 cursor-pointer border ${
                        isLowData
                          ? 'bg-indigo-50 border-indigo-200 text-indigo-700 font-bold'
                          : 'bg-white hover:bg-slate-50 border-slate-150 text-slate-700'
                      }`}
                    >
                      <ZapOff size={14} /> Low data
                    </button>

                    <button
                      onClick={() => {
                        setTiklingAlert({
                          show: true,
                          title: 'Current Location Radar',
                          message: 'Tiki has centered OpenStreetMap around Manila central. All transit options listed are within walking range!',
                          type: 'success'
                        });
                      }}
                      className="bg-white hover:bg-slate-50 border border-slate-150 text-slate-700 py-2.5 px-4 rounded-xl text-xs font-semibold font-sans flex items-center gap-1.5 transition-all shrink-0 cursor-pointer"
                    >
                      <MapPin size={14} /> Nearby
                    </button>
                  </div>

                  {/* Plan Your Route / Create First Route box (Onboarding graphic) */}
                  {appState === 'empty' ? (
                    <div className="bg-slate-50 border border-slate-200 rounded-3xl p-6 text-center shadow-xs">
                      <div className="w-16 h-16 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center mx-auto mb-3">
                        <RouteIcon size={30} />
                      </div>
                      <h3 className="font-sans font-bold text-slate-800 text-lg">Onboarding: Start sketching</h3>
                      <p className="text-xs text-slate-500 font-sans mt-2 max-w-sm mx-auto leading-relaxed">
                        To build a customized trip, tap "+ Create custom route" or double click locations directly. I'll automatically verify walking metrics and transfer delays!
                      </p>
                      <button
                        onClick={() => {
                          setAppState('hasData');
                          setActiveTab('routes');
                        }}
                        className="mt-4 bg-indigo-600 hover:bg-indigo-700 text-white font-sans text-xs font-semibold py-2.5 px-4 rounded-xl transition-all shadow-sm cursor-pointer"
                      >
                        Launch Route Editor Now
                      </button>
                    </div>
                  ) : (
                    /* General Illustrated Plan-your-route Box */
                    <div className="bg-slate-50 border border-slate-200/60 rounded-3xl p-5 flex flex-col md:flex-row items-center justify-between gap-4">
                      <div className="flex-1">
                        <h4 className="font-sans font-bold text-slate-900 text-sm">Plan your daily commute</h4>
                        <p className="text-xs text-slate-500 font-sans mt-1.5 leading-relaxed">
                          Pin your start, intermediate transfers and end destination stations on our interactive map. We'll outline your private travel pipeline in real time.
                        </p>
                        <button
                          onClick={() => {
                            setActiveTab('routes');
                          }}
                          className="mt-3.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold py-2.5 px-4 rounded-xl flex items-center gap-1 cursor-pointer transition-colors"
                        >
                          <Plus size={14} /> Create custom route
                        </button>
                      </div>

                      {/* Simulated isometric cute map thumbnail */}
                      <div className="w-32 h-24 rounded-2xl bg-indigo-900/10 border border-indigo-500/20 relative overflow-hidden flex items-center justify-center shrink-0">
                        <div className="absolute inset-0 bg-[linear-gradient(to_right,#4f46e5_1px,transparent_1px),linear-gradient(to_bottom,#4f46e5_1px,transparent_1px)] bg-[size:10px_10px] opacity-10" />
                        <svg className="w-full h-full p-2" viewBox="0 0 100 80">
                          {/* Curved dashed route */}
                          <path d="M 15,60 C 30,20 70,70 85,30" fill="none" stroke="#4f46e5" strokeWidth="2.5" strokeDasharray="3,3" />
                          <circle cx="15" cy="60" r="4" fill="#4f46e5" />
                          <circle cx="85" cy="30" r="4" fill="#ef4444" />
                          {/* Inner custom route label */}
                          <text x="50" y="70" textAnchor="middle" fill="#4f46e5" className="text-[6px] font-bold font-sans">
                            TIKLING ROUTE ACTIVE
                          </text>
                        </svg>
                      </div>
                    </div>
                  )}

                  {/* Suggested routes sections */}
                  <div>
                    <div className="flex items-center justify-between mb-3.5">
                      <h3 className="font-sans font-bold text-slate-800 text-sm uppercase tracking-wide">
                        Suggested routes for you
                      </h3>
                      <button
                        onClick={() => setActiveTab('community')}
                        className="text-xs font-semibold text-indigo-600 hover:text-indigo-700 flex items-center gap-0.5 cursor-pointer"
                      >
                        View all shared <ChevronRight size={14} />
                      </button>
                    </div>

                    <div className="flex flex-col gap-3">
                      {appState === 'loading' ? (
                        <>
                          <RouteCard isLoading={true} />
                          <RouteCard isLoading={true} />
                        </>
                      ) : displayRoutes.length === 0 ? (
                        <div className="border border-dashed border-slate-200/80 rounded-3xl p-6 text-center text-slate-400 bg-slate-50/50">
                          <p className="text-xs font-sans">No route suggestion matches your filter.</p>
                          <button
                            onClick={() => setSearchQuery('')}
                            className="mt-2 text-xs text-indigo-600 hover:underline font-semibold"
                          >
                            Clear search query
                          </button>
                        </div>
                      ) : (
                        displayRoutes.map((route) => (
                          <RouteCard
                            key={route.id}
                            route={{
                              ...route,
                              isSaved: isRouteSaved(route),
                            }}
                            onToggleSave={toggleSaveRoute}
                            onSelectRoute={handleSelectRouteToEdit}
                          />
                        ))
                      )}
                    </div>
                  </div>
                </motion.div>
              )}

              {/* TAB: Routes workspace tab */}
              {activeTab === 'routes' && (
                <motion.div
                  key="routes"
                  initial={{ opacity: 0, y: 15, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -15, scale: 0.98 }}
                  transition={{ type: "spring", stiffness: 350, damping: 26 }}
                  className="flex flex-col gap-4 w-full"
                >
                  {/* BEAUTIFUL WORKSPACE HEADER FEATURING TIKLING MASCOT */}
                  <div className="bg-gradient-to-r from-indigo-900 via-slate-900 to-slate-950 rounded-3xl p-5 border border-slate-800 shadow-md flex items-center gap-4 relative overflow-hidden shrink-0">
                    {/* Visual pattern background overlay */}
                    <div className="absolute inset-0 bg-[radial-gradient(#4f46e5_1px,transparent_1px)] [background-size:16px_16px] opacity-15" />
                    
                    {/* Cute Tikling Mascot inside the header */}
                    <div className="relative z-10 hidden sm:block">
                      <TiklingMascot size="sm" animated={false} />
                    </div>

                    <div className="flex-1 min-w-0 relative z-10">
                      <div className="flex items-center gap-2">
                        <span className="text-[9px] bg-indigo-500/20 border border-indigo-500/30 text-indigo-300 font-bold px-2 py-0.5 rounded-md uppercase font-mono tracking-wider">
                          Tiki Planner
                        </span>
                        {isOffline && (
                          <span className="text-[9px] bg-amber-500/20 border border-amber-500/30 text-amber-400 px-2 py-0.5 rounded-md font-bold uppercase font-mono">
                            Offline Safe
                          </span>
                        )}
                      </div>
                      
                      <h2 className="font-sans font-bold text-white text-base md:text-lg mt-1 tracking-tight">
                        Route Planner Corridor
                      </h2>
                      
                      <p className="text-slate-300 text-xs font-sans mt-1 leading-relaxed max-w-md">
                        {waypoints.length === 0 
                          ? "Tap anywhere on OpenStreetMap directly to sequence your stops, or choose preset shortcuts."
                          : `Currently mapping a ${waypoints.length}-stop travel corridor. Add transfer segments dynamically!`
                        }
                      </p>
                    </div>

                    {/* Quick clear button */}
                    {waypoints.length > 0 && (
                      <button
                        onClick={() => {
                          setWaypoints([]);
                          setTiklingAlert({
                            show: true,
                            title: 'Corridor Cleared',
                            message: 'Tiki Mascot cleared all active pinned stops. Tap the map to sketch a fresh pathway!',
                            type: 'info'
                          });
                        }}
                        className="bg-slate-800/80 hover:bg-rose-900/60 text-slate-300 hover:text-white border border-slate-700/60 rounded-xl px-2.5 py-1.5 text-[10px] font-bold font-sans self-end z-10 transition-colors cursor-pointer"
                        title="Clear all waypoints"
                      >
                        Reset stops
                      </button>
                    )}
                  </div>

                  <InteractiveMap
                    waypoints={waypoints}
                    onWaypointsChange={setWaypoints}
                    transitMode={transitMode}
                    onTransitModeChange={setTransitMode}
                    isLowData={isLowData}
                    isOffline={isOffline}
                    appState={appState}
                    isTikiNightMode={isTikiNightMode}
                  />

                  <WeatherOutlook
                    waypoints={waypoints}
                    isOffline={isOffline}
                    isTikiNightMode={isTikiNightMode}
                  />

                  <GtfsScheduleBrowser
                    onImportWaypoints={(wps, mode) => {
                      setWaypoints(wps);
                      setTransitMode(mode);
                    }}
                    onPinWaypoint={(wp) => {
                      setWaypoints((prev) => [...prev, wp]);
                    }}
                    currentWaypoints={waypoints}
                    onAddLogMessage={(title, msg, type) => {
                      setTiklingAlert({
                        show: true,
                        title,
                        message: msg,
                        type
                      });
                    }}
                  />


                </motion.div>
              )}

              {/* TAB: Community routes catalog */}
              {activeTab === 'community' && (
                <motion.div
                  key="community"
                  initial={{ opacity: 0, y: 15, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -15, scale: 0.98 }}
                  transition={{ type: "spring", stiffness: 350, damping: 26 }}
                  className="flex flex-col gap-4 w-full"
                >
                  <div className="bg-indigo-900 text-white rounded-3xl p-5 flex flex-col gap-1.5">
                    <span className="text-[9px] font-mono tracking-widest text-indigo-300 uppercase font-bold">
                      Local Feed Directory
                    </span>
                    <h2 className="font-sans font-bold text-lg">Community Corridor Hub</h2>
                    <p className="text-xs text-indigo-200 leading-normal font-sans">
                      Passengers and commuter students share their custom route paths to save transfer delays. Clone any pathway to load it immediately!
                    </p>
                  </div>

                  <div className="flex flex-col gap-3">
                    {DEFAULT_ROUTES.map((route) => (
                      <RouteCard
                        key={route.id}
                        route={{
                          ...route,
                          isSaved: isRouteSaved(route),
                        }}
                        onToggleSave={toggleSaveRoute}
                        onSelectRoute={handleSelectRouteToEdit}
                      />
                    ))}
                  </div>
                </motion.div>
              )}

              {/* TAB: User profile tab */}
              {activeTab === 'profile' && (
                <motion.div
                  key="profile"
                  initial={{ opacity: 0, y: 15, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -15, scale: 0.98 }}
                  transition={{ type: "spring", stiffness: 350, damping: 26 }}
                  className="flex flex-col gap-4 w-full"
                >
                  {/* User Stats Card */}
                  <div className="bg-white border border-slate-150 rounded-3xl p-5 flex flex-col gap-4">
                    <div className="flex items-center gap-4">
                      <div className="relative select-none shrink-0">
                        <div className="w-16 h-16 rounded-full border-2 border-[#cd5f39] overflow-hidden bg-slate-100 shadow-sm relative">
                          <img src={MASCOT_AVATAR_IMG} alt="User transit avatar" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                        </div>
                        <span className="absolute -bottom-1 -right-1 bg-[#46868e] text-white px-1.5 py-0.5 rounded-full text-[8px] border border-white font-bold leading-none shadow-xs">
                          {activeMascot.name}
                        </span>
                      </div>
                      
                      <div className="flex-grow min-w-0">
                        <div>
                          <input 
                            type="text" 
                            value={profileName}
                            onChange={(e) => {
                              setProfileName(e.target.value);
                              localStorage.setItem('tikling_profile_name', e.target.value);
                            }}
                            className="font-sans font-bold text-slate-900 text-base bg-transparent hover:bg-slate-50 focus:bg-white px-2 py-0.5 rounded-lg border-0 focus:ring-2 focus:ring-indigo-600 focus:outline-hidden w-full max-w-[200px] transition-all"
                            placeholder="Enter Name"
                            aria-label="User profile name input"
                          />
                        </div>
                        <input
                          type="text"
                          value={profileSubtitle}
                          onChange={(e) => {
                            setProfileSubtitle(e.target.value);
                            localStorage.setItem('tikling_profile_subtitle', e.target.value);
                          }}
                          className="text-xs text-slate-550 font-sans bg-transparent hover:bg-slate-50 focus:bg-white px-2 py-0.5 mt-0.5 rounded-md border-0 focus:ring-2 focus:ring-indigo-600 focus:outline-hidden w-full transition-all"
                          placeholder="Your Tagline"
                          aria-label="User profile subtitle input"
                        />
                        <div className="flex flex-wrap items-center gap-2 mt-2 px-2">
                          <span className="text-[9px] bg-indigo-50 border border-indigo-100 font-bold text-indigo-700 px-2 py-0.5 rounded-md uppercase font-mono animate-pulse">
                            {kilometersTracked} Km Tracked
                          </span>
                          <span className="text-[9px] bg-emerald-50 border border-emerald-100 font-bold text-emerald-700 px-2 py-0.5 rounded-md uppercase font-mono">
                            {(kilometersTracked * 0.0135).toFixed(1)} Kg CO2 Saved
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Choose Transit Companion Mascot section */}
                    <div className="border-t border-slate-100 pt-4">
                      <div className="flex items-center justify-between mb-3">
                        <h4 className="font-sans font-bold text-slate-800 text-[10px] uppercase tracking-wider">
                          Transit Companion Mascot
                        </h4>
                        <span className="text-[9px] font-sans font-bold text-[#cd5f39] px-2 py-0.5 bg-indigo-50 rounded-full border border-indigo-100">
                          Active: {activeMascot.name}
                        </span>
                      </div>
                      
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {MASCOT_OPTIONS.map((mascot) => {
                          const isSelected = selectedMascotId === mascot.id;
                          return (
                            <button
                              key={mascot.id}
                              onClick={() => {
                                setSelectedMascotId(mascot.id);
                                localStorage.setItem('tikling_selected_mascot_id', mascot.id);
                                setTiklingAlert({
                                  show: true,
                                  title: `Companion Swapped: ${mascot.name}! 🐦`,
                                  message: `${mascot.name} (${mascot.species}) has happily assumed companion tracking. "${mascot.description}"`,
                                  type: 'success'
                                });
                              }}
                              className={`flex items-center gap-3 p-2.5 rounded-2xl border text-left cursor-pointer transition-all ${
                                isSelected 
                                  ? 'bg-indigo-50 border-[#cd5f39] ring-1 ring-[#cd5f39]/20 shadow-xs' 
                                  : 'bg-white border-slate-150 hover:bg-slate-50'
                              }`}
                            >
                              <div className="w-10 h-10 rounded-full overflow-hidden border border-slate-200 bg-slate-50 shrink-0 relative">
                                <img src={mascot.src} alt={mascot.name} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                              </div>
                              <div className="min-w-0 flex-1">
                                <div className="flex items-center gap-1.5">
                                  <span className="text-xs font-bold text-slate-800 truncate">{mascot.name}</span>
                                  <span className="text-[8px] text-[#46868e] truncate uppercase font-mono font-bold">
                                    {mascot.species}
                                  </span>
                                </div>
                                <p className="text-[10px] text-slate-400 font-sans line-clamp-1 mt-0.5">
                                  {mascot.description}
                                </p>
                              </div>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  </div>

                  {/* Commuter Milestones Section */}
                  <div className="bg-white border border-slate-150 rounded-3xl p-5 flex flex-col gap-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5">
                        <Award className="text-[#cd5f39] shrink-0" size={16} />
                        <h4 className="font-sans font-bold text-slate-800 text-[10px] uppercase tracking-wider">
                          Commuter Milestones
                        </h4>
                      </div>
                      <span className="text-[10px] font-mono font-bold text-[#cd5f39] px-2.5 py-0.5 bg-[#cd5f39]/5 rounded-full border border-[#cd5f39]/10">
                        {MILESTONES.filter(m => m.condition).length} / {MILESTONES.length} Unlocked
                      </span>
                    </div>

                    <p className="text-[11px] text-slate-400 font-sans leading-relaxed">
                      Earn native badges as you bookmark commuter corridors and log travel distance. Tap badges below to view comments!
                    </p>

                    {/* Milestones grid list */}
                    <div className="grid grid-cols-2 gap-2.5 bg-slate-50/30 p-2.5 rounded-2xl border border-slate-100">
                      {MILESTONES.map((badge) => {
                        const isUnlocked = badge.condition;
                        const BadgeIcon = badge.icon;
                        const progressPercent = Math.min(100, Math.round((badge.currentValue / badge.targetValue) * 100));
                        const isSelected = selectedMilestoneId === badge.id;

                        return (
                          <button
                            key={badge.id}
                            id={`milestone-badge-${badge.id}`}
                            onClick={() => {
                              setSelectedMilestoneId(badge.id);
                              // Trigger a subtle companion talk alert
                              setTiklingAlert({
                                show: true,
                                title: isUnlocked ? `Unlocked: ${badge.title}! 🏆` : `Progressing: ${badge.title} ⏳`,
                                message: isUnlocked 
                                  ? `"${badge.description}" — Companion Reward Active!`
                                  : `Requires ${badge.requirement}. You've currently achieved ${badge.currentValue} / ${badge.targetValue} ${badge.metricLabel}!`,
                                type: isUnlocked ? 'success' : 'info'
                              });
                            }}
                            className={`flex flex-col gap-2 p-3 rounded-2xl border text-left cursor-pointer transition-all ${
                              isUnlocked 
                                ? isSelected
                                  ? 'bg-[#cd5f39]/5 border-[#cd5f39] ring-2 ring-[#cd5f39]/10 shadow-xs'
                                  : 'bg-white border-slate-200 hover:bg-slate-50'
                                : isSelected 
                                  ? 'bg-slate-150 border-slate-300 ring-2 ring-slate-100 shadow-2xs'
                                  : 'bg-white/40 border-slate-200/60 opacity-70 hover:opacity-100 transition-opacity'
                            }`}
                          >
                            <div className="flex items-center justify-between w-full">
                              <div className={`p-1.5 rounded-lg border ${
                                isUnlocked 
                                  ? 'bg-emerald-50 border-emerald-200 text-emerald-600' 
                                  : 'bg-slate-100 border-slate-200 text-slate-400'
                              }`}>
                                <BadgeIcon size={14} className={isUnlocked ? 'animate-pulse' : ''} />
                              </div>

                              {isUnlocked ? (
                                <span className="text-[8px] bg-emerald-50 font-bold font-mono text-emerald-700 px-1.5 py-0.5 rounded-full uppercase border border-emerald-100 leading-none">
                                  Earned
                                </span>
                              ) : (
                                <span className="text-[8px] bg-slate-100 font-bold font-mono text-slate-400 px-1.5 py-0.5 rounded-full uppercase border border-slate-200 leading-none flex items-center gap-0.5">
                                  <Lock size={7} /> {progressPercent}%
                                </span>
                              )}
                            </div>

                            <div className="min-w-0">
                              <span className="text-[11px] font-bold text-slate-800 block truncate leading-none mb-1">
                                {badge.title}
                              </span>
                              <span className="text-[9px] text-slate-400 font-sans block truncate leading-tight">
                                {badge.requirement}
                              </span>
                            </div>

                            {/* Cute progress bar */}
                            <div className="w-full mt-1">
                              <div className="w-full h-1 bg-slate-100 rounded-full overflow-hidden">
                                <div 
                                  className={`h-full rounded-full transition-all duration-500 ${
                                    isUnlocked ? 'bg-emerald-500' : 'bg-slate-300'
                                  }`}
                                  style={{ width: `${progressPercent}%` }}
                                />
                              </div>
                              <span className="text-[8px] text-slate-400 font-mono mt-1 block">
                                {Math.min(badge.targetValue, badge.currentValue)} / {badge.targetValue} {badge.metricLabel}
                              </span>
                            </div>
                          </button>
                        );
                      })}
                    </div>

                    {/* Selected Milestone expander detail */}
                    {selectedMilestoneId && (() => {
                      const selectedMilestone = MILESTONES.find(m => m.id === selectedMilestoneId);
                      if (!selectedMilestone) return null;
                      const isUnlocked = selectedMilestone.condition;
                      
                      return (
                        <div className="bg-[#46868e]/5 border border-[#46868e]/20 rounded-2xl p-3 flex gap-3 relative animate-fadeIn">
                          <span className="absolute -top-1.5 left-8 w-3 h-3 bg-white border-t border-l border-[#46868e]/20 rotate-45" />
                          <div className="w-9 h-9 text-xs font-bold shrink-0 relative bg-white rounded-full flex items-center justify-center border border-[#46868e]/20">
                            <img src={MASCOT_AVATAR_IMG} alt="Companion avatar" className="w-7 h-7 rounded-full object-cover" />
                          </div>
                          <div className="flex-grow min-w-0">
                            <div className="flex items-center justify-between mb-0.5">
                              <span className="text-[10px] font-bold text-[#46868e] uppercase font-sans tracking-wide">
                                {activeMascot.name}'s Companion Log
                              </span>
                              <span className="text-[9px] font-mono font-bold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded-sm border border-emerald-100">
                                {selectedMilestone.rewardText}
                              </span>
                            </div>
                            <p className="text-[10px] font-medium text-slate-700 italic">
                              "{selectedMilestone.description}"
                            </p>
                          </div>
                        </div>
                      );
                    })()}
                  </div>

                  {/* Commuter Progress Simulator Panel */}
                  <div className="bg-white border border-slate-150 rounded-3xl p-5 flex flex-col gap-3.5">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5">
                        <RefreshCw className="text-[#46868e] shrink-0" size={14} />
                        <h4 className="font-sans font-bold text-slate-800 text-[10px] uppercase tracking-wider">
                          Transit Progress Simulator
                        </h4>
                      </div>
                      <span className="text-[8px] uppercase tracking-wider font-bold bg-[#46868e]/10 text-[#46868e] px-2 py-0.5 rounded-full font-sans">
                        Developer Tool
                      </span>
                    </div>

                    <p className="text-[11px] text-slate-400 font-sans leading-normal">
                      Simulate travel distance outputs inside the applet environment to instantly test locked/unlocked milestones, and companion alerts!
                    </p>

                    <div className="flex flex-col gap-2.5">
                      {/* Interactive slide bar */}
                      <div className="flex items-center gap-3">
                        <input
                          id="simulator-range-input"
                          type="range"
                          min="0"
                          max="1200"
                          step="10"
                          value={kilometersTracked}
                          onChange={(e) => {
                            const val = parseInt(e.target.value, 10);
                            handleSimulateKm(val - kilometersTracked);
                          }}
                          className="flex-1 accent-[#cd5f39] h-1.5 bg-slate-100 rounded-lg appearance-none cursor-pointer"
                          aria-label="Simulated kilometers slider"
                        />
                        <span className="text-xs font-mono font-bold text-slate-700 bg-slate-50 px-2 py-1 rounded-md border border-slate-200">
                          {kilometersTracked} Km
                        </span>
                      </div>

                      {/* Speed addition buttons */}
                      <div className="grid grid-cols-4 gap-1.5">
                        <button
                          id="simulator-add-25-btn"
                          onClick={() => handleSimulateKm(25)}
                          className="text-[10px] font-sans font-bold text-slate-700 bg-white border border-slate-200 rounded-xl py-1.5 cursor-pointer hover:bg-slate-50 active:bg-slate-100 hover:border-slate-300 transition-all text-center"
                          aria-label="Add 25 kilometers of tracking"
                        >
                          +25 Km
                        </button>
                        <button
                          id="simulator-add-100-btn"
                          onClick={() => handleSimulateKm(100)}
                          className="text-[10px] font-sans font-bold text-slate-700 bg-white border border-slate-200 rounded-xl py-1.5 cursor-pointer hover:bg-slate-50 active:bg-slate-100 hover:border-slate-300 transition-all text-center"
                          aria-label="Add 100 kilometers of tracking"
                        >
                          +100 Km
                        </button>
                        <button
                          id="simulator-add-250-btn"
                          onClick={() => handleSimulateKm(250)}
                          className="text-[10px] font-sans font-bold text-slate-700 bg-white border border-[#46868e]/30 rounded-xl py-1.5 cursor-pointer hover:bg-slate-50 active:bg-slate-100 hover:border-slate-300 transition-all text-center text-[#46868e]"
                          aria-label="Add 250 kilometers of tracking"
                        >
                          +250 Km
                        </button>
                        <button
                          id="simulator-reset-btn"
                          onClick={() => handleSimulateKm(-1)}
                          className="text-[10px] font-sans font-bold text-slate-500 bg-slate-50 border border-slate-200 hover:bg-rose-50 hover:text-rose-600 hover:border-rose-200 rounded-xl py-1.5 cursor-pointer transition-all text-center"
                          aria-label="Reset kilometers tracked"
                        >
                          Reset
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Bookmark List title */}
                  <div>
                    <h4 className="font-sans font-bold text-slate-800 text-xs uppercase tracking-wider mb-2.5">
                      My Commuter Bookmarks
                    </h4>
                    {customRoutes.length === 0 ? (
                      <div className="border border-dashed border-slate-200 rounded-3xl p-6 text-center text-slate-400 bg-slate-50/50">
                        <p className="text-xs font-sans">You haven't designed custom routes yet.</p>
                        <button
                          onClick={() => setActiveTab('routes')}
                          className="mt-2 text-xs text-indigo-600 hover:underline font-semibold"
                        >
                          Create one now in the workspace
                        </button>
                      </div>
                    ) : (
                      <div className="flex flex-col gap-3">
                        {customRoutes.map((route) => (
                          <RouteCard
                            key={route.id}
                            route={route}
                            onToggleSave={toggleSaveRoute}
                            onSelectRoute={handleSelectRouteToEdit}
                          />
                        ))}
                      </div>
                    )}
                  </div>
                </motion.div>
              )}

              {/* TAB: Donation / Rewards tab */}
              {activeTab === 'donation' && (
                <motion.div
                  key="donation"
                  initial={{ opacity: 0, y: 15, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -15, scale: 0.98 }}
                  transition={{ type: "spring", stiffness: 350, damping: 26 }}
                  className="flex flex-col gap-4 w-full"
                >
                  {/* BEAUTIFUL BANNER SECTION */}
                  <div className="bg-gradient-to-r from-[#46868e] via-indigo-900 to-indigo-950 text-white rounded-3xl p-5 relative overflow-hidden shadow-md">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -mr-10 -mt-10 blur-xl" />
                    <span className="text-[9px] font-mono tracking-widest text-[#d8f0f2] uppercase font-bold">
                       Philanthropic Rewards Pool
                    </span>
                    <h2 className="font-sans font-bold text-xl leading-tight mt-1">
                      Support Eco Commuters
                    </h2>
                    <p className="font-sans text-xs text-indigo-150 mt-2 leading-relaxed">
                      Sponsor train passes, walking shoe subsidies, and cycling gear for Manila's top low-carbon transit champions.
                    </p>
                  </div>

                  {/* ACTIVE POOL STATUS CARD */}
                  <div className="bg-white border border-slate-150 rounded-3xl p-5 flex flex-col gap-3.5 shadow-xs">
                    <div className="flex items-center justify-between">
                      <div className="text-left">
                        <span className="text-[10px] text-slate-400 block font-semibold uppercase tracking-wider font-sans">
                          Active Rewards Target
                        </span>
                        <span className="text-base font-bold text-slate-800 font-sans">
                          ₱{donationPoolCurrent.toLocaleString()} / ₱{donationPoolGoal.toLocaleString()} PHP
                        </span>
                      </div>
                      <div className="bg-indigo-50 border border-indigo-100 rounded-2xl px-2.5 py-1 text-right">
                        <span className="text-[10px] font-mono font-bold text-indigo-600">
                          {((donationPoolCurrent / donationPoolGoal) * 100).toFixed(1)}% Goal
                        </span>
                      </div>
                    </div>

                    {/* Styled progress bar */}
                    <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                      <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: `${Math.min((donationPoolCurrent / donationPoolGoal) * 100, 100)}%` }}
                        transition={{ duration: 1.2, ease: "easeOut" }}
                        className="h-full bg-gradient-to-r from-[#46868e] to-indigo-650 rounded-full"
                      />
                    </div>

                    <div className="flex items-center gap-2 text-left bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                      <HelpCircle size={14} className="text-[#46868e] shrink-0" />
                      <p className="text-[10.5px] text-slate-500 font-sans leading-relaxed">
                        <strong>100% Transparency:</strong> Community donations are matched and pooled directly to purchase smart-commute load for low-income passengers.
                      </p>
                    </div>
                  </div>

                  {/* MASCOT CHIRP SPEED PANEL */}
                  <div className="bg-[#fcf9f2] border border-[#f0e7d0] rounded-3xl p-4 flex gap-[#cba] items-start text-left relative overflow-hidden">
                    <div className="shrink-0 pt-0.5">
                      <div className="w-10 h-10 rounded-full overflow-hidden bg-[#e0cc96] border border-amber-300 flex items-center justify-center shadow-xs">
                        {/* We reuse the avatar img representing Tikling */}
                        <img src={MASCOT_AVATAR_IMG} alt="Tikling" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                      </div>
                    </div>
                    <div className="flex-grow min-w-0">
                      <span className="font-sans font-bold text-[#cd5f39] text-xs block mb-0.5">
                        {activeMascot.name} says...
                      </span>
                      <p className="text-slate-600 font-sans text-xs leading-relaxed italic">
                        "Tweeet! High carbon emissions belong in the past. Your pooled donations purchase real GCash train passes and hydration units for daily commuters who log 20+ kilometers weekly!"
                      </p>
                    </div>
                    {/* Artistic leaf watermark */}
                    <Leaf size={64} className="absolute right-[-15px] bottom-[-15px] text-amber-200/25 rotate-45 pointer-events-none" />
                  </div>

                  {/* SPONSORSHIP CHOICES & PRESETS */}
                  <div className="bg-white border border-slate-150 rounded-3xl p-5 flex flex-col gap-4 text-left shadow-xs">
                    <h3 className="font-sans font-bold text-slate-800 text-xs uppercase tracking-wider">
                      Select Sponsorship Level
                    </h3>

                    <div className="grid grid-cols-2 gap-2.5">
                      {/* Preset 1 (₱50) */}
                      <button
                        type="button"
                        id="preset-50-btn"
                        onClick={() => {
                          setSelectedDonationPreset(50);
                          setIsCustomDonation(false);
                        }}
                        className={`p-3 rounded-2xl border text-left flex flex-col transition-all cursor-pointer ${
                          !isCustomDonation && selectedDonationPreset === 50
                            ? 'bg-indigo-50 border-indigo-500 ring-2 ring-indigo-500/10'
                            : 'border-slate-150 bg-slate-50 hover:bg-slate-100'
                        }`}
                      >
                        <span className="font-sans font-bold text-slate-800 text-sm">₱50 PHP</span>
                        <span className="text-[10px] text-slate-400 mt-1 block">1 Single Ride</span>
                      </button>

                      {/* Preset 2 (₱150) */}
                      <button
                        type="button"
                        id="preset-150-btn"
                        onClick={() => {
                          setSelectedDonationPreset(150);
                          setIsCustomDonation(false);
                        }}
                        className={`p-3 rounded-2xl border text-left flex flex-col transition-all cursor-pointer ${
                          !isCustomDonation && selectedDonationPreset === 150
                            ? 'bg-indigo-50 border-indigo-500 ring-2 ring-indigo-500/10'
                            : 'border-slate-150 bg-slate-50 hover:bg-slate-100'
                        }`}
                      >
                        <span className="font-sans font-bold text-slate-800 text-sm">₱150 PHP</span>
                        <span className="text-[10px] text-slate-400 mt-1 block">3 Bus Subsidies</span>
                      </button>

                      {/* Preset 3 (₱300) */}
                      <button
                        type="button"
                        id="preset-300-btn"
                        onClick={() => {
                          setSelectedDonationPreset(300);
                          setIsCustomDonation(false);
                        }}
                        className={`p-3 rounded-2xl border text-left flex flex-col transition-all cursor-pointer ${
                          !isCustomDonation && selectedDonationPreset === 300
                            ? 'bg-indigo-50 border-indigo-500 ring-2 ring-indigo-500/10'
                            : 'border-slate-150 bg-slate-50 hover:bg-slate-100'
                        }`}
                      >
                        <span className="font-sans font-bold text-slate-800 text-sm">₱300 PHP</span>
                        <span className="text-[10px] text-slate-400 mt-1 block">Hydration Cup Pack</span>
                      </button>

                      {/* Preset 4 (₱1000) */}
                      <button
                        type="button"
                        id="preset-1000-btn"
                        onClick={() => {
                          setSelectedDonationPreset(1000);
                          setIsCustomDonation(false);
                        }}
                        className={`p-3 rounded-2xl border text-left flex flex-col transition-all cursor-pointer ${
                          !isCustomDonation && selectedDonationPreset === 1000
                            ? 'bg-indigo-50 border-indigo-500 ring-2 ring-indigo-500/10'
                            : 'border-slate-150 bg-slate-50 hover:bg-slate-100'
                        }`}
                      >
                        <span className="font-sans font-bold text-indigo-750 text-sm">₱1,000 PHP</span>
                        <span className="text-[10px] text-slate-400 mt-1 block">Weekly Pass HERO</span>
                      </button>
                    </div>

                    {/* Custom donation trigger */}
                    <div className="border-t border-slate-100 pt-3.5 text-left">
                      <button
                        type="button"
                        id="custom-mode-trigger"
                        onClick={() => setIsCustomDonation(true)}
                        className={`text-xs font-sans font-bold ${
                          isCustomDonation ? 'text-[#46868e]' : 'text-slate-400 hover:text-slate-600'
                        }`}
                      >
                        {isCustomDonation ? '✓ Entering custom sponsor amount:' : '+ Enter custom coin tip (PHP)'}
                      </button>

                      {isCustomDonation && (
                        <div className="mt-2 flex gap-2">
                          <div className="relative flex-grow">
                            <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400 font-mono">
                              ₱
                            </span>
                            <input
                              type="number"
                              id="custom-donation-input-field"
                              placeholder="e.g. 250"
                              value={customDonationInput}
                              onChange={(e) => setCustomDonationInput(e.target.value)}
                              className="w-full pl-7 pr-3 py-2 rounded-2xl border border-slate-200 text-xs bg-slate-50 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-indigo-500 transition-all font-mono"
                            />
                          </div>
                          <span className="text-[10px] text-slate-400 self-center font-sans">PHP</span>
                        </div>
                      )}
                    </div>

                    {/* MAIN CTA BUTTON */}
                    <button
                      type="button"
                      id="submit-donation-cta"
                      onClick={() => {
                        const finalAmount = isCustomDonation 
                          ? parseFloat(customDonationInput) 
                          : selectedDonationPreset;
                        handlePerformDonation(finalAmount);
                      }}
                      className="w-full bg-gradient-to-r from-[#46868e] to-indigo-600 hover:from-[#3a6f76] hover:to-indigo-700 text-white font-sans font-bold py-3 rounded-2xl text-xs flex items-center justify-center gap-2 transition-all cursor-pointer shadow-sm hover:shadow-md"
                    >
                      <Gift size={14} />
                      <span>
                        Simulate ₱
                        {(isCustomDonation ? (parseFloat(customDonationInput) || 0) : selectedDonationPreset).toLocaleString()} PHP Payment
                      </span>
                    </button>
                  </div>

                  {/* SUCCESS CELEBRATION DISCOVER CARD */}
                  <AnimatePresence>
                    {donationSuccessMsg && (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0 }}
                        className="bg-emerald-50 border border-emerald-200 rounded-3xl p-5 text-left relative overflow-hidden"
                      >
                        <button
                          type="button"
                          id="close-donation-success"
                          className="absolute top-3.5 right-3.5 p-1 rounded-lg hover:bg-emerald-100 text-emerald-800 transition-colors cursor-pointer border-0"
                          onClick={() => setDonationSuccessMsg(false)}
                        >
                          <X size={14} />
                        </button>

                        <div className="flex gap-3">
                          <div className="w-9 h-9 rounded-full bg-emerald-500 text-white flex items-center justify-center shrink-0 shadow-xs">
                            <Check size={16} />
                          </div>
                          <div className="flex-grow">
                            <h4 className="font-sans font-bold text-emerald-800 text-sm"> Sponsoring Badge Acquired!</h4>
                            <p className="text-emerald-700 font-sans text-xs mt-1 leading-relaxed">
                              Successfully sponsored {lastContributedAmount >= 1000 ? 'a Weekly Pass' : lastContributedAmount >= 300 ? 'Hydration Supplies' : lastContributedAmount >= 150 ? '3 Local rides' : '1 Single Ride'}. Thank you for promoting clean commutes! Your contribution was simulated and logged instantly below.
                            </p>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* HERO HALL OF FAME DIRECTORY */}
                  <div className="bg-white border border-slate-150 rounded-3xl p-5 flex flex-col gap-4 text-left shadow-xs">
                    <div className="flex items-center justify-between">
                      <h3 className="font-sans font-bold text-slate-800 text-xs uppercase tracking-wider">
                        Donor Leaderboard
                      </h3>
                      <span className="text-[10px] text-[#46868e] font-sans font-bold">
                        Live updates
                      </span>
                    </div>

                    <div className="flex flex-col divide-y divide-slate-100">
                      {topContributors.map((c) => (
                        <div key={c.id} className="py-3.5 flex items-center justify-between first:pt-0 last:pb-0">
                          <div className="flex items-center gap-2.5">
                            <div className="w-7 h-7 rounded-full bg-indigo-50 border border-indigo-100 flex items-center justify-center text-xs text-indigo-700 font-bold shrink-0 animate-pulse">
                              {c.name.charAt(0)}
                            </div>
                            <div>
                              <span className="font-sans font-semibold text-slate-800 text-xs block">
                                {c.name}
                              </span>
                              <span className="text-[10px] text-slate-400 block mt-0.5">
                                {c.category} • {c.date}
                              </span>
                            </div>
                          </div>
                          <span className="font-sans font-mono font-bold text-xs text-[#46868e] bg-indigo-50/50 border border-indigo-100/20 px-2 py-0.5 rounded-lg">
                            ₱{c.quantity} PHP
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}
              </AnimatePresence>
            </main>

            {/* Smart Phone Navigation Tab Bar (Visual Floating design matching bottom rail) */}
            <nav className="absolute bottom-0 inset-x-0 lg:hidden bg-white/95 backdrop-blur-md border-t border-slate-100 py-2.5 px-4 flex items-center justify-around z-30">
              <button
                onClick={() => setActiveTab('home')}
                className={`flex flex-col items-center gap-0.5 transition-all cursor-pointer ${
                  activeTab === 'home' ? 'text-indigo-600 font-semibold' : 'text-slate-400 hover:text-slate-600'
                }`}
              >
                <Home size={18} />
                <span className="text-[10px] font-sans">Home</span>
              </button>

              <button
                onClick={() => setActiveTab('routes')}
                className={`flex flex-col items-center gap-0.5 transition-all cursor-pointer ${
                  activeTab === 'routes' ? 'text-indigo-600 font-semibold' : 'text-slate-400 hover:text-slate-600'
                }`}
              >
                <RouteIcon size={18} />
                <span className="text-[10px] font-sans">Routes</span>
              </button>

              {/* Elevated Action Plus Button in Center circle */}
              <div className="relative -top-4">
                <button
                  onClick={() => {
                    // Instantly trigger custom pin flow
                    setWaypoints([
                      { id: 'start', name: 'Fort Santiago Intramuros', lat: 14.5942, lng: 120.9701 },
                      { id: 'end', name: 'Ayala Triangle Gardens (Makati)', lat: 14.5574, lng: 121.0252 }
                    ]);
                    setActiveTab('routes');
                  }}
                  className="w-12 h-12 rounded-full bg-indigo-600 hover:bg-indigo-700 text-white flex items-center justify-center shadow-lg transition-transform focus:scale-105 active:scale-95 cursor-pointer border-4 border-white"
                  title="Design custom trip"
                >
                  <Plus size={22} className="stroke-[3]" />
                </button>
              </div>

              <button
                onClick={() => setActiveTab('community')}
                className={`flex flex-col items-center gap-0.5 transition-all cursor-pointer ${
                  activeTab === 'community' ? 'text-indigo-600 font-semibold' : 'text-slate-400 hover:text-slate-600'
                }`}
              >
                <Users size={18} />
                <span className="text-[10px] font-sans">Community</span>
              </button>

              <button
                onClick={() => setActiveTab('profile')}
                className={`flex flex-col items-center gap-0.5 transition-all cursor-pointer ${
                  activeTab === 'profile' ? 'text-indigo-600 font-semibold' : 'text-slate-400 hover:text-slate-600'
                }`}
              >
                <User size={18} />
                <span className="text-[10px] font-sans">Profile</span>
              </button>
            </nav>
          </div>

          {/* SIDEBAR DRAWER PANEL OVERLAY */}
          {isSidebarOpen && (
            <>
              {/* Sidebar Backdrop Overlay */}
              <div 
                className="absolute inset-0 bg-slate-950/60 backdrop-blur-xs z-40 transition-opacity"
                onClick={() => setIsSidebarOpen(false)}
              />
              
              {/* Slide-out Sidebar Drawer Content */}
              <div className="absolute inset-y-0 left-0 w-72 xs:w-80 bg-white shadow-2xl z-50 flex flex-col border-r border-slate-100 transform transition-transform duration-300">
                {/* Drawer Header Row */}
                <div className="bg-slate-900 text-white px-5 py-6 flex items-center justify-between shrink-0">
                  <div className="flex items-center gap-2.5">
                    <TiklingMascot size="sm" animated={false} />
                    <div className="text-left">
                      <h3 className="font-sans font-bold text-sm tracking-tight leading-none text-white">Tiki Transit Desk</h3>
                      <p className="text-[9px] text-indigo-300 font-mono tracking-wider mt-1">MOBILE CORRIDOR SERVICE</p>
                    </div>
                  </div>
                  <button 
                    onClick={() => setIsSidebarOpen(false)}
                    className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-750 text-slate-300 hover:text-white transition-colors cursor-pointer border-0"
                  >
                    <X size={15} />
                  </button>
                </div>

                {/* Drawer Main Settings Navigation Scroll */}
                <div className="flex-grow overflow-y-auto p-4 flex flex-col gap-4 text-left">
                  {/* Section: Carbon Savings Trophy */}
                  <div className="bg-indigo-50/70 border border-indigo-100/50 p-4 rounded-2xl shrink-0">
                    <div className="flex items-center gap-2 text-indigo-800">
                      <Sparkles size={16} className="text-indigo-600 animate-spin duration-[6000ms]" />
                      <span className="text-xs font-sans font-bold">Tiki Eco-Savings Badge</span>
                    </div>
                    <p className="text-slate-500 font-sans text-xs mt-1">
                      Thanks for mapping and using emission-smart corridors.
                    </p>
                    <div className="flex gap-2.5 mt-3">
                      <div className="flex-1 bg-white border border-slate-100 p-2 rounded-xl text-center">
                        <span className="text-[9px] text-slate-400 font-sans block">Carbon Saved</span>
                        <span className="text-xs font-sans font-bold text-slate-800">12.4 Kg</span>
                      </div>
                      <div className="flex-1 bg-white border border-slate-100 p-2 rounded-xl text-center">
                        <span className="text-[9px] text-slate-400 font-sans block">Level Status</span>
                        <span className="text-xs font-sans font-bold text-indigo-605">Tier 3</span>
                      </div>
                    </div>
                  </div>

                  {/* Section: Support & Sponsorship shortcut in sidebar */}
                  <div className="bg-gradient-to-br from-[#46868e]/10 to-indigo-50 border border-indigo-100 p-4 rounded-2xl shrink-0">
                    <div className="flex items-center gap-2 text-indigo-900">
                      <Heart size={15} className="text-[#46868e]" />
                      <span className="text-xs font-sans font-bold">Rewards Pool Mobilization</span>
                    </div>
                    <p className="text-[#46868e] font-sans text-[11px] mt-1">
                      Support and reward top-tier low-carbon transit runners in our community.
                    </p>
                    <button
                      onClick={() => {
                        setActiveTab('donation');
                        setIsSidebarOpen(false);
                      }}
                      className="mt-3 w-full py-1.5 bg-gradient-to-r from-[#46868e] to-indigo-600 hover:from-[#3a6f76] hover:to-indigo-700 text-white font-sans font-bold rounded-xl text-[10px] shadow-xs cursor-pointer text-center border-0"
                    >
                      Fund Rewards Pool (₱{donationPoolCurrent.toLocaleString()})
                    </button>
                  </div>

                  {/* Section: Support Me by jaredsfdev */}
                  <div className="bg-amber-50/70 border border-amber-250 p-4 rounded-2xl shrink-0">
                    <div className="flex items-center gap-2 text-amber-900">
                      <Heart size={15} className="text-amber-600 fill-amber-500 animate-pulse" />
                      <span className="text-xs font-sans font-bold">Support Me</span>
                    </div>
                    <p className="text-slate-600 font-sans text-[11.5px] mt-1 leading-relaxed">
                      If Tikling Assistant has made your route planning easier, please consider supporting the ongoing development. Thank you!
                    </p>
                    <button
                      onClick={() => {
                        setIsSidebarOpen(false);
                        setTiklingAlert({
                          show: true,
                          title: 'Thank You for Supporting! 💖',
                          message: 'Your support is deeply appreciated! Connecting with jaredsfdev keeps the server running and updates rolling out.',
                          type: 'success'
                        });
                      }}
                      className="mt-3 w-full py-1.5 bg-amber-500 hover:bg-amber-600 text-white font-sans font-bold rounded-xl text-[10px] shadow-xs cursor-pointer text-center border-0 transition-colors"
                    >
                      Buy Me a Coffee ☕
                    </button>
                  </div>

                  {/* Section: Operational Simulator Controls */}
                  <div className="flex flex-col gap-2 shrink-0">
                    <span className="text-[9px] font-sans font-bold text-slate-400 uppercase tracking-wider pl-1">
                      Simulation Control panel
                    </span>

                    <div className="border border-slate-150 rounded-xl divide-y divide-slate-150 overflow-hidden bg-slate-50/50">
                      {/* Control: Low Data mode */}
                      <div className="p-3 flex items-center justify-between hover:bg-slate-50">
                        <div>
                          <span className="text-xs font-bold text-slate-700 block font-sans">Low Data Mode</span>
                          <span className="text-[9px] text-slate-400 block font-sans">Throttle tile downloads</span>
                        </div>
                        <button
                          role="switch"
                          aria-checked={isLowData}
                          aria-label="Toggle Low Data Mode Settings"
                          onClick={() => {
                            setIsLowData(!isLowData);
                            setTiklingAlert({
                              show: true,
                              title: 'Mode Switched',
                              message: `Low Data mode is now ${!isLowData ? 'ENABLED' : 'DISABLED'}. OpenStreetMap graphics will load with balanced visual weights.`,
                              type: 'info'
                            });
                          }}
                          className={`w-10 h-5 rounded-full flex items-center p-0.5 transition-colors cursor-pointer border-0 focus:outline-hidden focus:ring-2 focus:ring-indigo-600 ${isLowData ? 'bg-indigo-600 justify-end' : 'bg-slate-250 justify-start'}`}
                        >
                          <span className="w-4 h-4 bg-white rounded-full shadow-sm" />
                        </button>
                      </div>

                      {/* Control: Offline mode simulation */}
                      <div className="p-3 flex items-center justify-between hover:bg-slate-50">
                        <div>
                          <span className="text-xs font-bold text-slate-700 block font-sans">Offline Mode</span>
                          <span className="text-[9px] text-slate-400 block font-sans">Disconnect map APIs</span>
                        </div>
                        <button
                          role="switch"
                          aria-checked={isOffline}
                          aria-label="Toggle Offline Mode Settings"
                          onClick={() => {
                            setIsOffline(!isOffline);
                            setTiklingAlert({
                              show: true,
                              title: 'Network State Shifted!',
                              message: `Your simulator is now running ${!isOffline ? 'OFFLINE' : 'ONLINE'}. Tiki has loaded offline map vectors to secure uninterrupted navigation cache!`,
                              type: 'warning'
                            });
                          }}
                          className={`w-10 h-5 rounded-full flex items-center p-0.5 transition-colors cursor-pointer border-0 focus:outline-hidden focus:ring-2 focus:ring-indigo-600 ${isOffline ? 'bg-indigo-600 justify-end' : 'bg-slate-250 justify-start'}`}
                        >
                          <span className="w-4 h-4 bg-white rounded-full shadow-sm" />
                        </button>
                      </div>

                      {/* Control: Tiki Night Mode theme toggle */}
                      <div className="p-3 flex items-center justify-between hover:bg-slate-50">
                        <div>
                          <span className="text-xs font-bold text-slate-700 block font-sans">Tiki Night Mode</span>
                          <span className="text-[9px] text-slate-400 block font-sans">Deep indigos & dark slates</span>
                        </div>
                        <button
                          role="switch"
                          aria-checked={isTikiNightMode}
                          aria-label="Toggle Tiki Night Mode Theme"
                          onClick={() => {
                            const nextMode = !isTikiNightMode;
                            setIsTikiNightMode(nextMode);
                            localStorage.setItem('tikling_night_mode', nextMode ? 'true' : 'false');
                            
                            // Trigger a responsive, fun alert from Tikling mascot!
                            setTiklingAlert({
                              show: true,
                              title: nextMode ? 'Under the Stars! ✨' : 'Good Morning! ☀️',
                              message: nextMode 
                                ? 'Cozy, low-light navigation active. Switched UI colors to deep midnight indigos and comfortable dark slates.' 
                                : 'Switched back to warm daylight papers. Pleasant safe transits ahead!',
                              type: 'success'
                            });
                          }}
                          className={`w-10 h-5 rounded-full flex items-center p-0.5 transition-colors cursor-pointer border-0 focus:outline-hidden focus:ring-2 focus:ring-[#46868e] ${isTikiNightMode ? 'bg-[#46868e] justify-end' : 'bg-slate-250 justify-start'}`}
                        >
                          <span className="w-4 h-4 bg-white rounded-full shadow-sm" />
                        </button>
                      </div>

                      {/* Control: Set appState loading/empty/error */}
                      <div className="p-3 flex flex-col gap-1.5 hover:bg-slate-50">
                        <div>
                          <span className="text-xs font-bold text-slate-700 block font-sans">Workspace State</span>
                          <span className="text-[9px] text-slate-400 block font-sans">Test dynamic view rendering</span>
                        </div>
                        <div className="grid grid-cols-4 gap-1 mt-1 bg-white p-0.5 border border-slate-150 rounded-lg">
                          {(['hasData', 'loading', 'empty', 'error'] as AppStateMode[]).map((state) => (
                            <button
                              key={state}
                              onClick={() => {
                                setAppState(state);
                                if (state !== 'hasData') {
                                  setIsSidebarOpen(false);
                                }
                              }}
                              className={`py-1 rounded text-[8px] font-bold font-sans transition-all border-0 cursor-pointer ${appState === state ? 'bg-indigo-600 text-white' : 'text-slate-600 hover:bg-slate-100 bg-transparent'}`}
                            >
                              {state === 'hasData' ? 'Live' : state}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Section: Travel Prefs */}
                  <div className="flex flex-col gap-2 shrink-0 pb-4">
                    <span className="text-[9px] font-sans font-bold text-slate-400 uppercase tracking-wider pl-1">
                      Travel Preferences
                    </span>
                    <div className="flex flex-col gap-1.5">
                      <button 
                        onClick={() => {
                          setTransitMode('walk');
                          setTiklingAlert({ show: true, title: 'Walk Priority', message: 'Tiki Mascot prioritized peaceful sidewalk lanes and walking trails for clean scenic hikes.', type: 'info' });
                          setIsSidebarOpen(false);
                        }}
                        className="flex items-center gap-3 w-full p-2.5 rounded-xl border border-slate-100 bg-white hover:bg-slate-50 transition-colors text-left cursor-pointer"
                      >
                        <Footprints size={18} className="text-slate-500" />
                        <div>
                          <span className="text-xs font-semibold text-slate-800 block">Eco Pedestrian</span>
                          <span className="text-[9px] text-slate-450 block">Zero-carbon walkway selection</span>
                        </div>
                      </button>

                      <button 
                        onClick={() => {
                          setTransitMode('cycle');
                          setTiklingAlert({ show: true, title: 'Biking Priority', message: 'Tiki Mascot prioritized safety lanes, buffered cycle streets, and bicycle parking bays.', type: 'info' });
                          setIsSidebarOpen(false);
                        }}
                        className="flex items-center gap-3 w-full p-2.5 rounded-xl border border-slate-100 bg-white hover:bg-slate-50 transition-colors text-left cursor-pointer"
                      >
                        <Bike size={18} className="text-slate-500" />
                        <div>
                          <span className="text-xs font-semibold text-slate-800 block">Two-Wheeled Speed</span>
                          <span className="text-[9px] text-slate-450 block">Optimized cycle paths</span>
                        </div>
                      </button>

                      <button 
                        onClick={() => {
                          setWaypoints([]);
                          setTiklingAlert({ show: true, title: 'Map Workspace Flushed!', message: 'Tiki successfully reset all route segments back to ground zero. Go ahead and sketch fresh nodes on the map!', type: 'success' });
                          setIsSidebarOpen(false);
                        }}
                        className="flex items-center gap-3 w-full p-2.5 rounded-xl border border-red-100 bg-red-50/30 hover:bg-red-50 transition-colors text-left text-red-700 cursor-pointer"
                      >
                        <Trash2 size={14} className="text-red-500" />
                        <div>
                          <span className="text-xs font-semibold block">Wipe Active Stops</span>
                          <span className="text-[9px] text-red-400 block">Reset routing waypoints list</span>
                        </div>
                      </button>
                    </div>
                  </div>
                </div>

                {/* Sidebar Footer credit line */}
                <div className="p-4 border-t border-slate-100 bg-slate-50 text-[10px] text-slate-400 font-sans flex flex-col gap-1.5 shrink-0 text-left">
                  <div className="flex items-center justify-between font-mono text-[9px]">
                    <span>Tiki Version 2.8</span>
                    <span className="text-indigo-600 font-bold">Mascot Protected</span>
                  </div>
                  <div className="border-t border-slate-200/60 pt-2 flex items-center justify-between text-[10px]">
                    <span className="text-slate-500 font-medium">Developed by</span>
                    <span className="text-indigo-600 font-extrabold hover:underline select-none">jaredsfdev</span>
                  </div>
                </div>
              </div>
            </>
          )}

          {/* NOTIFICATION DROP-DOWN PANEL OVERLAY */}
          {isNotificationOpen && (
            <>
              {/* Notification Overlay Backdrop */}
              <div 
                className="absolute inset-0 bg-transparent z-35"
                onClick={() => setIsNotificationOpen(false)}
              />
              
              {/* Popover Card */}
              <div className="absolute top-[68px] right-4 left-4 md:left-auto md:w-80 bg-white/95 backdrop-blur-md rounded-3xl border border-indigo-100/85 shadow-2xl z-40 flex flex-col max-h-[380px] overflow-hidden antialiased">
                {/* Popover Header */}
                <div className="bg-indigo-55/40 border-b border-indigo-100 p-3 flex items-center justify-between shrink-0">
                  <div className="flex items-center gap-1.5 text-left">
                    <Bell size={13} className="text-indigo-600 animate-bounce" />
                    <span className="text-xs font-sans font-bold text-indigo-900">Tiki Active Bulletins</span>
                  </div>
                  
                  {notifications.some(n => !n.read) && (
                    <button
                      onClick={() => {
                        setNotifications(notifications.map(n => ({ ...n, read: true })));
                        setTiklingAlert({ show: true, title: 'Read All Bulletins', message: 'Tiki Mascot has marked all current bulletins as read. Safe looping!', type: 'success' });
                      }}
                      className="text-[10px] text-indigo-700 hover:underline font-bold bg-transparent border-0 cursor-pointer"
                    >
                      Mark all read
                    </button>
                  )}
                </div>

                {/* Bulletin scrolling container */}
                <div className="flex-grow overflow-y-auto divide-y divide-slate-50">
                  {notifications.length === 0 ? (
                    <div className="p-8 text-center text-slate-400 flex flex-col items-center gap-2">
                      <Inbox className="w-8 h-8 text-slate-350 stroke-[1.5]" />
                      <p className="text-xs font-sans">All bulletins cleared! Outstanding job!</p>
                    </div>
                  ) : (
                    notifications.map((notif) => (
                      <div 
                        key={notif.id}
                        onClick={() => {
                          // Open full mascot modal detail for this notification
                          setTiklingAlert({
                            show: true,
                            title: notif.title,
                            message: notif.message,
                            type: notif.type as any || 'info'
                          });
                          // Mark read
                          setNotifications(notifications.map(n => n.id === notif.id ? { ...n, read: true } : n));
                          setIsNotificationOpen(false);
                        }}
                        className={`p-3 text-left transition-colors cursor-pointer flex gap-3 text-xs ${notif.read ? 'bg-white hover:bg-sky-50/20' : 'bg-indigo-50/25 hover:bg-indigo-50/40'}`}
                      >
                        {/* Bullet badge indicator */}
                        <div className="w-1.5 h-1.5 rounded-full bg-indigo-500 mt-1.5 shrink-0 select-none opacity-90" style={{ visibility: notif.read ? 'hidden' : 'visible' }} />
                        
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <span className="font-bold text-slate-800 truncate font-sans block">{notif.title}</span>
                            <span className="text-[8px] text-slate-400 font-mono shrink-0">{notif.time}</span>
                          </div>
                          <p className="text-slate-500 font-sans mt-0.5 line-clamp-2 text-[11px] leading-relaxed">
                            {notif.message}
                          </p>
                        </div>
                      </div>
                    ))
                  )}
                </div>

                {/* Popover Actions block */}
                <div className="bg-slate-50 p-2 flex items-center justify-between border-t border-slate-100 flex-wrap gap-1 shrink-0">
                  <button 
                    onClick={() => {
                      // Seed a new randomly preloaded advice notification! This is incredibly interactive and fun!
                      const randomBaselines = [
                        { title: 'Tiki Secret Route', message: 'The walk path features a hidden shoreline bypass that cuts carbon emissions and offers scenic lookouts!', type: 'success' },
                        { title: 'Metro Transit Slowdown', message: 'Tiki spotted commuter reports indicating elevator servicing has concluded at Waterfront platform.', type: 'warning' },
                        { title: 'Tiki Hydration Memo', message: 'Mascot alerts you that high sun levels are forecasted. Pack extra water in your bike backpack!', type: 'info' }
                      ];
                      const rand = randomBaselines[Math.floor(Math.random() * randomBaselines.length)];
                      const newNotif = {
                        id: `n-${Date.now()}`,
                        title: rand.title,
                        message: rand.message,
                        read: false,
                        time: 'Just now',
                        type: rand.type
                      };
                      setNotifications([newNotif, ...notifications]);
                      setBellCount(prev => prev + 1);
                    }}
                    className="text-[10px] text-indigo-605 hover:text-indigo-700 font-semibold bg-white border border-slate-200 px-2 py-1 rounded-lg flex items-center gap-1 shadow-2xs hover:shadow-xs transition-all cursor-pointer"
                  >
                    <Plus size={10} className="text-indigo-600" /> Simulate Bulletin
                  </button>
                  
                  <button
                    onClick={() => {
                      setNotifications([]);
                      setBellCount(0);
                    }}
                    className="text-[9px] text-slate-500 hover:text-red-655 bg-transparent border-0 cursor-pointer"
                  >
                    Clear index
                  </button>
                </div>
              </div>
            </>
          )}

          {/* CUSTOM TIKLING ALERTS DIALOG SCREEN */}
          {tiklingAlert && tiklingAlert.show && (
            <>
              {/* Alert backdrop overlay - high z-index to overlay EVERYTHING globally on the current scroll layout */}
              <div className="fixed inset-0 bg-slate-950/75 backdrop-blur-xs z-[100] flex items-center justify-center p-4">
                {/* Alert Card Box */}
                <div className="bg-white rounded-3xl p-6 max-w-sm w-full shadow-2xl border border-indigo-150 flex flex-col items-center justify-center text-center gap-4 animate-in zoom-in-95 duration-150 relative">
                  {/* Glowing Tiki the Tikling mascot inside the dialog */}
                  <TiklingMascot size="lg" animated={true} />
                  
                  {/* Alert Header Texts */}
                  <div className="text-center">
                    <h3 className="font-sans font-bold text-slate-900 text-base leading-snug">
                      {tiklingAlert.title}
                    </h3>
                    <div className="h-1 w-10 bg-indigo-500 rounded-full mx-auto mt-2" />
                  </div>

                  {/* Message body */}
                  <div className="text-xs text-slate-600 font-sans leading-relaxed px-1 text-center">
                    {tiklingAlert.message}
                  </div>

                  {/* Action triggers */}
                  <button
                    onClick={() => setTiklingAlert(null)}
                    className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-sans text-xs font-bold py-3 px-4 rounded-xl shadow-md transition-all border-0 cursor-pointer"
                  >
                    Got it, Tiki!
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
