/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Bookmark, Heart, Star, Compass, Ship, Eye, MapPin, Bike, Bus, Train, Footprints } from 'lucide-react';
import { CommuterRoute, TransitMode } from '../types';

interface RouteCardProps {
  key?: string | number;
  route?: CommuterRoute;
  isLoading?: boolean;
  onToggleSave?: (id: string) => void;
  onSelectRoute?: (route: CommuterRoute) => void;
}

export default function RouteCard({
  route,
  isLoading = false,
  onToggleSave,
  onSelectRoute,
}: RouteCardProps) {
  // 1. loading -> Skeleton state only (No generic spinners)
  if (isLoading || !route) {
    return (
      <div className="bg-white border border-slate-100 rounded-3xl p-5 flex items-start gap-4 animate-pulse">
        {/* Circle Icon Skeleton */}
        <div className="w-12 h-12 bg-slate-200 rounded-full shrink-0" />

        {/* Content Lines Skeleton */}
        <div className="flex-1 min-w-0 flex flex-col gap-2.5">
          <div className="h-4 bg-slate-200 rounded-md w-3/4" />
          <div className="h-3 bg-slate-100 rounded-md w-1/3" />

          {/* Tag Row Skeleton */}
          <div className="flex gap-2 mt-2">
            <div className="h-6 bg-slate-100 rounded-lg w-12" />
            <div className="h-6 bg-slate-100 rounded-lg w-16" />
            <div className="h-6 bg-slate-100 rounded-lg w-16" />
          </div>
        </div>

        {/* Action button skeleton */}
        <div className="w-8 h-8 bg-slate-100 rounded-full shrink-0" />
      </div>
    );
  }

  // Get Styling Configuration per Transport Type
  const getModeStyles = (mode: TransitMode) => {
    switch (mode) {
      case 'bus':
        return {
          bg: 'bg-indigo-50 border-indigo-100 text-indigo-500',
          iconColor: 'text-indigo-600',
          indicator: <Bus size={20} className="text-indigo-600" />,
        };
      case 'metro':
        return {
          bg: 'bg-rose-50 border-rose-100 text-rose-500',
          iconColor: 'text-rose-600',
          indicator: <Train size={20} className="text-rose-600" />,
        };
      case 'cycle':
        return {
          bg: 'bg-amber-50 border-amber-100 text-amber-500',
          iconColor: 'text-amber-600',
          indicator: <Bike size={20} className="text-amber-600" />,
        };
      case 'walk':
      default:
        return {
          bg: 'bg-emerald-50 border-emerald-100 text-emerald-500',
          iconColor: 'text-emerald-600',
          indicator: <Footprints size={20} className="text-emerald-600" />,
        };
    }
  };

  const styleSet = getModeStyles(route.transitMode);

  return (
    <div className="bg-white hover:bg-slate-50/50 border border-slate-100 rounded-3xl p-5 flex items-start gap-4 transition-all duration-300 hover:shadow-xs group relative">
      {/* Circle Icon Indicator representing travel mode */}
      <div className={`w-12 h-12 rounded-full flex items-center justify-center text-lg shrink-0 shadow-xs border ${styleSet.bg}`}>
        {styleSet.indicator}
      </div>

      {/* Main Text Content */}
      <div className="flex-1 min-w-0">
        <h4 className="font-sans font-semibold text-slate-900 text-base leading-snug group-hover:text-indigo-600 transition-colors">
          {route.title}
        </h4>
        <p className="text-xs text-slate-400 font-sans mt-0.5">
          {route.creator === 'Your Custom Route' ? (
            <span className="text-indigo-600 font-semibold uppercase font-mono tracking-wider text-[10px]">
              My Custom Route • Saved
            </span>
          ) : (
            `Commute Hub • shared by ${route.creator}`
          )}
        </p>

        {/* Details and Custom Tag Badges Row */}
        <div className="flex flex-wrap items-center gap-1.5 mt-2.5">
          <span className="text-[10px] bg-indigo-50/50 border border-indigo-100 text-indigo-600 px-2 py-0.5 rounded-lg capitalize font-sans font-medium flex items-center gap-1">
            <span>{styleSet.indicator}</span> {route.transitMode}
          </span>
          <span className="text-[10px] bg-slate-50 border border-slate-100 text-slate-600 px-2 py-0.5 rounded-lg font-mono flex items-center gap-1">
            ⏱️ {route.durationMinutes} min
          </span>
          <span className="text-[10px] bg-slate-50 border border-slate-100 text-slate-600 px-2 py-0.5 rounded-lg font-mono flex items-center gap-1">
            📏 {route.distanceKm} km
          </span>

          {/* Specialized Accent Tag (Scenic, Low Traffic, Fastest, Eco) */}
          {route.tags.map((tag) => (
            <span
              key={tag}
              className={`text-[9px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider font-sans border ${
                tag === 'Scenic' || tag === 'Fastest'
                  ? 'bg-emerald-50 border-emerald-100 text-emerald-600'
                  : 'bg-indigo-50 border-indigo-100 text-indigo-600'
              }`}
            >
              {tag}
            </span>
          ))}
        </div>
      </div>

      {/* Action triggers: Bookmark, Select, and Like counts */}
      <div className="flex flex-col items-end gap-3 shrink-0">
        <button
          onClick={(e) => {
            e.stopPropagation();
            if (onToggleSave) onToggleSave(route.id);
          }}
          className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors border cursor-pointer ${
            route.isSaved
              ? 'bg-indigo-50 border-indigo-100 text-indigo-600'
              : 'bg-slate-50 border-slate-100 text-slate-400 hover:text-slate-600'
          }`}
          title={route.isSaved ? "Saved" : "Save Route"}
        >
          <Bookmark size={14} fill={route.isSaved ? "currentColor" : "none"} />
        </button>

        <div className="flex items-center gap-1 text-slate-400 select-none">
          <Heart size={13} className="text-rose-400 fill-rose-100" />
          <span className="text-[10px] font-mono">{route.likes}</span>
        </div>

        {onSelectRoute && (
          <button
            onClick={() => onSelectRoute(route)}
            className="text-[10px] font-bold text-indigo-600 hover:text-indigo-700 font-sans uppercase flex items-center gap-0.5 cursor-pointer hover:underline"
          >
            Load Map <MapPin size={9} />
          </button>
        )}
      </div>
    </div>
  );
}
