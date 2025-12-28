
import React, { useEffect, useState } from 'react';
import { midiService } from '../services/midiService';
import { Radio } from 'lucide-react';

const MidiMonitor: React.FC = () => {
  const [isActive, setIsActive] = useState(false);
  const [hasAccess, setHasAccess] = useState(false);

  useEffect(() => {
    midiService.initialize().then(success => setHasAccess(success));
    
    const cleanup = midiService.onMessage(() => {
      setIsActive(true);
      setTimeout(() => setIsActive(false), 100);
    });

    return cleanup;
  }, []);

  if (!hasAccess) return null;

  return (
    <div className="flex items-center gap-2 bg-zinc-900 px-3 py-1 rounded-full border border-zinc-800">
      <Radio className={`w-3 h-3 ${isActive ? 'text-red-500 scale-125' : 'text-zinc-600'} transition-all duration-75`} />
      <span className="text-[10px] font-bold tracking-tighter text-zinc-300">MIDI ACTIVE</span>
    </div>
  );
};

export default MidiMonitor;
