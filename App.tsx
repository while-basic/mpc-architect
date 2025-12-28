
import React, { useState } from 'react';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import PackBuilder from './components/PackBuilder';
import AIClassifier from './components/AIClassifier';
import ExportSettings from './components/ExportSettings';
import LibraryAnalytics from './components/LibraryAnalytics';
import AudioAnalysis from './components/AudioAnalysis';
import MidiMonitor from './components/MidiMonitor';
import { Menu, X, Bell, Search } from 'lucide-react';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard />;
      case 'builder':
        return <PackBuilder />;
      case 'classifier':
        return <AIClassifier />;
      case 'analysis':
        return <AudioAnalysis />;
      case 'statistics':
        return <LibraryAnalytics />;
      case 'settings':
        return <ExportSettings />;
      default:
        return <div className="p-8">Section under development (Phase 2)</div>;
    }
  };

  return (
    <div className="flex h-screen bg-zinc-950 text-zinc-100 font-sans selection:bg-red-500/30">
      {isSidebarOpen && (
        <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      )}
      
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <header className="h-16 border-b border-zinc-800 flex items-center justify-between px-6 bg-zinc-950/80 backdrop-blur-xl z-10 shrink-0">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="p-2 hover:bg-zinc-900 rounded-lg transition-colors text-zinc-400"
            >
              {isSidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
            <div className="relative hidden md:block">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" />
              <input 
                type="text" 
                placeholder="Search C-Cell Library..." 
                className="bg-zinc-900 border border-zinc-800 rounded-full pl-10 pr-4 py-1.5 text-sm w-64 focus:outline-none focus:border-red-500/50 transition-all"
              />
            </div>
          </div>

          <div className="flex items-center gap-4 sm:gap-6">
             <MidiMonitor />
             <div className="hidden xs:flex items-center gap-1 bg-zinc-900 px-3 py-1 rounded-full border border-zinc-800">
                <div className="w-2 h-2 rounded-full bg-red-500 shadow-[0_0_8px_#ef4444]" />
                <span className="text-[10px] font-bold tracking-tighter text-zinc-300">MPC KEY 37 LINKED</span>
             </div>
             <button className="relative p-2 text-zinc-400 hover:text-zinc-100">
               <Bell className="w-5 h-5" />
               <span className="absolute top-1 right-1 w-2 h-2 bg-red-600 rounded-full border-2 border-zinc-950" />
             </button>
             <div className="flex items-center gap-3 pl-4 border-l border-zinc-800">
                <div className="text-right hidden sm:block">
                  <p className="text-xs font-bold">Admin Architect</p>
                  <p className="text-[10px] text-zinc-500 uppercase">Pro Tier</p>
                </div>
                <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-red-600 to-rose-400 flex items-center justify-center font-bold text-xs">
                  CS
                </div>
             </div>
          </div>
        </header>

        <section className="flex-1 overflow-hidden relative bg-zinc-950">
          {renderContent()}
        </section>
      </main>

      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #27272a;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #3f3f46;
        }
        @media (max-width: 400px) {
          .xs\:hidden { display: none; }
          .xs\:flex { display: flex; }
        }
      `}</style>
    </div>
  );
};

export default App;
