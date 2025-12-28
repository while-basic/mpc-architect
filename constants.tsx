
import React from 'react';

export const COLORS = {
  MPC_RED: '#E11D48',
  MPC_BLACK: '#09090B',
  MPC_GREY: '#18181B',
  MPC_TEXT: '#F4F4F5'
};

export const PAD_LAYOUT = [
  [13, 14, 15, 16],
  [9, 10, 11, 12],
  [5, 6, 7, 8],
  [1, 2, 3, 4]
];

export const PAD_LABELS: Record<number, string> = {
  1: 'Kick', 2: 'Sub', 3: 'Tom L', 4: 'Tom H',
  5: 'Snare', 6: 'Rim', 7: 'Clap', 8: 'Perc',
  9: 'OH', 10: 'CH', 11: 'Crash', 12: 'Ride',
  13: 'Shk', 14: 'Clap 2', 15: 'Snap', 16: 'FX'
};
