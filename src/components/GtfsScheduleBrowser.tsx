import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Search,
  Calendar,
  Clock,
  ArrowRight,
  MapPin,
  Info,
  ExternalLink,
  Database,
  Sparkles,
  Plus,
  Compass,
  ArrowDown,
  RefreshCw,
  Award
} from 'lucide-react';
import { Waypoint, TransitMode } from '../types';

export interface GtfsRoute {
  id: string;
  agencyId: string;
  agencyName: string;
  shortName: string;
  longName: string;
  color: string;
  bgColor: string;
  transitMode: TransitMode;
  feedUrl: string;
  feedId: string;
  openMobilityId: string;
  operatingHours: string;
  frequencyMinutes: number;
  fareStart: number;
  farePerKm: number;
  stops: {
    id: string;
    sequence: number;
    name: string;
    lat: number;
    lng: number;
    distancePrevKm: number;
  }[];
}

const GTFS_MANILA_RECORDS: GtfsRoute[] = [
  {
    id: 'r-lrt2',
    agencyId: 'a-lrta',
    agencyName: 'Light Rail Transit Authority (LRTA)',
    shortName: 'LRT-2',
    longName: 'Line 2 Metro Corridor (Antipolo ⇆ Recto)',
    color: '#06b6d4',
    bgColor: 'bg-cyan-50 text-cyan-700 border-cyan-200',
    transitMode: 'metro',
    feedId: 'f-lrta-lrt2-omd',
    openMobilityId: 'feed-ph-lrt2-gtfs-3',
    feedUrl: 'https://transit.land/feeds/f-wt9d-lrt2',
    operatingHours: '05:00 AM - 09:30 PM Daily',
    frequencyMinutes: 7,
    fareStart: 15,
    farePerKm: 1.5,
    stops: [
      { id: 'l2-recto', sequence: 1, name: 'Recto Station Interchange', lat: 14.6033, lng: 120.9831, distancePrevKm: 0 },
      { id: 'l2-legarda', sequence: 2, name: 'Legarda (San Miguel)', lat: 14.6009, lng: 120.9922, distancePrevKm: 1.1 },
      { id: 'l2-pureza', sequence: 3, name: 'Pureza (Santa Mesa)', lat: 14.6015, lng: 121.0051, distancePrevKm: 1.4 },
      { id: 'l2-vmapa', sequence: 4, name: 'V. Mapa Station', lat: 14.6026, lng: 121.0184, distancePrevKm: 1.5 },
      { id: 'l2-jruiz', sequence: 5, name: 'J. Ruiz (San Juan)', lat: 14.6104, lng: 121.0264, distancePrevKm: 1.2 },
      { id: 'l2-gilmore', sequence: 6, name: 'Gilmore (New Manila)', lat: 14.6136, lng: 121.0344, distancePrevKm: 1.0 },
      { id: 'l2-betty', sequence: 7, name: 'Betty Go-Belmonte', lat: 14.6186, lng: 121.0414, distancePrevKm: 0.9 },
      { id: 'l2-cubao', sequence: 8, name: 'Araneta Center-Cubao Link', lat: 14.6221, lng: 121.0524, distancePrevKm: 1.2 },
      { id: 'l2-anonas', sequence: 9, name: 'Anonas Station', lat: 14.6280, lng: 121.0660, distancePrevKm: 1.5 },
      { id: 'l2-katipunan', sequence: 10, name: 'Katipunan LRT Station', lat: 14.6309, lng: 121.0726, distancePrevKm: 0.9 },
      { id: 'l2-santolan', sequence: 11, name: 'Santolan Passenger Hub', lat: 14.6234, lng: 121.0854, distancePrevKm: 1.6 },
      { id: 'l2-marikina', sequence: 12, name: 'Marikina-Pasig Station', lat: 14.6198, lng: 121.1017, distancePrevKm: 1.8 },
      { id: 'l2-antipolo', sequence: 13, name: 'Antipolo Terminal', lat: 14.6174, lng: 121.1213, distancePrevKm: 2.2 }
    ]
  },
  {
    id: 'r-lrt1',
    agencyId: 'a-lrtmc',
    agencyName: 'Light Rail Manila Corporation (LRMC)',
    shortName: 'LRT-1',
    longName: 'Line 1 North-South Rail (Baclaran ⇆ FPJ Roosevelt)',
    color: '#10b981',
    bgColor: 'bg-emerald-50 text-emerald-750 border-emerald-200',
    transitMode: 'metro',
    feedId: 'f-lrtmc-lrt1-omd',
    openMobilityId: 'feed-ph-lrt1-gtfs-1',
    feedUrl: 'https://transit.land/feeds/f-wt9d-lrt1',
    operatingHours: '04:30 AM - 10:00 PM Daily',
    frequencyMinutes: 4,
    fareStart: 15,
    farePerKm: 1.2,
    stops: [
      { id: 'l1-baclaran', sequence: 1, name: 'Baclaran South Terminal', lat: 14.5283, lng: 121.0022, distancePrevKm: 0 },
      { id: 'l1-edsa', sequence: 2, name: 'EDSA-Taft Interchange', lat: 14.5375, lng: 121.0012, distancePrevKm: 1.0 },
      { id: 'l1-libertad', sequence: 3, name: 'Libertad Station', lat: 14.5476, lng: 120.9985, distancePrevKm: 1.1 },
      { id: 'l1-gilpuyat', sequence: 4, name: 'Gil Puyat (Buendia LRT)', lat: 14.5543, lng: 120.9972, distancePrevKm: 0.8 },
      { id: 'l1-vitocruz', sequence: 5, name: 'Vito Cruz DLSU Campus', lat: 14.5633, lng: 120.9948, distancePrevKm: 1.0 },
      { id: 'l1-quirino', sequence: 6, name: 'Quirino Station', lat: 14.5702, lng: 120.9912, distancePrevKm: 0.8 },
      { id: 'l1-pedrogil', sequence: 7, name: 'Pedro Gil (Padre Faura)', lat: 14.5768, lng: 120.9850, distancePrevKm: 1.0 },
      { id: 'l1-unaction', sequence: 8, name: 'United Nations Avenue', lat: 14.5824, lng: 120.9842, distancePrevKm: 0.7 },
      { id: 'l1-central', sequence: 9, name: 'Central Terminal Manila', lat: 14.5926, lng: 120.9816, distancePrevKm: 1.2 },
      { id: 'l1-carriedo', sequence: 10, name: 'Carriedo Station', lat: 14.5997, lng: 120.9817, distancePrevKm: 0.8 },
      { id: 'l1-blumentritt', sequence: 11, name: 'Blumentritt Interchange', lat: 14.6225, lng: 120.9829, distancePrevKm: 2.5 },
      { id: 'l1-tayuman', sequence: 12, name: 'Tayuman Station', lat: 14.6167, lng: 120.9831, distancePrevKm: 0.6 },
      { id: 'l1-monumento', sequence: 13, name: 'Monumento (Caloocan Hub)', lat: 14.6576, lng: 120.9841, distancePrevKm: 4.5 },
      { id: 'l1-balintawak', sequence: 14, name: 'Balintawak Sky-Gate', lat: 14.6504, lng: 121.0011, distancePrevKm: 2.1 },
      { id: 'l1-roosevelt', sequence: 15, name: 'Fernando Poe Jr. (Roosevelt)', lat: 14.6575, lng: 121.0211, distancePrevKm: 2.3 }
    ]
  },
  {
    id: 'r-mrt3',
    agencyId: 'a-dotr',
    agencyName: 'Department of Transportation (DOTr)',
    shortName: 'MRT-3',
    longName: 'EDSA Metro Rail Line 3 (Taft Ave ⇆ North Ave)',
    color: '#6366f1',
    bgColor: 'bg-indigo-50 text-indigo-750 border-indigo-200',
    transitMode: 'metro',
    feedId: 'f-dotr-mrt3-omd',
    openMobilityId: 'feed-ph-mrt3-gtfs-10',
    feedUrl: 'https://transit.land/feeds/f-wt9d-mrt3',
    operatingHours: '04:45 AM - 10:30 PM Daily',
    frequencyMinutes: 5,
    fareStart: 13,
    farePerKm: 1.0,
    stops: [
      { id: 'm3-taft', sequence: 1, name: 'Taft Avenue MRT Station', lat: 14.5376, lng: 121.0018, distancePrevKm: 0 },
      { id: 'm3-magallanes', sequence: 2, name: 'Magallanes South Gate', lat: 14.5422, lng: 121.0195, distancePrevKm: 1.9 },
      { id: 'm3-ayala', sequence: 3, name: 'Ayala Central Hub (Makati)', lat: 14.5490, lng: 121.0280, distancePrevKm: 1.4 },
      { id: 'm3-buendia', sequence: 4, name: 'Buendia Ave Tunnel Stop', lat: 14.5541, lng: 121.0335, distancePrevKm: 1.0 },
      { id: 'm3-guadalupe', sequence: 5, name: 'Guadalupe Ferry Access stop', lat: 14.5670, lng: 121.0450, distancePrevKm: 1.8 },
      { id: 'm3-boni', sequence: 6, name: 'Boni-Pioneer Station', lat: 14.5741, lng: 121.0483, distancePrevKm: 0.9 },
      { id: 'm3-shaw', sequence: 7, name: 'Shaw Boulevard Transit Mall', lat: 14.5813, lng: 121.0535, distancePrevKm: 1.0 },
      { id: 'm3-ortigas', sequence: 8, name: 'Ortigas Crossing Terminal', lat: 14.5880, lng: 121.0583, distancePrevKm: 0.9 },
      { id: 'm3-santolan', sequence: 9, name: 'Santolan-Annapolis Camp', lat: 14.6078, lng: 121.0564, distancePrevKm: 2.1 },
      { id: 'm3-cubao', sequence: 10, name: 'Cubao Line 3 Link', lat: 14.6225, lng: 121.0520, distancePrevKm: 1.6 },
      { id: 'm3-kamuning', sequence: 11, name: 'Kamuning Station (GMA)', lat: 14.6294, lng: 121.0432, distancePrevKm: 1.3 },
      { id: 'm3-quezon', sequence: 12, name: 'Quezon Avenue Centris', lat: 14.6425, lng: 121.0384, distancePrevKm: 1.6 },
      { id: 'm3-north', sequence: 13, name: 'North Avenue Yard', lat: 14.6533, lng: 121.0315, distancePrevKm: 1.4 }
    ]
  },
  {
    id: 'r-carrousel',
    agencyId: 'a-ltfrb',
    agencyName: 'Land Transportation Franchising Board',
    shortName: 'Carrousel',
    longName: 'EDSA Premium Dedicated Busway (PITX ⇆ Monumento)',
    color: '#eab308',
    bgColor: 'bg-yellow-50 text-yellow-800 border-yellow-200',
    transitMode: 'bus',
    feedId: 'f-ltfrb-edsabus-gtfs',
    openMobilityId: 'feed-ph-carrousel-busway',
    feedUrl: 'https://transit.land/feeds/f-wt9d-edsabus',
    operatingHours: '24 Hours / 7 Days Operative',
    frequencyMinutes: 3,
    fareStart: 15,
    farePerKm: 1.8,
    stops: [
      { id: 'c-pitx', sequence: 1, name: 'PITX Central Bus Terminal', lat: 14.5090, lng: 120.9918, distancePrevKm: 0 },
      { id: 'c-tramo', sequence: 2, name: 'Tramo Avenue Stop', lat: 14.5365, lng: 121.0008, distancePrevKm: 3.1 },
      { id: 'c-taft', sequence: 3, name: 'Taft Bus Interchange Stop', lat: 14.5376, lng: 121.0018, distancePrevKm: 0.1 },
      { id: 'c-ayala', sequence: 4, name: 'Ayala Ave Interchange Stop', lat: 14.5492, lng: 121.0278, distancePrevKm: 2.1 },
      { id: 'c-guadalupe', sequence: 5, name: 'Guadalupe Bridge Gates', lat: 14.5673, lng: 121.0448, distancePrevKm: 2.4 },
      { id: 'c-santolan', sequence: 6, name: 'Santolan-Annapolis Bypass', lat: 14.6075, lng: 121.0560, distancePrevKm: 4.4 },
      { id: 'c-ortigas', sequence: 7, name: 'Ortigas Flyover Platform', lat: 14.5880, lng: 121.0580, distancePrevKm: 0.3 },
      { id: 'c-north', sequence: 8, name: 'MRT-3 North Ave Stop', lat: 14.6530, lng: 121.0310, distancePrevKm: 6.9 },
      { id: 'c-quezon', sequence: 9, name: 'Quezon Ave Interchange Stop', lat: 14.6420, lng: 121.0380, distancePrevKm: 1.3 },
      { id: 'c-bagongbarrio', sequence: 10, name: 'Bagong Barrio Bus Stop', lat: 14.6521, lng: 120.9973, distancePrevKm: 4.3 },
      { id: 'c-monumento', sequence: 11, name: 'Monumento Bus Platform', lat: 14.6576, lng: 120.9841, distancePrevKm: 1.5 }
    ]
  },
  {
    id: 'r-jeepup',
    agencyId: 'a-updiliman',
    agencyName: 'UP Diliman Transport Alliance',
    shortName: 'UP-Katipunan',
    longName: 'UP Katipunan Jeepney Corridor (Katipunan LRT ⇆ UP Diliman Campus)',
    color: '#cd5f39',
    bgColor: 'bg-amber-50 text-amber-900 border-amber-200',
    transitMode: 'bus',
    feedId: 'f-updiliman-jeep-gtfs-1',
    openMobilityId: 'feed-ph-kathub-jeep',
    feedUrl: 'https://transit.land/feeds/f-wt9d-jeepup',
    operatingHours: '06:00 AM - 09:00 PM Active',
    frequencyMinutes: 10,
    fareStart: 13,
    farePerKm: 1.0,
    stops: [
      { id: 'j-katip', sequence: 1, name: 'Katipunan LRT Overpass Stop', lat: 14.6309, lng: 121.0726, distancePrevKm: 0 },
      { id: 'j-flyover', sequence: 2, name: 'Katipunan Flyover Jeep Stop', lat: 14.6345, lng: 121.0733, distancePrevKm: 0.5 },
      { id: 'j-ateneog3', sequence: 3, name: 'Ateneo de Manila Gate 3', lat: 14.6375, lng: 121.0760, distancePrevKm: 0.4 },
      { id: 'j-ateneog2', sequence: 4, name: 'Ateneo de Manila Gate 2', lat: 14.6398, lng: 121.0772, distancePrevKm: 0.3 },
      { id: 'j-miriam', sequence: 5, name: 'Miriam College Lower Stop', lat: 14.6432, lng: 121.0775, distancePrevKm: 0.4 },
      { id: 'j-upgate', sequence: 6, name: 'UP Diliman Gate GT Toyota', lat: 14.6475, lng: 121.0745, distancePrevKm: 0.6 },
      { id: 'j-upquezon', sequence: 7, name: 'UP Diliman Quezon Hall', lat: 14.6548, lng: 121.0682, distancePrevKm: 1.1 },
      { id: 'j-upshop', sequence: 8, name: 'UP Diliman Shopping Center', lat: 14.6582, lng: 121.0675, distancePrevKm: 0.4 },
      { id: 'j-upoval', sequence: 9, name: 'UP Academic Oval East Side', lat: 14.6585, lng: 121.0720, distancePrevKm: 0.5 }
    ]
  }
];

