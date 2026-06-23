/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useRef, useState } from 'react';
import { MapPin, Plus, Trash2, ArrowRight, Layers, Sliders, Navigation, RefreshCw, Compass, Search } from 'lucide-react';
import { Waypoint, TransitMode, CommuterRoute } from '../types';

interface InteractiveMapProps {
  waypoints: Waypoint[];
  onWaypointsChange: (waypoints: Waypoint[]) => void;
  transitMode: TransitMode;
  onTransitModeChange: (mode: TransitMode) => void;
  isLowData: boolean;
  isOffline: boolean;
  appState: string;
  isTikiNightMode?: boolean;
}

// Predefined fun locations for quick routing pinning
const PRESET_LOCATIONS = [
  { id: '1', name: 'Manila Central Hub (Recto)', lat: 14.6033, lng: 120.9831 },
  { id: '2', name: 'Ayala Triangle Gardens (Makati)', lat: 14.5574, lng: 121.0252 },
  { id: '3', name: 'Taft Avenue DLSU Campus', lat: 14.5648, lng: 120.9932 },
  { id: '4', name: 'Chinatown Binondo Corridor', lat: 14.6015, lng: 120.9749 },
  { id: '5', name: 'Rizal Park Picnic Area', lat: 14.5826, lng: 120.9787 },
];

const PHILIPPINES_LANDMARKS = [
  { id: 'vl-1', name: 'Fort Santiago Intramuros', lat: 14.5942, lng: 120.9701 },
  { id: 'vl-2', name: 'LRT-2 Recto Station Mall', lat: 14.6033, lng: 120.9831 },
  { id: 'vl-3', name: 'MRT-3 North Avenue Station', lat: 14.6533, lng: 121.0315 },
  { id: 'vl-4', name: 'Ayala Triangle Gardens', lat: 14.5574, lng: 121.0252 },
  { id: 'vl-5', name: 'Bonifacio High Street BGC', lat: 14.5512, lng: 121.0518 },
  { id: 'vl-6', name: 'Quiapo Church Plaza', lat: 14.5988, lng: 120.9837 },
  { id: 'vl-7', name: 'Binondo Chinatown Arch', lat: 14.6015, lng: 120.9749 },
  { id: 'vl-8', name: 'Manila Cathedral', lat: 14.5916, lng: 120.9734 },
  { id: 'vl-9', name: 'Cultural Center of the Phils', lat: 14.5571, lng: 120.9886 },
  { id: 'vl-10', name: 'Ortigas Crossing Terminal', lat: 14.5847, lng: 121.0610 },
  { id: 'vl-11', name: 'Quezon Memorial Circle', lat: 14.6515, lng: 121.0494 },
  { id: 'vl-12', name: 'Rizal Monument Luneta', lat: 14.5826, lng: 120.9787 },
  { id: 'vl-13', name: 'SM Mall of Asia Globe', lat: 14.5351, lng: 120.9822 },
  { id: 'vl-14', name: 'CCP Baywalk Harbor', lat: 14.5545, lng: 120.9825 },
  { id: 'vl-15', name: 'NAIA Airport Terminal 3', lat: 14.5140, lng: 121.0163 },
  { id: 'vl-16', name: 'National Museum of Fine Arts', lat: 14.5869, lng: 120.9812 },
];

