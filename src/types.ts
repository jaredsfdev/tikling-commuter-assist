/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type TransitMode = 'walk' | 'bus' | 'metro' | 'cycle';

export interface Waypoint {
  id: string;
  name: string;
  lat: number;
  lng: number;
  transitMode?: TransitMode;
  fare?: number;
}

export interface CommuterRoute {
  id: string;
  title: string;
  creator: string;
  avatarUrl?: string;
  transitMode: TransitMode;
  durationMinutes: number;
  distanceKm: number;
  tags: string[];
  likes: number;
  isSaved?: boolean;
}

export type AppStateMode = 'loading' | 'empty' | 'offline' | 'error' | 'hasData';

export type TabType = 'home' | 'routes' | 'community' | 'profile' | 'donation';

export interface MascotDialogue {
  id: string;
  text: string;
  mood: 'happy' | 'helpful' | 'alert' | 'worried' | 'cheering';
  trigger: 'launch' | 'guide' | 'error' | 'suggestion' | 'onboarding' | 'offline';
}
