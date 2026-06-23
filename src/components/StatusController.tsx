/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Settings, ShieldAlert, Cpu, WifiOff, Cloud, Database } from 'lucide-react';
import { AppStateMode } from '../types';

interface StatusControllerProps {
  appState: AppStateMode;
  onAppStateChange: (state: AppStateMode) => void;
  isLowData: boolean;
  onLowDataChange: (enabled: boolean) => void;
  isOffline: boolean;
  onOfflineChange: (enabled: boolean) => void;
}

export default function StatusController({
  appState,
  onAppStateChange,
  isLowData,
  onLowDataChange,
  isOffline,
  onOfflineChange,
}: StatusControllerProps) {
  return (
    <div className="bg-slate-900 text-slate-100 rounded-3xl p-5 border border-slate-800 shadow-xl">
      <div className="flex items-center gap-2 mb-4 border-b border-slate-800 pb-3">
        <Cpu className="text-indigo-400 shrink-0" size={18} />
        <div>
          <h4 className="font-sans font-semibold text-sm">PIO Compliance Sandbox</h4>
          <p className="text-[10px] text-slate-400 font-mono">Test Mandatory App States & Low-Data Rules</p>
        </div>
      </div>

      <div className="flex flex-col gap-4">
        {/* Core States switcher */}
        <div>
          <label className="text-[10px] font-mono uppercase tracking-wider text-slate-400 block mb-2">
            MANDATORY STATE SWITCHER
          </label>
          <div className="grid grid-cols-5 gap-1 p-1 bg-slate-950 rounded-xl">
            {(['hasData', 'loading', 'empty', 'offline', 'error'] as AppStateMode[]).map((state) => {
              const isActive = appState === state;
              // Coloring tags
              const colorClass = 
                state === 'hasData' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' :
                state === 'loading' ? 'bg-sky-500/20 text-sky-400 border border-sky-500/30' :
                state === 'empty' ? 'bg-purple-500/20 text-purple-400 border border-purple-500/30' :
                state === 'offline' ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30' :
                'bg-rose-500/20 text-rose-400 border border-rose-500/30';

              return (
                <button
                  key={state}
                  onClick={() => {
                    onAppStateChange(state);
                    if (state === 'offline') {
                      onOfflineChange(true);
                    } else {
                      onOfflineChange(false);
                    }
                  }}
                  className={`py-2 px-1 text-[10px] font-sans font-bold capitalize rounded-lg transition-all text-center cursor-pointer ${
                    isActive 
                      ? `${colorClass} scale-[1.03] shadow-md` 
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/50'
                  }`}
                >
                  {state === 'hasData' ? 'Normal' : state}
                </button>
              );
            })}
          </div>
        </div>

        {/* Global Toggles */}
        <div className="grid grid-cols-2 gap-3 pt-1">
          {/* Low Data Switcher toggle */}
          <div className="flex flex-col gap-1">
            <span className="text-[9px] font-mono text-slate-400 uppercase">Low Data Engine</span>
            <button
              onClick={() => onLowDataChange(!isLowData)}
              className={`py-2.5 px-3 rounded-xl border font-sans text-xs font-semibold flex items-center justify-between transition-all cursor-pointer ${
                isLowData
                  ? 'bg-indigo-500/10 border-indigo-500/40 text-indigo-300'
                  : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200'
              }`}
            >
              <span className="truncate">Low Data Mode</span>
              <span className={`w-2 h-2 rounded-full ${isLowData ? 'bg-indigo-400 active-pulse' : 'bg-slate-700'}`} />
            </button>
          </div>

          {/* Network Connection Toggle */}
          <div className="flex flex-col gap-1">
            <span className="text-[9px] font-mono text-slate-400 uppercase">Network State</span>
            <button
              onClick={() => {
                const next = !isOffline;
                onOfflineChange(next);
                if (next) {
                  onAppStateChange('offline');
                } else {
                  onAppStateChange('hasData');
                }
              }}
              className={`py-2.5 px-3 rounded-xl border font-sans text-xs font-semibold flex items-center justify-between transition-all cursor-pointer ${
                isOffline
                  ? 'bg-amber-500/10 border-amber-500/40 text-amber-300'
                  : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200'
              }`}
            >
              <span>{isOffline ? 'Offline' : 'Connected'}</span>
              <span>{isOffline ? <WifiOff size={11} /> : <Cloud size={11} />}</span>
            </button>
          </div>
        </div>

        {/* Informational Guidelines Footer within Sandbox */}
        <div className="bg-slate-950/80 p-2.5 rounded-xl border border-slate-800 text-[10px] text-slate-400 leading-snug">
          <p className="font-sans">
            💡 <strong className="text-slate-200">State Behaviors:</strong>
          </p>
          <ul className="list-disc pl-3.5 mt-1 space-y-0.5 font-sans">
            <li><strong className="text-sky-400">Loading:</strong> Entire list replaces cards with dynamic skeleton pulses.</li>
            <li><strong className="text-purple-400">Empty:</strong> Clean states; prompts onboarding route creator block.</li>
            <li><strong className="text-amber-400">Low Data Mode:</strong> Turns off mascot animations and utilizes simplified vector path maps.</li>
            <li><strong className="text-rose-400">Error:</strong> Presents a non-blocking recovery drawer & alternate suggestions from PIO.</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
