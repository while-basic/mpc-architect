
export enum MPCCategory {
  DRUM_ONESHOT = 'DRUM_ONESHOT',
  MELODIC_ONESHOT = 'MELODIC_ONESHOT',
  LOOP = 'LOOP',
  MULTISAMPLE = 'MULTISAMPLE',
  FX = 'FX',
  UNCATEGORIZED = 'UNCATEGORIZED'
}

export interface SampleFile {
  id: string;
  name: string;
  path: string;
  category: MPCCategory;
  size: number;
}

export interface PadAssignment {
  samplePath: string;
  start: number;
  end: number;
  loop: boolean;
  tuneCoarse: number;
  tuneFine: number;
  muteGroup: string;
}

export interface MPCProgram {
  name: string;
  type: 'Drum' | 'Keygroup' | 'Plugin' | 'Midi' | 'CV';
  pads: Record<number, string>; // Pad index 1-16 -> Sample ID
}

export interface ExpansionMetadata {
  name: string;
  manufacturer: string;
  version: string;
  identifier: string;
  description: string;
  category: string;
  tags: string[];
}

export interface MidiMacroMapping {
  id: number;
  label: string;
  cc: number;
}

export interface MidiProfile {
  id: string;
  name: string;
  channel: number;
  padBaseNote: number;
  macros: MidiMacroMapping[];
  syncOut: boolean;
}
