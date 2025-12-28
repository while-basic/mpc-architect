
import React from 'react';
import { LayoutDashboard, Package, Boxes, Settings, Terminal, Activity, AudioWaveform } from 'lucide-react';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

// Fix: Correctly apply SidebarProps to React.FC generic to enable proper prop validation in parent components.
const Sidebar: React.FC<SidebarProps> = ({ activeTab, setActiveTab }) => {
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'builder', label: 'Pack Builder', icon: Package },
    { id: 'classifier', label: 'AI Classifier', icon: Terminal },
    { id: 'analysis', label: 'Audio Analysis', icon: AudioWaveform },
    { id: 'statistics', label: 'Library Analytics', icon: Activity },
    { id: 'settings', label: 'Export Config', icon: Settings },
  ];

  return (
    <div className="w-64 border-r border-zinc-800 bg-zinc-950 flex flex-col h-full overflow-y-auto">
      <div className="p-6 border-b border-zinc-800">
        <h1 className="text-xl font-bold text-red-600 flex items-center gap-2">
          <Boxes className="w-6 h-6" />
          MPC ARCHITECT
        </h1>
        <p className="text-xs text-zinc-500 mt-1 uppercase tracking-widest">C-Cell SSD Protocol</p>
      </div>
      <nav className="flex-1 p-4 space-y-2">
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${
              activeTab === item.id 
                ? 'bg-red-600 text-white shadow-lg shadow-red-900/20' 
                : 'text-zinc-400 hover:bg-zinc-900 hover:text-zinc-100'
            }`}
          >
            <item.icon className="w-5 h-5" />
            <span className="font-medium">{item.label}</span>
          </button>
        ))}
      </nav>
      <div className="p-4 border-t border-zinc-800 bg-zinc-900/50">
        <div className="flex items-center gap-3">
          <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
          <span className="text-xs text-zinc-400 font-mono italic">CLOS v1.0 Connected</span>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