interface GtfsScheduleBrowserProps {
  onImportWaypoints: (waypoints: Waypoint[], mode: TransitMode) => void;
  onPinWaypoint: (waypoint: Waypoint) => void;
  currentWaypoints: Waypoint[];
  onAddLogMessage: (title: string, message: string, type: 'success' | 'info' | 'warning') => void;
}

export const GtfsScheduleBrowser: React.FC<GtfsScheduleBrowserProps> = ({
  onImportWaypoints,
  onPinWaypoint,
  currentWaypoints,
  onAddLogMessage
}) => {
  const [selectedRouteId, setSelectedRouteId] = useState<string>('r-lrt2');
  const [searchStopQuery, setSearchStopQuery] = useState<string>('');
  const [activeTabSub, setActiveTabSub] = useState<'stops' | 'timetable' | 'intelligence'>('stops');
  const [localTimeString, setLocalTimeString] = useState<string>('18:48 PM');
  const [simulatedMinutesOffset, setSimulatedMinutesOffset] = useState<number>(0);

  // Keep track of clock simulation
  useEffect(() => {
    const updateSimulatedClock = () => {
      const now = new Date();
      // Apply offset if any
      if (simulatedMinutesOffset !== 0) {
        now.setMinutes(now.getMinutes() + simulatedMinutesOffset);
      }
      let hours = now.getHours();
      const mins = now.getMinutes().toString().padStart(2, '0');
      const suffix = hours >= 12 ? 'PM' : 'AM';
      hours = hours % 12;
      hours = hours ? hours : 12; // 12 instead of 0
      setLocalTimeString(`${hours.toString().padStart(2, '0')}:${mins} ${suffix}`);
    };

    updateSimulatedClock();
    const interval = setInterval(updateSimulatedClock, 10000); // update every 10s
    return () => clearInterval(interval);
  }, [simulatedMinutesOffset]);

  const activeRoute = GTFS_MANILA_RECORDS.find(r => r.id === selectedRouteId) || GTFS_MANILA_RECORDS[0];

  // Calculate upcoming departures for a given stop based on frequency
  const calculateDeparturesForStop = (stopSeq: number, frequencyMins: number) => {
    const departures: string[] = [];
    const now = new Date();
    if (simulatedMinutesOffset !== 0) {
      now.setMinutes(now.getMinutes() + simulatedMinutesOffset);
    }

    const currentMinutesCombined = now.getHours() * 60 + now.getMinutes();
    
    // Each stop has a sequenced offset delay (e.g. 2 minutes per stop)
    const travelDelayFromStart = (stopSeq - 1) * 2.5;

    // Generate departures starting from the closest past train
    // aligned to frequency blocks
    let baseTimeMinutes = Math.floor(currentMinutesCombined / frequencyMins) * frequencyMins;
    baseTimeMinutes += travelDelayFromStart;

    // Render 4 upcoming runs
    for (let i = 0; i < 4; i++) {
      let departureMinutesVal = baseTimeMinutes + (i * frequencyMins);
      if (departureMinutesVal < currentMinutesCombined) {
        departureMinutesVal += frequencyMins; // push forward if it fell in the past relative to current minutes
      }

      const depHours = Math.floor(departureMinutesVal / 60) % 24;
      const depMins = Math.floor(departureMinutesVal % 60);
      const displayMins = depMins.toString().padStart(2, '0');
      const displaySuffix = depHours >= 12 ? 'PM' : 'AM';
      const displayHours = depHours % 12 === 0 ? 12 : depHours % 12;
      
      const relativeMinutesDiff = Math.ceil(departureMinutesVal - currentMinutesCombined);
      const relativeText = relativeMinutesDiff === 0 
        ? 'boarding now' 
        : relativeMinutesDiff === 1 
        ? '1 min' 
        : `${relativeMinutesDiff} mins`;

      departures.push(`${displayHours}:${displayMins} ${displaySuffix} (${relativeText})`);
    }

    return departures;
  };

  // Safe checks if a specific waypoint is already pinned
  const isSearchStopPinned = (lat: number, lng: number) => {
    return currentWaypoints.some(
      wp => Math.abs(wp.lat - lat) < 0.0001 && Math.abs(wp.lng - lng) < 0.0001
    );
  };

  const handlePinStop = (stop: { name: string; lat: number; lng: number }) => {
    const wp: Waypoint = {
      id: `gtfs-wp-${Math.random()}`,
      name: stop.name,
      lat: stop.lat,
      lng: stop.lng,
      transitMode: activeRoute.transitMode,
      fare: activeRoute.fareStart // Use base starting fare
    };
    onPinWaypoint(wp);
    onAddLogMessage(
      'GTFS Stop Pinned',
      `Coordinating and mapping ${stop.name} [Transitland Feed: ${activeRoute.feedId}] dynamically.`,
      'success'
    );
  };

  const handleImportEntireLine = () => {
    const importedWaypoints = activeRoute.stops.map((stop, index) => {
      // Linear fare calculation simulation
      const relativeDistanceKm = activeRoute.stops
        .slice(0, index + 1)
        .reduce((sum, s) => sum + s.distancePrevKm, 0);
      const computedFare = Math.round(activeRoute.fareStart + (relativeDistanceKm * activeRoute.farePerKm));

      return {
        id: `gtfs-wp-${stop.id}-${Math.random()}`,
        name: stop.name,
        lat: stop.lat,
        lng: stop.lng,
        transitMode: activeRoute.transitMode,
        fare: computedFare
      } as Waypoint;
    });

    onImportWaypoints(importedWaypoints, activeRoute.transitMode);
    onAddLogMessage(
      'Corridor Overwritten!',
      `Imported all ${activeRoute.stops.length} stations of ${activeRoute.shortName} as your workspace roadmap corridor!`,
      'success'
    );
  };

  const filteredStops = activeRoute.stops.filter((stop) =>
    stop.name.toLowerCase().includes(searchStopQuery.toLowerCase())
  );

  return (
    <div className="bg-white border border-slate-150 rounded-3xl p-5 shadow-xs flex flex-col gap-4 text-left">
      
      {/* SECTION HEADER BLOCK */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1 rounded-lg bg-indigo-50 text-indigo-600 block shrink-0">
              <Database size={14} className="animate-pulse" />
            </span>
            <span className="text-[10px] uppercase font-mono tracking-wider font-bold text-slate-400">
              Central GTFS Schedule Directory
            </span>
          </div>
          <h3 className="font-sans font-bold text-slate-800 text-sm mt-1">
            Transitland & OpenMobilityData Feed Integration
          </h3>
        </div>

        {/* Live Simulated System Clock */}
        <div className="bg-slate-900 text-indigo-300 font-mono text-[10.5px] px-2.5 py-1.5 rounded-xl border border-slate-800 flex items-center gap-1.5 self-start sm:self-center">
          <Clock size={11} className="text-indigo-400 animate-spin" style={{ animationDuration: '6s' }} />
          <span>SIM CLOCK: <strong className="text-white font-bold">{localTimeString}</strong></span>
          <button
            type="button"
            id="increment-clock-btn"
            onClick={() => setSimulatedMinutesOffset(prev => prev + 5)}
            className="text-[9px] hover:text-white bg-slate-800 hover:bg-slate-700 font-sans border-0 font-semibold px-1 rounded-md cursor-pointer flex items-center justify-center gap-0.5"
            title="Fast forward simulated time 5 mins"
          >
            <RefreshCw size={8} /> +5m
          </button>
        </div>
      </div>

      {/* TRANSIT AGENCY SELECTOR ROW */}
      <div className="flex flex-col gap-2">
        <label htmlFor="gtfs-route-selector" className="text-[10.5px] font-sans font-bold uppercase tracking-wider text-slate-400">
          Select Manila Transit Route Feed:
        </label>
        <div className="relative">
          <select
            id="gtfs-route-selector"
            value={selectedRouteId}
            onChange={(e) => {
              setSelectedRouteId(e.target.value);
              setSearchStopQuery('');
            }}
            className="w-full bg-slate-50 border border-slate-200 hover:border-slate-300 rounded-2xl py-3 px-3.5 text-xs text-slate-800 font-sans font-semibold focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-indigo-500 transition-all cursor-pointer appearance-none"
          >
            {GTFS_MANILA_RECORDS.map(r => (
              <option key={r.id} value={r.id}>
                📍 [{r.shortName}] {r.longName}
              </option>
            ))}
          </select>
          <div className="absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
            <ArrowDown size={14} className="shrink-0" />
          </div>
        </div>
      </div>

      {/* METADATA CHIPS FOR ACTIVE AGENCY */}
      <div className="bg-slate-50 border border-slate-100 rounded-2xl p-4 flex flex-col gap-2.5">
        <div className="flex flex-wrap items-center justify-between gap-2.5">
          <div className="flex items-center gap-1.5">
            <div className={`w-2.5 h-2.5 rounded-full`} style={{ backgroundColor: activeRoute.color }} />
            <span className="font-sans font-bold text-slate-700 text-xs shrink-0">
              {activeRoute.agencyName}
            </span>
          </div>

          <div className="flex gap-1.5 items-center">
            <span className="text-[9px] font-mono bg-slate-200 text-slate-600 px-1.5 py-0.5 rounded-md font-bold">
              {activeRoute.feedId}
            </span>
            <span className="text-[9px] font-mono bg-[#46868e]/10 text-[#46868e] px-1.5 py-0.5 rounded-md font-bold">
              OMD: #{activeRoute.openMobilityId.split('-').pop()}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-[10.5px] text-slate-500 border-t border-slate-200/60 pt-2.5">
          <div>
            <span className="text-[9px] font-mono text-slate-400 block font-bold">FREQUENCY</span>
            <span className="font-sans font-bold text-slate-700 mt-0.5 block">Every {activeRoute.frequencyMinutes} mins</span>
          </div>
          <div>
            <span className="text-[9px] font-mono text-slate-400 block font-bold">TRANSIT MODE</span>
            <span className="font-sans font-semibold text-indigo-600 capitalize mt-0.5 block">{activeRoute.transitMode} corridor</span>
          </div>
          <div>
            <span className="text-[9px] font-mono text-slate-400 block font-bold">BASE PH FARE</span>
            <span className="font-sans font-bold text-slate-700 mt-0.5 block">₱{activeRoute.fareStart.toFixed(2)} PHP</span>
          </div>
          <div>
            <span className="text-[9px] font-mono text-slate-400 block font-bold">OPERATING HOURS</span>
            <span className="font-sans font-semibold text-slate-600 mt-0.5 block truncate" title={activeRoute.operatingHours}>
              {activeRoute.operatingHours}
            </span>
          </div>
        </div>
      </div>

      {/* METRIC SUBTABS */}
      <div className="flex border-b border-slate-100">
        <button
          type="button"
          onClick={() => setActiveTabSub('stops')}
          className={`flex-1 py-2 text-center text-xs font-bold font-sans border-b-2 transition-all cursor-pointer ${
            activeTabSub === 'stops'
              ? 'border-indigo-650 text-indigo-750'
              : 'border-transparent text-slate-400 hover:text-slate-600'
          }`}
        >
          Stations Stops ({activeRoute.stops.length})
        </button>
        <button
          type="button"
          onClick={() => setActiveTabSub('timetable')}
          className={`flex-1 py-2 text-center text-xs font-bold font-sans border-b-2 transition-all cursor-pointer ${
            activeTabSub === 'timetable'
              ? 'border-indigo-650 text-indigo-750'
              : 'border-transparent text-slate-400 hover:text-slate-600'
          }`}
        >
          Relative Departure Times
        </button>
        <button
          type="button"
          onClick={() => setActiveTabSub('intelligence')}
          className={`flex-1 py-2 text-center text-xs font-bold font-sans border-b-2 transition-all cursor-pointer ${
            activeTabSub === 'intelligence'
              ? 'border-indigo-650 text-indigo-750'
              : 'border-transparent text-slate-400 hover:text-slate-600'
          }`}
        >
          GTFS Feed Metadata
        </button>
      </div>

      {/* SEARCH AND CONTROL ACTION BOX */}
      <AnimatePresence mode="wait">
        {activeTabSub === 'stops' && (
          <motion.div
            key="sub-stops"
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -5 }}
            className="flex flex-col gap-3"
          >
            {/* Minimal Search field inside Stops */}
            <div className="relative">
              <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                id="gtfs-stop-search-box"
                placeholder="Search specific target stop in this GTFS route..."
                value={searchStopQuery}
                onChange={(e) => setSearchStopQuery(e.target.value)}
                className="w-full bg-slate-50 hover:bg-slate-100/60 border border-slate-200 rounded-2xl pl-9 pr-3.5 py-2.5 text-xs focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-indigo-550 transition-all font-sans"
              />
            </div>

            {/* List scrollbox */}
            <div className="max-h-60 overflow-y-auto divide-y divide-slate-100 border border-slate-150 rounded-2xl bg-white px-3.5 shadow-inner">
              {filteredStops.length === 0 ? (
                <div className="py-6 text-center text-xs text-slate-400 font-sans">
                  No stations match your query search.
                </div>
              ) : (
                filteredStops.map((stop, i) => {
                  const pinned = isSearchStopPinned(stop.lat, stop.lng);
                  return (
                    <div key={stop.id} className="py-3 flex items-center justify-between text-left">
                      <div className="flex items-center gap-2.5 min-w-0 pr-2">
                        <span className="font-mono text-[10px] font-bold text-slate-400 w-4 shrink-0">
                          {stop.sequence}
                        </span>
                        <div className="min-w-0">
                          <span className="font-sans font-semibold text-slate-700 text-xs block truncate">
                            {stop.name}
                          </span>
                          <span className="text-[10px] text-slate-400 flex items-center gap-0.5 mt-0.5 block truncate">
                            <MapPin size={10} className="shrink-0" />
                            {stop.lat.toFixed(4)}°, {stop.lng.toFixed(4)}° • {i > 0 ? `+${stop.distancePrevKm} km` : 'Origin'}
                          </span>
                        </div>
                      </div>

                      <button
                        type="button"
                        id={`btn-pin-${stop.id}`}
                        disabled={pinned}
                        onClick={() => handlePinStop(stop)}
                        className={`px-2.5 py-1.5 rounded-xl text-[10px] h-7 font-bold font-sans flex items-center justify-center gap-1 cursor-pointer transition-all border ${
                          pinned 
                            ? 'bg-emerald-50 text-emerald-650 border-emerald-150 cursor-default' 
                            : 'bg-indigo-50 border-indigo-100 hover:bg-indigo-100 text-indigo-700'
                        }`}
                      >
                        <Plus size={10} />
                        <span>{pinned ? 'Pinned ✦' : 'Add Stop'}</span>
                      </button>
                    </div>
                  );
                })
              )}
            </div>

            {/* General CTA load full route button */}
            <button
              type="button"
              id="btn-import-entire-gtfs-line"
              onClick={handleImportEntireLine}
              className="mt-1 bg-gradient-to-r from-slate-900 to-indigo-900 hover:from-slate-800 hover:to-indigo-800 text-white font-sans font-bold py-2.5 px-4 rounded-2xl text-[11px] flex items-center justify-center gap-2 transition-all cursor-pointer shadow-sm hover:shadow-md"
            >
              <Compass size={14} className="animate-spin" style={{ animationDuration: '8s' }} />
              <span>Overwrite Interactive Corridor Map with All {activeRoute.stops.length} Stations</span>
            </button>
          </motion.div>
        )}

        {/* TIMETABLE VIEW */}
        {activeTabSub === 'timetable' && (
          <motion.div
            key="sub-timetable"
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -5 }}
            className="flex flex-col gap-3.5 text-left"
          >
            <div className="bg-slate-50 border border-slate-200/60 p-3 rounded-2xl flex items-start gap-2.5">
              <Info size={14} className="text-indigo-600 shrink-0 mt-0.5" />
              <p className="text-[10px] text-slate-500 font-sans leading-relaxed">
                Departure boards generated from community transit frequency standards aligned to Manila's timetables. Fast-forward Simulated Clock above to see dynamic board shifts!
              </p>
            </div>

            <div className="max-h-60 overflow-y-auto divide-y divide-slate-100 border border-slate-150 rounded-2xl bg-white px-3.5 shadow-inner">
              {activeRoute.stops.map((stop) => {
                const departures = calculateDeparturesForStop(stop.sequence, activeRoute.frequencyMinutes);
                return (
                  <div key={`tt-${stop.id}`} className="py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div className="min-w-0 pr-2">
                      <div className="flex items-center gap-2">
                        <span className="w-5 h-5 rounded-full bg-slate-100 text-slate-500 flex items-center justify-center font-mono text-[9.5px] font-bold shrink-0">
                          {stop.sequence}
                        </span>
                        <span className="font-sans font-bold text-slate-700 text-xs truncate">
                          {stop.name}
                        </span>
                      </div>
                    </div>

                    {/* Upcoming runs listing */}
                    <div className="flex flex-wrap gap-1.5 shrink-0">
                      {departures.map((dep, idx) => (
                        <span
                          key={idx}
                          className={`text-[9px] font-mono font-bold px-2 py-0.5 rounded-lg border ${
                            idx === 0 
                              ? 'bg-[#46868e]/5 border-[#46868e]/20 text-[#46868e] animate-pulse' 
                              : 'bg-slate-50 border-slate-100 text-slate-500'
                          }`}
                        >
                          {idx === 0 ? '📢 Station Next: ' : ''}{dep}
                        </span>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </motion.div>
        )}

        {/* FEED METADATA SPECIFICATIONS */}
        {activeTabSub === 'intelligence' && (
          <motion.div
            key="sub-intel"
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -5 }}
            className="flex flex-col gap-3 text-left"
          >
            <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-4 flex flex-col gap-3 text-xs leading-relaxed text-slate-600">
              <div className="flex items-center justify-between gap-2 border-b border-slate-200 pb-2.5">
                <span className="font-sans font-bold text-slate-800">
                  Open Transit Feed Registration
                </span>
                <span className="text-[9px] font-mono bg-emerald-100 text-emerald-800 px-1.5 py-0.5 rounded-md font-bold uppercase">
                  Verified Free License
                </span>
              </div>
              
              <div className="flex flex-col gap-2">
                <p className="font-sans text-slate-500 text-[11px]">
                  Under cooperation with public transit advocates, GTFS (General Transit Feed Specification) models are synchronized to map exact paths.
                </p>

                <div className="flex flex-col gap-2 bg-white p-3 rounded-xl border border-slate-150 font-mono text-[10.5px]">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Transitland ID:</span>
                    <a 
                      href={activeRoute.feedUrl} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-indigo-600 hover:underline font-bold flex items-center gap-0.5"
                    >
                      {activeRoute.feedId} <ExternalLink size={10} />
                    </a>
                  </div>
                  <div className="flex justify-between mt-1">
                    <span className="text-slate-400">OpenMobility Name:</span>
                    <span className="text-slate-700 font-bold">{activeRoute.openMobilityId}</span>
                  </div>
                  <div className="flex justify-between mt-1 pt-1 border-t border-slate-100">
                    <span className="text-slate-400">Feed Format:</span>
                    <span className="text-[#46868e] font-bold">GTFS Static v2</span>
                  </div>
                </div>

                <div className="bg-indigo-50/50 p-3 rounded-xl border border-indigo-100/40 flex items-center gap-2">
                  <Award size={16} className="text-indigo-600 shrink-0" />
                  <p className="text-[10px] text-slate-500 font-sans">
                    <strong>Tiki Contribution:</strong> These free datasets enable low-carbon path planning offline. Keeping schedules open is critical for an equitable, eco-friendly transit future!
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default GtfsScheduleBrowser;
