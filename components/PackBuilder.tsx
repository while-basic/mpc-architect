
import React, { useState, useEffect } from 'react';
import MPCGrid from './MPCGrid';
import { 
  Save, Trash2, Wand2, Download, 
  Settings2, Play, Square, FilePlus, Sparkles,
  ShieldCheck, Scissors, Repeat, Music, Activity, Cpu
} from 'lucide-react';
import { usePersistence, exportConfig } from '../hooks/usePersistence';
import { midiService } from '../services/midiService';
import { audioEngine } from '../services/audioEngine';
import { suggestPadLayout } from '../services/geminiService';
import { MidiProfile, PadAssignment } from '../types';

const INITIAL_PAD: PadAssignment = {
  samplePath: '',
  start: 0,
  end: 100,
  loop: false,
  tuneCoarse: 0,
  tuneFine: 0,
  muteGroup: 'None'
};

const PackBuilder: React.FC = () => {
  const [selectedPad, setSelectedPad] = useState<number | null>(null);
  const [midiFlashPad, setMidiFlashPad] = useState<number | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isSuggesting, setIsSuggesting] = useState(false);
  
  const [assignedSamples, setAssignedSamples] = usePersistence<Record<number, PadAssignment>>('mpc_architect_v2_samples', {
    1: { ...INITIAL_PAD, samplePath: 'Kick_808.wav' },
    5: { ...INITIAL_PAD, samplePath: 'Snare_Trap.wav' },
  });
  
  const [metadata, setMetadata] = usePersistence<any>('mpc_architect_meta', {
    name: 'New C-Cell Expansion',
    manufacturer: 'Celaya Solutions',
    category: 'Hip-Hop',
    description: 'Custom expansion built with MPC Architect...',
    macros: [
      { id: 1, label: 'Filter', cc: 74, value: 64 },
      { id: 2, label: 'Res', cc: 71, value: 32 },
    ]
  });

  const [activeProfileId] = usePersistence<string>('mpc_active_profile', 'default-mpc');
  const [profiles] = usePersistence<MidiProfile[]>('mpc_midi_profiles', []);
  
  const activeProfile = profiles.find(p => p.id === activeProfileId) || {
    id: 'default-mpc',
    name: 'MPC Hardware Default',
    channel: 0,
    padBaseNote: 36,
    macros: [],
    syncOut: true
  };

  const playPadSound = async (padId: number, velocity: number = 100) => {
    const assignment = assignedSamples[padId];
    if (assignment && assignment.samplePath) {
      try {
        // Simulation: In a real app, use the actual uploaded file Blob URL
        const dummyUrl = 'https://actions.google.com/sounds/v1/drums/beep_short.ogg';
        const buffer = await audioEngine.loadSample(dummyUrl, assignment.samplePath);
        audioEngine.playBuffer(buffer, velocity / 127);
      } catch (e) {
        console.error("Playback failed", e);
      }
    }
  };

  useEffect(() => {
    const cleanup = midiService.onMessage((status, data1, data2) => {
      const isNoteOn = (status & 0xF0) === (0x90 | activeProfile.channel) && data2 > 0;
      if (isNoteOn) {
        const padId = data1 - activeProfile.padBaseNote + 1;
        if (padId >= 1 && padId <= 16) {
          setMidiFlashPad(padId);
          playPadSound(padId, data2);
          setTimeout(() => setMidiFlashPad(null), 100);
        }
      }
    });
    return cleanup;
  }, [activeProfile, assignedSamples]);

  const handlePadSelect = (pad: number) => {
    setSelectedPad(pad);
    playPadSound(pad);
    midiService.sendNote(activeProfile.padBaseNote + pad - 1, 100, 200, activeProfile.channel);
  };

  const runSmartLayout = async () => {
    const samples = Object.values(assignedSamples).map(a => a.samplePath).filter(Boolean);
    if (samples.length === 0) return;
    
    setIsSuggesting(true);
    try {
      const layout = await suggestPadLayout(samples);
      const nextAssigned: Record<number, PadAssignment> = {};
      Object.entries(layout).forEach(([padNum, sampleName]) => {
        nextAssigned[parseInt(padNum)] = { ...INITIAL_PAD, samplePath: sampleName };
      });
      setAssignedSamples(nextAssigned);
    } catch (e) {
      console.error(e);
    } finally {
      setIsSuggesting(false);
    }
  };

  const updatePadMeta = (padId: number, updates: Partial<PadAssignment>) => {
    setAssignedSamples({
      ...assignedSamples,
      [padId]: { ...(assignedSamples[padId] || INITIAL_PAD), ...updates }
    });
  };

  const currentPadMeta = selectedPad ? assignedSamples[selectedPad] || INITIAL_PAD : null;

  return (
    <div className="p-8 grid grid-cols-1 xl:grid-cols-2 gap-8 h-full overflow-y-auto custom-scrollbar">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold">Program Editor</h2>
            <p className="text-zinc-500 text-sm">Targeting <span className="text-red-500 font-mono">{activeProfile.name}</span></p>
          </div>
          <div className="flex gap-2">
            <button 
              onClick={runSmartLayout}
              disabled={isSuggesting}
              className="bg-zinc-800 hover:bg-zinc-700 text-white px-4 py-2 rounded-lg text-xs font-bold flex items-center gap-2 border border-zinc-700 transition-all"
            >
              {isSuggesting ? <Cpu className="w-4 h-4 animate-spin" /> : <Wand2 className="w-4 h-4" />}
              SMART LAYOUT
            </button>
            <button className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg text-xs font-bold flex items-center gap-2 shadow-lg shadow-red-900/20">
              <Save className="w-4 h-4" />
              BUILD XPM
            </button>
          </div>
        </div>

        <div className="relative group">
          <MPCGrid 
            selectedPad={midiFlashPad || selectedPad} 
            onPadSelect={handlePadSelect} 
            assignedSamples={assignedSamples}
          />
          <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-zinc-950 border border-zinc-800 px-3 py-1 rounded-full flex items-center gap-2 text-[10px] font-bold text-zinc-500 uppercase tracking-widest">
            <Sparkles className="w-3 h-3 text-red-500" />
            MIDI Input Active
          </div>
        </div>

        <div className="bg-zinc-900/50 p-6 rounded-3xl border border-zinc-800 min-h-[300px]">
          {selectedPad && currentPadMeta ? (
            <div className="space-y-6">
              <div className="flex items-center justify-between bg-zinc-950 p-4 rounded-2xl border border-zinc-800">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-zinc-900 rounded-xl"><Music className="w-5 h-5 text-red-500" /></div>
                  <div>
                    <span className="block text-sm font-bold">{currentPadMeta.samplePath || 'Empty Pad'}</span>
                    <span className="block text-[10px] text-zinc-600 font-mono uppercase">Node ID: {selectedPad}</span>
                  </div>
                </div>
                <button onClick={() => {
                  const next = {...assignedSamples};
                  delete next[selectedPad];
                  setAssignedSamples(next);
                }} className="text-zinc-600 hover:text-red-500"><Trash2 className="w-4 h-4" /></button>
              </div>
              
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-4">
                   <div className="flex items-center gap-2"><Scissors className="w-3 h-3 text-zinc-500" /><span className="text-[10px] font-bold text-zinc-500 uppercase">Trim Protocol</span></div>
                   <input type="range" className="w-full accent-red-500" value={currentPadMeta.start} onChange={(e) => updatePadMeta(selectedPad, {start: parseInt(e.target.value)})} />
                   <input type="range" className="w-full accent-red-500" value={currentPadMeta.end} onChange={(e) => updatePadMeta(selectedPad, {end: parseInt(e.target.value)})} />
                </div>
                <div className="space-y-4">
                   <div className="flex items-center gap-2"><Activity className="w-3 h-3 text-zinc-500" /><span className="text-[10px] font-bold text-zinc-500 uppercase">Playback</span></div>
                   <button onClick={() => updatePadMeta(selectedPad, {loop: !currentPadMeta.loop})} className={`w-full p-2 rounded-xl border text-[10px] font-bold uppercase transition-all ${currentPadMeta.loop ? 'bg-red-600/10 border-red-500 text-red-500' : 'bg-zinc-950 border-zinc-800 text-zinc-600'}`}>
                     Loop: {currentPadMeta.loop ? 'ON' : 'OFF'}
                   </button>
                   <select className="w-full bg-zinc-950 border border-zinc-800 p-2 rounded-xl text-[10px] font-bold uppercase text-zinc-400" value={currentPadMeta.muteGroup} onChange={(e) => updatePadMeta(selectedPad, {muteGroup: e.target.value})}>
                      <option>Mute: None</option>
                      <option>Group A</option>
                      <option>Group B</option>
                   </select>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-20 opacity-20"><Activity className="w-12 h-12 mb-4" /><p className="text-xs uppercase font-bold">Select Pad to Edit Node</p></div>
          )}
        </div>
      </div>

      <div className="space-y-6">
        <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-8 shadow-2xl space-y-6">
           <h3 className="text-lg font-bold flex items-center gap-2"><Settings2 className="w-5 h-5 text-red-600" />Expansion Meta</h3>
           <div className="space-y-4">
              <input type="text" placeholder="Pack Name" className="w-full bg-zinc-950 border border-zinc-800 p-4 rounded-2xl focus:border-red-500 outline-none" value={metadata.name} onChange={(e) => setMetadata({...metadata, name: e.target.value})} />
              <textarea placeholder="Description" rows={4} className="w-full bg-zinc-950 border border-zinc-800 p-4 rounded-2xl focus:border-red-500 outline-none resize-none" value={metadata.description} onChange={(e) => setMetadata({...metadata, description: e.target.value})} />
              <div className="grid grid-cols-2 gap-4">
                 <input type="text" placeholder="Manufacturer" className="bg-zinc-950 border border-zinc-800 p-4 rounded-2xl outline-none" value={metadata.manufacturer} onChange={(e) => setMetadata({...metadata, manufacturer: e.target.value})} />
                 <input type="text" placeholder="Genre" className="bg-zinc-950 border border-zinc-800 p-4 rounded-2xl outline-none" value={metadata.category} onChange={(e) => setMetadata({...metadata, category: e.target.value})} />
              </div>
           </div>
        </div>
        
        <div className="grid grid-cols-4 gap-4">
           {metadata.macros.map((m: any) => (
             <div key={m.id} className="bg-zinc-900/30 p-4 rounded-2xl border border-zinc-800 flex flex-col items-center gap-2">
                <span className="text-[9px] font-bold text-zinc-500 uppercase">{m.label}</span>
                <div className="h-1 w-full bg-zinc-800 rounded-full overflow-hidden">
                   <div className="h-full bg-red-600" style={{width: `${(m.value/127)*100}%`}} />
                </div>
                <span className="text-[10px] font-mono text-zinc-300">{m.value}</span>
             </div>
           ))}
        </div>
      </div>
    </div>
  );
};

export default PackBuilder;