const fetchPlaceName = async (lat: number, lng: number): Promise<string> => {
  try {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=18&addressdetails=1`,
      {
        headers: {
          'Accept-Language': 'en'
        },
        signal: AbortSignal.timeout(6000)
      }
    );
    if (response.ok) {
      const data = await response.json();
      if (data && data.address) {
        const addr = data.address;

        // 1. Specific features of active interest (Station, Building, Amenity, Shop, Tourism, Leisure)
        const specificName =
          addr.amenity ||
          addr.building ||
          addr.tourism ||
          addr.shop ||
          addr.leisure ||
          addr.historic ||
          addr.railway ||
          addr.aeroway ||
          addr.station ||
          addr.subway;

        if (specificName) {
          const container = addr.neighbourhood || addr.suburb || addr.city || addr.town;
          if (container && !specificName.toLowerCase().includes(container.toLowerCase())) {
            return `${specificName}, ${container}`;
          }
          return specificName;
        }

        // 2. Exact street address/highways
        if (addr.road) {
          const street = addr.road;
          const num = addr.house_number ? `${addr.house_number} ` : '';
          const locality = addr.neighbourhood || addr.suburb || addr.city || addr.town;
          if (locality) {
            return `${num}${street}, ${locality}`;
          }
          return `${num}${street}`;
        }

        // 3. Medium scale localization structures (Neighborhood/Suburb)
        if (addr.neighbourhood || addr.suburb) {
          const district = addr.neighbourhood || addr.suburb;
          const city = addr.city || addr.town || addr.village;
          if (city && !district.toLowerCase().includes(city.toLowerCase())) {
            return `${district}, ${city}`;
          }
          return district;
        }

        // 4. City, Town or Village names directly
        const mainLocality = addr.city || addr.town || addr.village || addr.municipality || addr.county || addr.state;
        if (mainLocality) {
          return mainLocality;
        }

        // 5. Shortest fallback segment from display_name
        if (data.display_name) {
          const parts = data.display_name.split(',');
          if (parts.length > 0) {
            return parts[0].trim();
          }
        }
      }
    }
  } catch (err) {
    console.error('Failed to reverse geocode coordinate:', err);
  }

  // Fallback to closest local landmark if reverse lookup is slow, offline, or returns empty
  let closestLandmark = null;
  let minDistance = Infinity;
  const allLandmarks = [...PRESET_LOCATIONS, ...PHILIPPINES_LANDMARKS];
  for (const lm of allLandmarks) {
    const dist = Math.hypot(lm.lat - lat, lm.lng - lng);
    if (dist < minDistance && dist < 0.005) { // within reasonable limit
      minDistance = dist;
      closestLandmark = lm;
    }
  }
  if (closestLandmark) {
    return closestLandmark.name;
  }

  // Final precise Coordinate view
  return `Point (${lat.toFixed(4)}, ${lng.toFixed(4)})`;
};

const getDefaultFare = (mode: TransitMode): number => {
  switch (mode) {
    case 'walk': return 0.00;
    case 'cycle': return 0.00;
    case 'bus': return 2.50;
    case 'metro': return 3.25;
    default: return 0.00;
  }
};

export default function InteractiveMap({
  waypoints,
  onWaypointsChange,
  transitMode,
  onTransitModeChange,
  isLowData,
  isOffline,
  appState,
  isTikiNightMode = false,
}: InteractiveMapProps) {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null); // Leaflet map pointer
  const markersGroupRef = useRef<any>(null); // Markers container
  const polylineRef = useRef<any>(null); // Routing line
  const tileLayerRef = useRef<any>(null); // Leaflet tile layer pointer
  const [mapLoaded, setMapLoaded] = useState(false);
  const [mapError, setMapError] = useState(false);
  const [activePresetIndex, setActivePresetIndex] = useState(-1);

  // Custom UI Map overlays states
  const [mapRotation, setMapRotation] = useState(0);
  const [isLocating, setIsLocating] = useState(false);
  const [mapAlert, setMapAlert] = useState<{ text: string; type: 'success' | 'info' | 'error' } | null>(null);

  const showMapAlert = (text: string, type: 'success' | 'info' | 'error' = 'info') => {
    setMapAlert({ text, type });
  };

  // Clean local notification alerts after 4.5s
  useEffect(() => {
    if (!mapAlert) return;
    const timer = setTimeout(() => {
      setMapAlert(null);
    }, 4500);
    return () => clearTimeout(timer);
  }, [mapAlert]);

  const handleResetRotation = () => {
    setMapRotation(0);
    showMapAlert("Orientation reset northwards (0°)", "info");
    
    // Recenter and fit boundaries beautifully
    if (mapInstanceRef.current && markersGroupRef.current && waypoints.length > 1) {
      try {
        mapInstanceRef.current.fitBounds(markersGroupRef.current.getBounds(), {
          padding: [50, 50],
          maxZoom: 15
        });
      } catch (e) {}
    } else if (mapInstanceRef.current && waypoints.length === 1) {
      try {
        mapInstanceRef.current.setView([waypoints[0].lat, waypoints[0].lng], 14);
      } catch (e) {}
    } else if (mapInstanceRef.current) {
      try {
        mapInstanceRef.current.setView([14.5995, 120.9842], 13);
      } catch (e) {}
    }
  };

  const handleGetCurrentLocation = () => {
    if (!navigator.geolocation) {
      showMapAlert("Geolocation standard is not supported by this browser config.", "error");
      return;
    }
    setIsLocating(true);
    showMapAlert("Requesting browser GPS location access...", "info");

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        
        // Let's center the map on this location
        if (mapInstanceRef.current) {
          mapInstanceRef.current.setView([latitude, longitude], 15);
        }

        // Add as a new waypoint
        const tempId = Math.random().toString();
        const newWaypoint: Waypoint = {
          id: tempId,
          name: 'Resolving GPS location...',
          lat: latitude,
          lng: longitude,
          transitMode: transitMode,
          fare: getDefaultFare(transitMode)
        };

        const updatedWaypoints = [...waypoints, newWaypoint];
        onWaypointsChange(updatedWaypoints);
        showMapAlert("Coordinates locked! Resolving Manila street markers...", "success");

        try {
          const resolvedName = await fetchPlaceName(latitude, longitude);
          onWaypointsChange(
            updatedWaypoints.map(wp => wp.id === tempId ? { ...wp, name: resolvedName || 'Pinned GPS Spot' } : wp)
          );
          showMapAlert("Success: Location pinned onto your roadmap!", "success");
        } catch (e) {
          onWaypointsChange(
            updatedWaypoints.map(wp => wp.id === tempId ? { ...wp, name: 'Current Location' } : wp)
          );
        }
        setIsLocating(false);
      },
      (error) => {
        console.error("Geolocation error:", error);
        setIsLocating(false);
        showMapAlert(`Location request declined: ${error.message}`, "error");
      },
      { enableHighAccuracy: true, timeout: 9000 }
    );
  };

  // React state references to avoid Leaflet mapping click listeners closure stale values
  const waypointsRef = useRef<Waypoint[]>(waypoints);
  const transitModeRef = useRef<TransitMode>(transitMode);
  const onWaypointsChangeRef = useRef<(ways: Waypoint[]) => void>(onWaypointsChange);

  const [mapSearchQuery, setMapSearchQuery] = useState('');
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [onlineSearchResults, setOnlineSearchResults] = useState<any[]>([]);
  const [isSearchingOnline, setIsSearchingOnline] = useState(false);

  useEffect(() => {
    if (!mapSearchQuery.trim() || isOffline) {
      setOnlineSearchResults([]);
      return;
    }

    const handler = setTimeout(async () => {
      setIsSearchingOnline(true);
      try {
        const response = await fetch(
          `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
            mapSearchQuery
          )}&countrycodes=ph&limit=6`,
          {
            headers: {
              'Accept-Language': 'en-US,en;q=0.9',
              'User-Agent': 'TikiMascotTransitPlanner'
            }
          }
        );
        if (response.ok) {
          const data = await response.json();
          const items = data.map((item: any) => {
            const parts = item.display_name.split(',');
            const shortName = parts[0];
            const secondary = parts.slice(1, 3).map((p: string) => p.trim()).join(', ');
            return {
              id: 'osm-' + item.place_id,
              name: secondary ? `${shortName} (${secondary})` : shortName,
              lat: parseFloat(item.lat),
              lng: parseFloat(item.lon)
            };
          });
          setOnlineSearchResults(items);
        }
      } catch (error) {
        console.error('Error fetching online locations:', error);
      } finally {
        setIsSearchingOnline(false);
      }
    }, 450);

    return () => clearTimeout(handler);
  }, [mapSearchQuery, isOffline]);

  useEffect(() => {
    waypointsRef.current = waypoints;
  }, [waypoints]);

  useEffect(() => {
    transitModeRef.current = transitMode;
  }, [transitMode]);

  useEffect(() => {
    onWaypointsChangeRef.current = onWaypointsChange;
  }, [onWaypointsChange]);

  useEffect(() => {
    const handleOutsideClick = () => {
      setShowSearchResults(false);
    };
    window.addEventListener('click', handleOutsideClick);
    return () => {
      window.removeEventListener('click', handleOutsideClick);
    };
  }, []);

  // Synchronously update Tile Layer on the fly during night mode toggle shifts
  useEffect(() => {
    if (tileLayerRef.current) {
      const activeTileUrl = isTikiNightMode
        ? 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png'
        : 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
      tileLayerRef.current.setUrl(activeTileUrl);
    }
  }, [isTikiNightMode]);

  // Dynamic Leaflet CDN Loader
  useEffect(() => {
    if (isLowData || isOffline || appState === 'loading' || appState === 'empty') {
      // Clean up Leaflet in non-interactive/low-data modes to save memory/data
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
      setMapLoaded(false);
      return;
    }

    let leafletScript: HTMLScriptElement | null = null;
    let leafletStyle: HTMLLinkElement | null = null;

    const initializeLeaflet = () => {
      const L = (window as any).L;
      if (!L || !mapContainerRef.current) return;

      try {
        if (!mapInstanceRef.current) {
          // Initialize map centered at Metro Manila, Philippines
          const centerLat = waypoints.length > 0 ? waypoints[0].lat : 14.5995;
          const centerLng = waypoints.length > 0 ? waypoints[0].lng : 120.9842;

          mapInstanceRef.current = L.map(mapContainerRef.current, {
            center: [centerLat, centerLng],
            zoom: 13,
            zoomControl: false, // Cleaner minimalist look
            attributionControl: false // Minimalist clean map Look
          });

          // Conditionally load night/light tile layer and assign to tileLayerRef
          tileLayerRef.current = L.tileLayer(
            isTikiNightMode
              ? 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png'
              : 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
            {
              maxZoom: 19,
              attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
            }
          ).addTo(mapInstanceRef.current);

          markersGroupRef.current = L.featureGroup().addTo(mapInstanceRef.current);
          polylineRef.current = L.polyline([], {
            color: '#14b8a6', // Turquoise primary color
            weight: 4,
            opacity: 0.8,
            dashArray: transitMode === 'walk' ? '5, 8' : transitMode === 'bus' ? '12, 6' : undefined
          }).addTo(mapInstanceRef.current);

          // Map Click to pin
          mapInstanceRef.current.on('click', (e: any) => {
            const { lat, lng } = e.latlng;
            const currentWaypoints = waypointsRef.current;
            const currentTransitMode = transitModeRef.current;

            const tempId = Math.random().toString();
            const newWaypoint: Waypoint = {
              id: tempId,
              name: 'Resolving location...',
              lat,
              lng,
              transitMode: currentTransitMode,
              fare: getDefaultFare(currentTransitMode)
            };
            onWaypointsChangeRef.current([...currentWaypoints, newWaypoint]);

            // Query dynamic reverse geocoding
            fetchPlaceName(lat, lng).then((resolvedName) => {
              const current = waypointsRef.current;
              const updated = current.map((wp) =>
                wp.id === tempId ? { ...wp, name: resolvedName } : wp
              );
              onWaypointsChangeRef.current(updated);
            }).catch(() => {
              const current = waypointsRef.current;
              const updated = current.map((wp) =>
                wp.id === tempId ? { ...wp, name: `Pin Stop ${current.findIndex((p) => p.id === tempId) + 1}` } : wp
              );
              onWaypointsChangeRef.current(updated);
            });
          });
        }
        setMapLoaded(true);
        setMapError(false);
      } catch (err) {
        console.error('Error styling map:', err);
        setMapError(true);
      }
    };

    // Load CSS
    if (!document.getElementById('leaflet-css')) {
      leafletStyle = document.createElement('link');
      leafletStyle.id = 'leaflet-css';
      leafletStyle.rel = 'stylesheet';
      leafletStyle.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
      document.head.appendChild(leafletStyle);
    }

    // Load JS
    if (!(window as any).L) {
      leafletScript = document.createElement('script');
      leafletScript.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
      leafletScript.async = true;
      leafletScript.onload = initializeLeaflet;
      leafletScript.onerror = () => setMapError(true);
      document.body.appendChild(leafletScript);
    } else {
      // If already present, initialize instantly
      setTimeout(initializeLeaflet, 50);
    }

    return () => {
      // Cleanup leaflet on detach unless remaining active
    };
  }, [isLowData, isOffline, appState]);

  // Resize observer to auto-adapt map container dimensions safely
  useEffect(() => {
    if (!mapContainerRef.current) return;
    let resizeTimer: NodeJS.Timeout;
    const observer = new ResizeObserver(() => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => {
        if (mapInstanceRef.current) {
          try {
            mapInstanceRef.current.invalidateSize();
            if (waypoints.length > 1 && markersGroupRef.current) {
              mapInstanceRef.current.fitBounds(markersGroupRef.current.getBounds(), {
                padding: [50, 50],
                maxZoom: 15
              });
            } else if (waypoints.length === 1) {
              mapInstanceRef.current.setView([waypoints[0].lat, waypoints[0].lng]);
            }
          } catch (e) {
            // safe catch
          }
        }
      }, 100);
    });
    observer.observe(mapContainerRef.current);
    return () => {
      observer.disconnect();
      clearTimeout(resizeTimer);
    };
  }, [mapLoaded, waypoints]);

  // Sync custom waypoints markers & polyline path
  useEffect(() => {
    const L = (window as any).L;
    if (!L || !mapInstanceRef.current || !markersGroupRef.current) return;

    // Clear existing markers
    markersGroupRef.current.clearLayers();

    const latlngs: [number, number][] = [];

    // Custom Icon helper
    const createCircleMarkerIcon = (index: number, total: number) => {
      const isStart = index === 0;
      const isEnd = index === total - 1;
      const bgClass = isStart ? 'bg-indigo-600' : isEnd ? 'bg-rose-500' : 'bg-slate-700';
      const label = isStart ? 'S' : isEnd ? 'E' : `${index + 1}`;

      return L.divIcon({
        className: 'custom-leaflet-marker',
        html: `
          <div class="flex items-center justify-center w-8 h-8 rounded-full border-2 border-white text-white font-bold shadow-lg ${bgClass} transform transition-transform duration-200">
            ${label}
          </div>
        `,
        iconSize: [32, 32],
        iconAnchor: [16, 16],
      });
    };

    waypoints.forEach((wp, index) => {
      latlngs.push([wp.lat, wp.lng]);

      const marker = L.marker([wp.lat, wp.lng], {
        icon: createCircleMarkerIcon(index, waypoints.length),
        draggable: true,
      });

      // Update position on dragend
      marker.on('dragend', (e: any) => {
        const { lat, lng } = e.target.getLatLng();
        const updated = [...waypoints];
        updated[index] = { ...updated[index], lat, lng };
        onWaypointsChange(updated);
      });

      // Simple click menu
      marker.bindPopup(`
        <div class="p-2 font-sans">
          <p class="font-semibold text-slate-800 text-sm m-0">${wp.name}</p>
          <p class="text-xs text-slate-400 mt-1">Latitude: ${wp.lat.toFixed(4)}, Longitude: ${wp.lng.toFixed(4)}</p>
          <p class="text-xs text-indigo-600 mt-1 font-medium">Drag me to edit the line path!</p>
        </div>
      `);

      markersGroupRef.current.addLayer(marker);
    });

    if (polylineRef.current) {
      polylineRef.current.setLatLngs(latlngs);
      polylineRef.current.setStyle({
        dashArray: transitMode === 'walk' ? '5, 8' : transitMode === 'bus' ? '12, 6' : undefined,
        color: transitMode === 'walk' ? '#10b981' : transitMode === 'bus' ? '#4f46e5' : transitMode === 'metro' ? '#9333ea' : '#ea580c'
      });
    }

    // Recenter map bounds to wrap routes beautifully
    if (waypoints.length > 1) {
      try {
        mapInstanceRef.current.fitBounds(markersGroupRef.current.getBounds(), {
          padding: [50, 50],
          maxZoom: 15
        });
      } catch (e) {
        // Safe check
      }
    } else if (waypoints.length === 1) {
      mapInstanceRef.current.setView([waypoints[0].lat, waypoints[0].lng], 14);
    }

    // Invalidate map size to make sure pins render beautifully on load
    if (mapInstanceRef.current) {
      setTimeout(() => {
        try {
          mapInstanceRef.current.invalidateSize();
        } catch (e) {}
      }, 50);
    }
  }, [waypoints, transitMode, mapLoaded]);

  const addPresetWaypoint = (preset: typeof PRESET_LOCATIONS[0]) => {
    // Avoid double inclusion of same id easily
    const newWaypoint: Waypoint = {
      id: Math.random().toString(),
      name: preset.name,
      lat: preset.lat,
      lng: preset.lng,
      transitMode: transitMode,
      fare: getDefaultFare(transitMode)
    };
    onWaypointsChange([...waypoints, newWaypoint]);
  };

  const removeWaypoint = (id: string) => {
    onWaypointsChange(waypoints.filter((wp) => wp.id !== id));
  };

  const clearAllWaypoints = () => {
    onWaypointsChange([]);
  };

  // Safe details calculation
  const calculatedStats = () => {
    const totalFare = waypoints.reduce((sum, wp) => sum + (wp.fare || 0), 0);

    if (waypoints.length < 2) return { distance: 0, duration: 0, fare: totalFare };
    // Haversine heavy formula for coordinates line sum
    let totalDist = 0;
    for (let i = 0; i < waypoints.length - 1; i++) {
      const p1 = waypoints[i];
      const p2 = waypoints[i + 1];
      const R = 6371; // Earth radius in km
      const dLat = ((p2.lat - p1.lat) * Math.PI) / 180;
      const dLng = ((p2.lng - p1.lng) * Math.PI) / 180;
      const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos((p1.lat * Math.PI) / 180) *
          Math.cos((p2.lat * Math.PI) / 180) *
          Math.sin(dLng / 2) *
          Math.sin(dLng / 2);
      const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
      totalDist += R * c;
    }

    // Transit speed factors
    let speed = 4.5; // Walk is avg 4.5 km/h
    if (transitMode === 'cycle') speed = 16;
    if (transitMode === 'bus') speed = 24;
    if (transitMode === 'metro') speed = 42;

    const durationHrs = totalDist / speed;
    let finalDur = Math.round(durationHrs * 60);

    // Minor additions per transit turn / station dwell time
    if (waypoints.length > 2) {
      finalDur += (waypoints.length - 2) * 2; // +2 mins per station
    }

    return {
      distance: parseFloat(totalDist.toFixed(1)),
      duration: Math.max(1, finalDur),
      fare: totalFare
    };
  };

  const stats = calculatedStats();

  return (
    <div id="interactive-map-section" className="flex flex-col gap-6 w-full">
      {/* Main Map Box / Vector path visualization - TOP FULL WIDTH */}
      <div id="route-map-box" className="w-full flex flex-col gap-3">
        <div className="bg-slate-900 rounded-3xl p-1 shadow-md border-4 border-white h-[440px] relative overflow-hidden flex flex-col">
          {/* Header Map Indicators */}
          <div className="absolute top-4 left-4 z-20 flex gap-2">
            <div className="bg-slate-900/95 backdrop-blur-md px-3 py-1.5 rounded-xl border border-slate-800 flex items-center gap-1.5 shadow-sm">
              <div className="w-2 h-2 rounded-full bg-indigo-400 animate-ping" />
              <span className="text-[10px] uppercase font-mono font-bold text-slate-200">
                {isOffline ? 'OFFLINE (CACHED)' : isLowData ? 'LOW DATA MAP' : 'OSM LIVE TILE'}
              </span>
            </div>
          </div>

          {!isOffline && !isLowData && mapError && (
            <div className="absolute inset-0 bg-slate-900/80 backdrop-blur-xs flex flex-col items-center justify-center p-6 text-center z-20">
              <p className="text-rose-400 text-sm font-semibold">Could not load OpenStreetMap tiles</p>
              <p className="text-slate-400 text-xs mt-1">Please check your connection. Falling back to vector schematic layout.</p>
            </div>
          )}

          {/* Actual OpenStreetMap leaf div - Only mounted if Online & High Data */}
          {!isOffline && !isLowData ? (
            <div
              ref={mapContainerRef}
              className="w-full h-full rounded-2xl bg-slate-800 transition-all duration-300"
              style={{ 
                minHeight: '100%',
                transform: `rotate(${mapRotation}deg)`,
                transformOrigin: 'center center',
                transition: 'transform 0.5s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.3s'
              }}
            />
          ) : (
            /* Low Data / Offline Schematic Path Graphic */
            <div className="w-full h-full rounded-2xl bg-slate-950/95 flex flex-col items-center justify-center relative p-6">
              {/* Modern Circuit Matrix Backing Grid */}
              <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:24px_24px] opacity-25" />

              {waypoints.length < 2 ? (
                <div className="z-10 text-center max-w-sm flex flex-col items-center">
                  <div className="w-14 h-14 rounded-full bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center mb-3 text-indigo-400">
                    <Navigation size={28} className="animate-bounce" />
                  </div>
                  <h4 className="font-sans font-semibold text-slate-200 text-sm">
                    {isOffline ? 'Offline route planner active' : 'Low Data Mode active'}
                  </h4>
                  <p className="text-xs text-slate-400 font-sans mt-2 leading-relaxed">
                    We saved you data and battery by converting maps into a high-contrast vector grid layout. Pin custom stops below or tap the map directly!
                  </p>
                </div>
              ) : (
                <div 
                  className="w-full h-full flex flex-col justify-between z-10 py-4 relative transition-transform duration-500"
                  style={{ transform: `rotate(${mapRotation}deg)` }}
                >
                  <div className="px-2">
                    <h4 className="font-sans font-semibold text-slate-200 text-sm">Vector Commute Schematic</h4>
                    <p className="text-xs text-indigo-400 font-sans">Optimized path layout • GPS Cached offline</p>
                  </div>

                  {/* SVG Route Topology Map rendering in real-time */}
                  <div className="flex-1 flex items-center justify-center">
                    <svg className="w-full max-w-md h-36" viewBox="0 0 100 100" preserveAspectRatio="none">
                      {/* Grid connections */}
                      <path
                        d="M 5,50 Q 30,20 50,55 T 95,45"
                        fill="none"
                        stroke="#1e293b"
                        strokeWidth="3"
                        strokeDasharray="4,4"
                      />
                      {/* Active path */}
                      <path
                        d="M 12,50 C 35,30 65,70 88,40"
                        fill="none"
                        stroke="#4f46e5"
                        strokeWidth="4"
                        strokeLinecap="round"
                        strokeDasharray={transitMode === 'walk' ? '2,3' : transitMode === 'bus' ? '6,4' : undefined}
                        className="animate-[dash_8s_linear_infinite]"
                        style={{
                          strokeDashoffset: 100
                        }}
                      />

                      {/* Station points */}
                      {waypoints.map((wp, i) => {
                        const isFirst = i === 0;
                        const isLast = i === waypoints.length - 1;
                        const x = 12 + (i / (waypoints.length - 1)) * 76;
                        const y = isFirst ? 50 : isLast ? 40 : 50 + Math.sin(i * 1.8) * 15;

                        return (
                          <g key={wp.id} className="cursor-pointer group">
                            <circle
                              cx={x}
                              cy={y}
                              r={isFirst || isLast ? 6 : 4}
                              className={`${
                                isFirst
                                  ? 'fill-indigo-600 stroke-white'
                                  : isLast
                                  ? 'fill-rose-500 stroke-white'
                                  : 'fill-slate-800 stroke-indigo-400'
                              } stroke-2 transition-all group-hover:scale-125`}
                            />
                            <text
                              x={x}
                              y={y - 8}
                              textAnchor="middle"
                              fill="#94a3b8"
                              className="text-[5px] font-sans font-semibold uppercase tracking-wider"
                            >
                              {wp.name.substring(0, 10)}
                            </text>
                          </g>
                        );
                      })}
                    </svg>
                  </div>

                  {/* Summary of points */}
                  <div className="bg-slate-900 border border-slate-800 p-2.5 rounded-2xl flex items-center justify-between text-xs mx-2">
                    <div className="flex items-center gap-1.5">
                      <span className="font-bold text-indigo-400 uppercase font-mono text-[10px]">Route Sequence:</span>
                      <span className="text-slate-300 font-sans truncate max-w-[200px]">
                        {waypoints.map((wp) => wp.name.split(' ')[0]).join(' ➔ ')}
                      </span>
                    </div>
                    <span className="text-[10px] font-mono text-slate-500">
                      {waypoints.length} points
                    </span>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Map Controls Panel (Top Right Floating Layer) */}
          <div className="absolute top-4 right-4 z-20 flex flex-col gap-1.5">
            {/* GPS Geolocation Locator Button */}
            <button
              type="button"
              id="map-current-location-btn"
              onClick={handleGetCurrentLocation}
              disabled={isLocating}
              className={`w-9 h-9 rounded-xl bg-slate-900/95 border border-slate-800 hover:bg-slate-800 active:bg-slate-750 flex items-center justify-center shadow-lg transition-all cursor-pointer group ${
                isLocating ? 'animate-pulse text-indigo-400' : 'text-slate-200 hover:text-white'
              }`}
              title="Pin Current GPS Location"
            >
              <Navigation 
                size={14} 
                className={`${isLocating ? 'animate-spin' : 'group-hover:scale-110 transition-transform'}`} 
                style={{ transform: 'rotate(45deg)' }} 
              />
            </button>

            {/* Recenter / Focus Route View Button */}
            <button
              type="button"
              id="map-recenter-btn"
              onClick={handleResetRotation}
              className="w-9 h-9 rounded-xl bg-slate-900/95 border border-slate-800 hover:bg-slate-800 active:bg-slate-750 flex items-center justify-center shadow-lg transition-all cursor-pointer group text-slate-200 hover:text-white"
              title="Recenter Map & Fit Bounds"
            >
              <RefreshCw 
                size={13} 
                className="group-hover:rotate-180 transition-transform duration-500" 
              />
            </button>
          </div>

          {/* Mini Status Notification layer (Top Center Toast) */}
          {mapAlert && (
            <div className="absolute top-16 left-1/2 -translate-x-1/2 z-30 max-w-sm w-11/12 animate-fadeIn">
              <div className={`px-3.5 py-2 rounded-2xl shadow-xl border backdrop-blur-md text-xs font-medium flex items-center gap-2 ${
                mapAlert.type === 'success' 
                  ? 'bg-emerald-950/90 text-emerald-300 border-emerald-800/80' 
                  : mapAlert.type === 'error' 
                  ? 'bg-rose-950/90 text-rose-300 border-rose-800/80' 
                  : 'bg-slate-900/95 text-slate-200 border-slate-800'
              }`}>
                <div className={`w-1.5 h-1.5 rounded-full shrink-0 ${
                  mapAlert.type === 'success' ? 'bg-emerald-400' : mapAlert.type === 'error' ? 'bg-rose-400' : 'bg-indigo-400'
                }`} />
                <span className="truncate flex-1">{mapAlert.text}</span>
              </div>
            </div>
          )}

          {/* Floating Instruction Banner in Map */}
          <div className="absolute bottom-4 right-4 z-20">
            <div className="bg-slate-900/90 backdrop-blur-md border border-slate-800 p-2.5 rounded-2xl text-white flex items-center gap-2 max-w-64 shadow-lg">
              <span className="bg-indigo-500/20 text-indigo-400 rounded-lg p-1.5 shrink-0">
                <Sliders size={14} />
              </span>
              <div className="min-w-0">
                <p className="text-[10px] text-slate-400 font-mono uppercase">Pro Tip</p>
                <p className="text-[11px] text-slate-100 font-sans font-medium hover:text-indigo-400 transition-colors cursor-pointer">
                  {waypoints.length < 2
                    ? 'Add 2+ locations below or click the map directly'
                    : 'Drag any colored circle to move waypoints'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Config Panel - BELOW THE MAP */}
      <div id="route-refinement-card" className="w-full bg-slate-50/50 rounded-3xl p-5 border border-slate-200/60 shadow-xs flex flex-col gap-6 md:grid md:grid-cols-12 md:items-start">
        
        {/* Left Column: Preset triggers & analytics (5 cols) */}
        <div className="md:col-span-5 flex flex-col gap-4.5 pr-0 md:pr-2">
          <div>
            <h3 className="font-sans font-bold text-slate-800 text-sm tracking-tight uppercase">Route Planner Control</h3>
            <p className="text-[11px] text-slate-400 font-sans mt-0.5">Customize stops, edit default travel modes, and review total metrics instantly.</p>
          </div>

          {/* Autocomplete Landmarks Search Bar */}
          <div className="relative flex flex-col gap-1" onClick={(e) => e.stopPropagation()}>
            <label htmlFor="landmark-search-input" className="text-[9px] font-bold text-slate-400 font-sans uppercase tracking-wider">Search Map Landmarks</label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
                <Search size={13} />
              </span>
              <input
                id="landmark-search-input"
                type="text"
                placeholder="Search Philippines landmarks (e.g. Intramuros, Luneta)..."
                value={mapSearchQuery}
                onFocus={() => setShowSearchResults(true)}
                onChange={(e) => {
                  setMapSearchQuery(e.target.value);
                  setShowSearchResults(true);
                }}
                className="w-full text-xs bg-white border border-slate-200 rounded-xl pl-8.5 pr-12 py-2 text-slate-800 placeholder-slate-400 focus:outline-hidden focus:ring-2 focus:ring-indigo-600 font-sans shadow-2xs h-8"
                aria-label="Search Philippines landmarks and locations to add as stopover"
              />
              {mapSearchQuery && (
                <button
                  type="button"
                  onClick={() => setMapSearchQuery('')}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-[9px] text-slate-500 hover:text-slate-700 bg-slate-200 hover:bg-slate-300 border-0 h-5 px-1.5 rounded-md cursor-pointer font-sans font-bold"
                >
                  Clear
                </button>
              )}
            </div>

            {/* Suggestions absolute dropdown overlay */}
            {showSearchResults && mapSearchQuery.trim().length > 0 && (
              <div className="absolute top-[48px] inset-x-0 bg-white border border-slate-200/80 rounded-xl shadow-lg z-50 max-h-64 overflow-y-auto divide-y divide-slate-100 flex flex-col">
                {/* Offline Preset Matches Section */}
                {PHILIPPINES_LANDMARKS.filter(item => 
                  item.name.toLowerCase().includes(mapSearchQuery.toLowerCase())
                ).length > 0 && (
                  <div className="flex flex-col">
                    <div className="bg-slate-50 px-3 py-1.5 text-[9px] font-sans font-bold text-slate-400 uppercase tracking-wider text-left">
                      Preset Landmarks
                    </div>
                    {PHILIPPINES_LANDMARKS.filter(item => 
                      item.name.toLowerCase().includes(mapSearchQuery.toLowerCase())
                    ).map(landmark => (
                      <button
                        key={landmark.id}
                        type="button"
                        onClick={() => {
                          const isIncluded = waypoints.some((wp) => wp.name === landmark.name);
                          if (!isIncluded) {
                            const newWaypoint: Waypoint = {
                              id: Math.random().toString(),
                              name: landmark.name,
                              lat: landmark.lat,
                              lng: landmark.lng,
                              transitMode: transitMode,
                              fare: getDefaultFare(transitMode)
                            };
                            onWaypointsChange([...waypoints, newWaypoint]);
                          }
                          
                          // Center map beautifully to the chosen landmark
                          if (mapInstanceRef.current) {
                            try {
                              mapInstanceRef.current.setView([landmark.lat, landmark.lng], 15);
                            } catch (err) {
                              // fail-safe
                            }
                          }
                          
                          setMapSearchQuery('');
                          setShowSearchResults(false);
                        }}
                        className="w-full px-3 py-2 text-left text-xs font-sans text-slate-750 hover:bg-slate-50 transition-colors flex items-center justify-between cursor-pointer border-0 bg-transparent"
                      >
                        <span className="font-medium truncate text-slate-700">{landmark.name}</span>
                        <span className="text-[9px] font-sans text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-md shrink-0 font-bold flex items-center gap-1">
                          <MapPin size={10} className="text-indigo-600" /> Pin Stop
                        </span>
                      </button>
                    ))}
                  </div>
                )}

                {/* Online Geocoding Matches Section */}
                {!isOffline && (
                  <div className="flex flex-col">
                    <div className="bg-slate-55 px-3 py-1.5 text-[9px] font-sans font-bold text-slate-400 uppercase tracking-wider flex justify-between items-center border-t border-slate-100">
                      <span>Online Search Results (Philippines)</span>
                      {isSearchingOnline && (
                        <span className="animate-pulse text-indigo-600 font-bold text-[8px] uppercase">Searching...</span>
                      )}
                    </div>
                    
                    {onlineSearchResults.map(landmark => (
                      <button
                        key={landmark.id}
                        type="button"
                        onClick={() => {
                          const isIncluded = waypoints.some((wp) => wp.name === landmark.name);
                          if (!isIncluded) {
                            const newWaypoint: Waypoint = {
                              id: Math.random().toString(),
                              name: landmark.name,
                              lat: landmark.lat,
                              lng: landmark.lng,
                              transitMode: transitMode,
                              fare: getDefaultFare(transitMode)
                            };
                            onWaypointsChange([...waypoints, newWaypoint]);
                          }
                          
                          // Center map beautifully to the chosen landmark
                          if (mapInstanceRef.current) {
                            try {
                              mapInstanceRef.current.setView([landmark.lat, landmark.lng], 15);
                            } catch (err) {
                              // fail-safe
                            }
                          }
                          
                          setMapSearchQuery('');
                          setShowSearchResults(false);
                        }}
                        className="w-full px-3 py-2 text-left text-xs font-sans text-slate-750 hover:bg-slate-50 transition-colors flex items-center justify-between cursor-pointer border-0 bg-transparent"
                      >
                        <span className="font-medium truncate text-slate-800">{landmark.name}</span>
                        <span className="text-[9px] font-sans text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md shrink-0 font-bold flex items-center gap-1">
                          <MapPin size={10} className="text-emerald-500" /> Pin Stop
                        </span>
                      </button>
                    ))}

                    {!isSearchingOnline && onlineSearchResults.length === 0 && (
                      <div className="px-3 py-2 text-[10px] text-slate-400 italic font-sans text-center">
                        Type keyword to query Cebu or anywhere else...
                      </div>
                    )}
                  </div>
                )}

                {/* Clearances and overall empty states */}
                {PHILIPPINES_LANDMARKS.filter(item => 
                  item.name.toLowerCase().includes(mapSearchQuery.toLowerCase())
                ).length === 0 && (isOffline || onlineSearchResults.length === 0) && !isSearchingOnline && (
                  <div className="px-3 py-4 text-xs text-slate-400 text-center font-sans">
                    No matching landmarks found. {isOffline && "(Device is offline)"}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Quick presets pills */}
          <div className="flex flex-col gap-1">
            <label className="text-[9px] font-bold text-slate-400 font-sans uppercase tracking-wider">Quick Preset Locations</label>
            <div className="flex flex-wrap gap-1">
              {PRESET_LOCATIONS.map((preset) => {
                const isIncluded = waypoints.some((wp) => wp.name === preset.name);
                return (
                  <button
                    key={preset.id}
                    type="button"
                    onClick={() => addPresetWaypoint(preset)}
                    disabled={isIncluded}
                    className={`py-0.5 px-2 rounded-full text-[9px] font-sans font-medium transition-all flex items-center gap-0.5 cursor-pointer border ${
                      isIncluded
                        ? 'bg-slate-100 text-slate-400 border-slate-150 cursor-not-allowed opacity-50'
                        : 'bg-indigo-50 hover:bg-indigo-100 border-indigo-100 text-indigo-700'
                    }`}
                  >
                    <Plus size={9} /> {preset.name.split(' ')[0]}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Base Transit Mode Custom Selector */}
          <div className="flex flex-col gap-1">
            <label className="text-[9px] font-bold text-slate-400 font-sans uppercase tracking-wider">Default Transport Type</label>
            <div className="grid grid-cols-4 gap-1 p-0.5 bg-white border border-slate-200/60 rounded-xl">
              {(['walk', 'bus', 'metro', 'cycle'] as TransitMode[]).map((mode) => (
                <button
                  key={mode}
                  type="button"
                  onClick={() => onTransitModeChange(mode)}
                  className={`py-1 rounded-lg text-[9px] font-sans font-bold capitalize transition-all cursor-pointer ${
                    transitMode === mode
                      ? 'bg-indigo-600 text-white shadow-xs'
                      : 'text-slate-600 hover:bg-slate-100 border-0 bg-transparent'
                  }`}
                >
                  {mode}
                </button>
              ))}
            </div>
          </div>

          {/* Commute Total Analytics Stats */}
          {waypoints.length >= 2 && (
            <div className="bg-slate-900 text-white p-3 rounded-2xl flex flex-col gap-2 shadow-xs">
              <div className="flex items-center justify-between border-b border-white/5 pb-1">
                <span className="text-[9px] font-sans font-bold text-slate-400 uppercase tracking-wide">
                  Active Commute Totals
                </span>
                <span className="text-[8px] font-mono text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded-full uppercase font-bold">
                  Live Verify
                </span>
              </div>
              <div className="grid grid-cols-3 gap-1.5 text-center">
                <div className="p-1">
                  <span className="text-[8px] text-slate-400 font-sans uppercase block">Duration</span>
                  <span className="text-[11px] font-bold text-slate-100 font-sans truncate block">
                    {stats.duration} <span className="text-[8px] font-semibold text-slate-400">mins</span>
                  </span>
                </div>
                <div className="p-1">
                  <span className="text-[8px] text-slate-400 font-sans uppercase block">Length</span>
                  <span className="text-[11px] font-bold text-slate-100 font-sans truncate block">
                    {stats.distance} <span className="text-[8px] font-semibold text-slate-400">km</span>
                  </span>
                </div>
                <div className="p-1">
                  <span className="text-[8px] text-slate-400 font-sans uppercase block">Est. Cost</span>
                  <span className="text-[11px] font-bold text-emerald-400 font-mono truncate block">
                    ${stats.fare.toFixed(2)}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Bookmark Custom Route Button */}
          {waypoints.length >= 2 && (
            <button
              type="button"
              onClick={() => {
                const newCommuterRoute: CommuterRoute = {
                  id: Math.random().toString(),
                  title: `${waypoints[0].name.split(' ')[0]} to ${waypoints[waypoints.length - 1].name.split(' ')[0]}`,
                  creator: 'Your Custom Route',
                  avatarUrl: '', 
                  transitMode: transitMode,
                  durationMinutes: stats.duration,
                  distanceKm: stats.distance,
                  tags: [transitMode === 'walk' ? 'Scenic' : transitMode === 'metro' ? 'Fast' : 'Eco-choice', 'Self-Made'],
                  likes: 1,
                  isSaved: true
                };

                const saved = localStorage.getItem('pio_custom_routes') || '[]';
                const parsed = JSON.parse(saved);
                parsed.unshift(newCommuterRoute);
                localStorage.setItem('pio_custom_routes', JSON.stringify(parsed));

                window.dispatchEvent(new CustomEvent('pio_route_created', { detail: newCommuterRoute }));
                window.dispatchEvent(
                  new CustomEvent('tikling_alert', {
                    detail: {
                      title: 'Route Saved Spark!',
                      message: `Tiki the Tikling has registered your new custom corridor: "${newCommuterRoute.title}". It is now saved to your saved profile bookmarks!`,
                      type: 'success'
                    }
                  })
                );
              }}
              className="mt-0.5 bg-indigo-600 hover:bg-indigo-700 text-white font-sans text-xs font-semibold py-2 px-3 rounded-xl flex items-center justify-center gap-1.5 transition-all shadow-sm hover:shadow-md cursor-pointer w-full border-0"
            >
              <MapPin size={12} /> Save route to Bookmarks
            </button>
          )}
        </div>

        {/* Right Column: Waypoint Sequencer STOP LIST (7 cols) */}
        <div className="md:col-span-7 flex flex-col gap-3.5 border-t md:border-t-0 md:border-l border-slate-200/60 pt-4 md:pt-0 md:pl-5 w-full">
          <div className="flex items-center justify-between border-b border-slate-100 pb-2">
            <div>
              <h4 className="font-sans font-bold text-slate-800 text-[13px] uppercase tracking-wide">Stop Pin Sequencer</h4>
              <p className="text-[10px] text-slate-400 font-sans leading-none mt-0.5">Customize stops, transit modes, and individual cost</p>
            </div>
            {waypoints.length > 0 && (
              <button
                type="button"
                onClick={clearAllWaypoints}
                className="text-[10px] text-rose-500 hover:text-rose-600 font-bold font-sans flex items-center gap-0.5 cursor-pointer bg-rose-50 hover:bg-rose-100/60 p-1 px-2 rounded-lg transition-colors border-0"
              >
                <Trash2 size={11} /> Clear Pins
              </button>
            )}
          </div>

          {waypoints.length === 0 ? (
            <div className="border border-dashed border-slate-200/80 rounded-2xl p-6 text-center bg-white flex flex-col items-center justify-center min-h-[160px]">
              <Compass className="mx-auto text-slate-300 animate-pulse mb-1.5" size={24} />
              <p className="text-xs text-slate-500 font-semibold font-sans">No stops pinned yet</p>
              <p className="text-[10px] text-slate-405 font-sans mt-0.5 max-w-xs leading-normal">
                Click Philippines landmarks or tap coordinates directly on the map to sequence stops!
              </p>
            </div>
          ) : (
            <div className="flex flex-col gap-4 max-h-[440px] overflow-y-auto pr-0.5">
              {waypoints.map((wp, index) => {
                const isStart = index === 0;
                const isEnd = index === waypoints.length - 1;
                return (
                  <div key={wp.id} className="flex gap-3.5 items-stretch">
                    {/* Visual Vertical Timeline Connector on Left */}
                    <div className="flex flex-col items-center shrink-0 w-8">
                      <div
                        className={`w-7 h-7 rounded-full flex items-center justify-center font-sans font-bold text-xs text-white shadow-xs z-10 shrink-0 ${
                          isStart ? 'bg-indigo-600 ring-4 ring-indigo-50' : isEnd ? 'bg-rose-500 ring-4 ring-rose-50' : 'bg-slate-705 bg-slate-700 ring-4 ring-slate-100'
                        }`}
                        title={isStart ? 'Starting Stop' : isEnd ? 'Ending Stop' : `Stop ${index + 1}`}
                      >
                        {index + 1}
                      </div>
                      {!isEnd && <div className="w-0.5 flex-1 bg-slate-350 bg-slate-300 my-1 border-dashed" />}
                    </div>

                    {/* Timeline Stop Card details */}
                    <div
                      className="flex-1 flex flex-col bg-white border border-slate-200/60 rounded-xl p-3 shadow-2xs hover:shadow-xs transition-shadow focus-within:ring-1 focus-within:ring-indigo-500/20 focus-within:border-slate-300 gap-2.5"
                    >
                      {/* Place Name Edit Input + Delete button */}
                      <div className="flex items-center gap-2">
                        <div className="flex-1">
                          <input
                            type="text"
                            value={wp.name}
                            onChange={(e) => {
                              const updated = [...waypoints];
                              updated[index] = { ...wp, name: e.target.value };
                              onWaypointsChange(updated);
                            }}
                            className="w-full text-xs font-bold text-slate-800 bg-transparent hover:bg-slate-50/50 focus:bg-white border-0 hover:ring-2 hover:ring-indigo-600 focus:ring-2 focus:ring-indigo-600 rounded-lg px-2 py-1 focus:outline-hidden font-sans"
                            placeholder="Type place name..."
                            aria-label={`Stop name for waypoint ${index + 1}`}
                          />
                        </div>

                        <button
                          type="button"
                          onClick={() => removeWaypoint(wp.id)}
                          className="text-slate-400 hover:text-rose-500 p-1.5 hover:bg-rose-50 rounded-lg transition-all cursor-pointer shrink-0 border-0 bg-transparent"
                          title="Remove Stop"
                          aria-label={`Remove waypoint stop ${index + 1}`}
                        >
                          <Trash2 size={12} />
                        </button>
                      </div>

                      {/* Transit Mode Selector + Numeric Fare input field */}
                      <div className="flex items-center justify-between gap-2 border-t border-slate-50 pt-2 bg-slate-50/20 -mx-3 -mb-3 px-3 pb-3 rounded-b-xl">
                        
                        {/* Transport Selector */}
                        <div className="flex items-center gap-1.5">
                          <span className="text-[9px] text-slate-400 font-sans uppercase font-semibold">Mode</span>
                          <select
                            value={wp.transitMode}
                            onChange={(e) => {
                              const mode = e.target.value as TransitMode;
                              const updated = [...waypoints];
                              updated[index] = {
                                ...wp,
                                transitMode: mode,
                                fare: getDefaultFare(mode)
                              };
                              onWaypointsChange(updated);
                            }}
                            className="text-xs font-sans font-medium text-slate-700 bg-white border border-slate-200/60 rounded-lg px-2 py-1 focus:ring-2 focus:ring-indigo-600 cursor-pointer h-7"
                            aria-label={`Travel mode for waypoint ${index + 1}`}
                          >
                            <option value="walk">Walk</option>
                            <option value="cycle">Cycle</option>
                            <option value="bus">Bus</option>
                            <option value="metro">Metro</option>
                          </select>
                        </div>

                        {/* Customize Fare Numeric Input field */}
                        <div className="flex items-center gap-1 bg-white border border-slate-200/60 px-2 py-0.5 rounded-lg shadow-2xs h-7">
                          <span className="text-[9px] uppercase font-bold text-slate-400 font-sans">Fare</span>
                          <span className="text-xs font-semibold text-slate-400 font-mono">$</span>
                          <input
                            type="number"
                            step="0.01"
                            min="0"
                            value={wp.fare !== undefined ? wp.fare : 0.00}
                            onChange={(e) => {
                              const newFare = parseFloat(e.target.value) || 0;
                              const updated = [...waypoints];
                              updated[index] = { ...wp, fare: newFare };
                              onWaypointsChange(updated);
                            }}
                            className="w-12 bg-transparent border-0 text-slate-700 font-mono font-semibold text-right focus:outline-hidden p-0 text-xs text-right focus:ring-2 focus:ring-indigo-600"
                            placeholder="0.00"
                            aria-label={`Custom fare for waypoint ${index + 1}`}
                          />
                        </div>

                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
