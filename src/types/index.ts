export interface GearSetup {
  id: string;
  userId: string;
  name: string;
  guitar: string;
  amp: string;
  pedals: PedalEntry[];
  signalChain: string;
  toneDescription: string;
  genre: string;
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
}

export interface PedalEntry {
  id: string;
  name: string;
  brand: string;
  type: PedalType;
  settings?: string;
}

export type PedalType =
  | 'overdrive'
  | 'distortion'
  | 'fuzz'
  | 'delay'
  | 'reverb'
  | 'chorus'
  | 'flanger'
  | 'phaser'
  | 'compressor'
  | 'eq'
  | 'noise_gate'
  | 'wah'
  | 'boost'
  | 'other';

export interface UserProfile {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
}

export interface ComparisonSlot {
  slotId: 'A' | 'B';
  setup: GearSetup | null;
}

export type SortField = 'name' | 'genre' | 'createdAt' | 'updatedAt';
export type SortDirection = 'asc' | 'desc';

export interface FilterState {
  search: string;
  genre: string;
  tags: string[];
  sortField: SortField;
  sortDirection: SortDirection;
}
