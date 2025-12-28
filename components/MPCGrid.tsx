
import React from 'react';
import { PAD_LAYOUT, PAD_LABELS } from '../constants';
import { PadAssignment } from '../types';

interface MPCGridProps {
  selectedPad: number | null;
  onPadSelect: (pad: number) => void;
  assignedSamples: Record<number, PadAssignment>;
}

const MPCGrid: React.FC<MPCGridProps> = ({ selectedPad, onPadSelect, assignedSamples }) => {
  return (
    <div className="grid grid-cols-4 gap-4 p-6 bg-zinc-900 rounded-xl border border-zinc-800 shadow-2xl">
      {PAD_LAYOUT.flat().map((padId) => {
        const assignment = assignedSamples[padId];
        const isAssigned = !!assignment?.samplePath;
        
        return (
          <button
            key={padId}
            onClick={() => onPadSelect(padId)}
            className={`aspect-square rounded-md relative flex flex-col items-center justify-center transition-all duration-75 border-b-4 active:border-b-0 active:translate-y-1 ${
              selectedPad === padId
                ? 'bg-red-600 border-red-800 text-white'
                : isAssigned
                ? 'bg-zinc-700 border-zinc-800 text-zinc-200'
                : 'bg-zinc-800 border-zinc-950 text-zinc-500'
            }`}
          >
            <span className="absolute top-2 left-2 text-[10px] font-bold opacity-40">{padId}</span>
            <span className="text-[10px] font-bold truncate max-w-[85%] uppercase px-1">
              {isAssigned ? assignment.samplePath.split('/').pop() : PAD_LABELS[padId]}
            </span>
            <div className={`mt-1 w-1 h-1 rounded-full ${isAssigned ? 'bg-red-400 shadow-[0_0_8px_red]' : 'bg-transparent'}`} />
          </button>
        );
      })}
    </div>
  );
};

export default MPCGrid;
