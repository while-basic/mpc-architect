
import React, { useEffect, useState } from 'react';
import { midiService } from '../services/midiService';
import { usePersistence } from '../hooks/usePersistence';
import { MidiProfile } from '../types';
import { 
  Save, Download, Upload, ShieldCheck, RefreshCcw, 
  Sliders, Plus, Trash2, Check, Layout, Keyboard
} from 'lucide-react';

const ExportSettings: React.FC = () => {
  const [inputs, setInputs] = useState<MIDIInput[]>([]);
  const [outputs, setOutputs] = useState<MIDIOutput[]>([]);
  
  const [profiles, setProfiles] = usePersistence<MidiProfile[]>('mpc_midi_profiles', [
    {
      id: 'default-mpc',
      name: 'MPC Hardware Default',
      channel: 0,
      padBaseNote: 36,
      syncOut: true,
      macros: [
        { id: 1, label: 'Filter', cc: 74 },
        { id: 2, label: 'Res', cc: 71 },
        { id: 3, label: 'Attack', cc: 73 },
        { id: 4, label: 'Decay', cc: 72 },
      ]
    }
  ]);
  
  const [activeProfileId, setActiveProfileId] = usePersistence<string>('mpc_active_profile', 'default-mpc');

  const refreshDevices = () => {
    setInputs([...midiService.inputs]);
    setOutputs([...midiService.outputs]);
  };

  useEffect(() => {
    refreshDevices();
    const active = profiles.find(p => p.id === activeProfileId);
    if (active) {
      midiService.defaultChannel = active.channel;
    }
  }, [activeProfileId, profiles]);

  const createProfile = () => {
    const newProfile: MidiProfile = {
      id: Date.now().toString(),
      name: 'New Custom Device',
      channel: 0,
      padBaseNote: 36,
      syncOut: false,
      macros: [
        { id: 1, label: 'Macro 1', cc: 1 },
        { id: 2, label: 'Macro 2', cc: 2 },
        { id: 3, label: 'Macro 3', cc: 3 },
        { id: 4, label: 'Macro 4', cc: 4 },
      ]
    };
    setProfiles([...profiles, newProfile]);
    setActiveProfileId(newProfile.id);
  };

  const deleteProfile = (id: string) => {
    if (profiles.length <= 1) return;
    const nextProfiles = profiles.filter(p => p.id !== id);
    setProfiles(nextProfiles);
    if (activeProfileId === id) {
      setActiveProfileId(nextProfiles[0].id);
    }
  };

  const updateProfile = (id: string, updates: Partial<MidiProfile>) => {
    setProfiles(profiles.map(p => p.id === id ? { ...p, ...updates } : p));
  };

  const activeProfile = profiles.find(p => p.id === activeProfileId) || profiles[0];

  return (
    <div className="p-8 max-w-6xl mx-auto space-y-8 animate-in fade-in duration-500 custom-scrollbar overflow-y-auto h-full pb-20">
      <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">System Architect</h2>
          <p className="text-zinc-400 text-sm mt-1">Manage hardware profiles and MIDI cross-talk protocols</p>
        </div>
        <button 
          onClick={createProfile}
          className="flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 rounded-lg text-sm font-bold shadow-lg shadow-red-900/40 transition-all"
        >
          <Plus className="w-4 h-4" />
          New Profile
        </button>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Profile Sidebar */}
        <div className="lg:col-span-1 space-y-4">
          <h3 className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 mb-2">Hardware Mappings</h3>
          <div className="space-y-2">
            {profiles.map(profile => (
              <button
                key={profile.id}
                onClick={() => setActiveProfileId(profile.id)}
                className={`w-full flex items-center justify-between p-3 rounded-xl border transition-all text-left ${
                  activeProfileId === profile.id 
                  ? 'bg-zinc-900 border-red-500 shadow-lg shadow-red-900/10' 
                  : 'bg-zinc-950/30 border-zinc-800 hover:border-zinc-700'
                }`}
              >
                <div className="flex flex-col">
                  <span className={`text-sm font-bold ${activeProfileId === profile.id ? 'text-zinc-100' : 'text-zinc-400'}`}>
                    {profile.name}
                  </span>
                  <span className="text-[10px] text-zinc-500">Channel {profile.channel + 1}</span>
                </div>
                {activeProfileId === profile.id && <Check className="w-4 h-4 text-red-500" />}
              </button>
            ))}
          </div>
        </div>

        {/* Profile Detail */}
        <div className="lg:col-span-3 space-y-6">
          <div className="bg-zinc-900/50 border border-zinc-800 rounded-3xl p-8 space-y-8 shadow-sm">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold flex items-center gap-2">
                <Sliders className="w-5 h-5 text-red-500" />
                Profile Configuration
              </h3>
              <button 
                onClick={() => deleteProfile(activeProfile.id)}
                className="p-2 text-zinc-600 hover:text-red-500 transition-colors"
                title="Delete Profile"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-zinc-500 uppercase">Device Name</label>
                  <input 
                    type="text" 
                    value={activeProfile.name}
                    onChange={(e) => updateProfile(activeProfile.id, { name: e.target.value })}
                    className="w-full bg-zinc-950 border border-zinc-800 p-3 rounded-xl text-sm focus:outline-none focus:border-red-500"
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-zinc-500 uppercase">Global Channel</label>
                    <select 
                      value={activeProfile.channel}
                      onChange={(e) => updateProfile(activeProfile.id, { channel: parseInt(e.target.value) })}
                      className="w-full bg-zinc-950 border border-zinc-800 p-3 rounded-xl text-sm focus:outline-none focus:border-red-500"
                    >
                      {Array.from({length: 16}).map((_, i) => (
                        <option key={i} value={i}>Channel {i + 1}</option>
                      ))}
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-zinc-500 uppercase">Pad Base Note</label>
                    <div className="flex gap-2">
                      <input 
                        type="number" 
                        value={activeProfile.padBaseNote}
                        onChange={(e) => updateProfile(activeProfile.id, { padBaseNote: parseInt(e.target.value) })}
                        className="w-full bg-zinc-950 border border-zinc-800 p-3 rounded-xl text-sm font-mono focus:outline-none focus:border-red-500"
                      />
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between p-4 bg-zinc-950/50 rounded-2xl border border-zinc-800">
                  <div className="flex items-center gap-3">
                    <RefreshCcw className="w-4 h-4 text-zinc-500" />
                    <div>
                      <span className="block text-sm font-bold">Transmit Sync</span>
                      <span className="block text-[10px] text-zinc-500">Send start/stop transport messages</span>
                    </div>
                  </div>
                  <input 
                    type="checkbox" 
                    checked={activeProfile.syncOut}
                    onChange={(e) => updateProfile(activeProfile.id, { syncOut: e.target.checked })}
                    className="w-5 h-5 rounded border-zinc-700 bg-zinc-950 text-red-600 focus:ring-red-600"
                  />
                </div>
              </div>

              <div className="space-y-4">
                <label className="text-[10px] font-bold text-zinc-500 uppercase flex items-center gap-2">
                  <Keyboard className="w-3 h-3" />
                  Macro CC Mappings
                </label>
                <div className="space-y-2">
                  {activeProfile.macros.map((macro, idx) => (
                    <div key={macro.id} className="flex items-center gap-2 group">
                      <input 
                        type="text" 
                        value={macro.label}
                        onChange={(e) => {
                          const next = [...activeProfile.macros];
                          next[idx].label = e.target.value;
                          updateProfile(activeProfile.id, { macros: next });
                        }}
                        className="flex-1 bg-zinc-950 border border-zinc-800 p-2 rounded-lg text-xs focus:outline-none focus:border-zinc-600"
                        placeholder="Label"
                      />
                      <div className="flex items-center bg-zinc-950 border border-zinc-800 rounded-lg px-2 w-24">
                        <span className="text-[10px] text-zinc-600 mr-1 font-mono">CC</span>
                        <input 
                          type="number" 
                          value={macro.cc}
                          onChange={(e) => {
                            const next = [...activeProfile.macros];
                            next[idx].cc = parseInt(e.target.value) || 0;
                            updateProfile(activeProfile.id, { macros: next });
                          }}
                          className="bg-transparent w-full p-2 text-xs font-mono focus:outline-none"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <section className="bg-zinc-900/30 border border-zinc-800 rounded-2xl p-6 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-bold uppercase tracking-widest text-zinc-500">Hardware I/O</h3>
                <button onClick={refreshDevices} className="text-zinc-600 hover:text-white transition-colors">
                  <RefreshCcw className="w-3 h-3" />
                </button>
              </div>
              <div className="space-y-1">
                {inputs.map(i => (
                  <div key={i.id} className="text-[10px] flex items-center justify-between p-2 bg-zinc-950/50 rounded border border-zinc-800">
                    <span className="text-zinc-400 font-mono truncate max-w-[150px]">{i.name}</span>
                    <span className="text-green-500 font-bold uppercase tracking-tighter">In</span>
                  </div>
                ))}
                {outputs.map(o => (
                  <div key={o.id} className="text-[10px] flex items-center justify-between p-2 bg-zinc-950/50 rounded border border-zinc-800">
                    <span className="text-zinc-400 font-mono truncate max-w-[150px]">{o.name}</span>
                    <span className="text-red-500 font-bold uppercase tracking-tighter">Out</span>
                  </div>
                ))}
              </div>
            </section>

            <section className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 flex flex-col justify-center gap-4 shadow-xl">
               <div className="flex items-center gap-4">
                  <div className="p-2 bg-zinc-800 rounded-lg">
                    <Download className="w-4 h-4 text-zinc-400" />
                  </div>
                  <div className="flex-1">
                    <span className="block text-sm font-bold leading-tight">Sync Configuration</span>
                    <span className="block text-[10px] text-zinc-500">Persist profiles across devices</span>
                  </div>
                  <button className="px-3 py-1.5 bg-zinc-800 hover:bg-zinc-700 rounded-lg text-xs font-bold border border-zinc-700 transition-colors">
                    Export
                  </button>
               </div>
               <div className="flex items-center gap-4">
                  <div className="p-2 bg-zinc-800 rounded-lg">
                    <Layout className="w-4 h-4 text-zinc-400" />
                  </div>
                  <div className="flex-1">
                    <span className="block text-sm font-bold leading-tight">Global Resilience</span>
                    <span className="block text-[10px] text-zinc-500">Shield state from cache clear</span>
                  </div>
                  <div className="w-4 h-4 rounded-full bg-green-500/20 flex items-center justify-center">
                    <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                  </div>
               </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExportSettings;
