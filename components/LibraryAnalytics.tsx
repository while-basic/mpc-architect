
import React, { useState, useMemo } from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  LineChart, Line, AreaChart, Area, PieChart, Pie, Cell 
} from 'recharts';
import { 
  Activity, Zap, BarChart3, PieChart as PieIcon, 
  TrendingUp, Search, Filter, Cpu, Database, HardDrive,
  Info, AlertCircle
} from 'lucide-react';

const CATEGORY_STATS = [
  { name: 'Drum One-shots', value: 61799, color: '#E11D48' },
  { name: 'Melodic One-shots', value: 45000, color: '#A855F7' },
  { name: 'Loops', value: 35000, color: '#3B82F6' },
  { name: 'Multisamples', value: 10000, color: '#10B981' },
  { name: 'FX/Atmospheres', value: 20000, color: '#F59E0B' },
  { name: 'Uncategorized', value: 938, color: '#52525b' },
];

const STORAGE_TIMELINE = [
  { month: 'Jan', size: 450 },
  { month: 'Feb', size: 520 },
  { month: 'Mar', size: 610 },
  { month: 'Apr', size: 780 },
  { month: 'May', size: 890 },
  { month: 'Jun', size: 1024 },
];

const LibraryAnalytics: React.FC = () => {
  const [isScanning, setIsScanning] = useState(false);
  const [filter, setFilter] = useState('');

  const runDeepScan = () => {
    setIsScanning(true);
    setTimeout(() => setIsScanning(false), 2000);
  };

  const totalFiles = useMemo(() => CATEGORY_STATS.reduce((acc, curr) => acc + curr.value, 0), []);

  return (
    <div className="p-8 space-y-8 h-full overflow-y-auto custom-scrollbar pb-24">
      {/* Header with AI Action */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Library Analytics</h2>
          <p className="text-zinc-400 text-sm mt-1">Deep packet inspection of C-Cell SSD storage protocols</p>
        </div>
        <button 
          onClick={runDeepScan}
          disabled={isScanning}
          className={`flex items-center gap-3 px-6 py-3 rounded-2xl font-bold transition-all ${
            isScanning 
              ? 'bg-zinc-800 text-zinc-500 cursor-not-allowed' 
              : 'bg-red-600 hover:bg-red-700 text-white shadow-lg shadow-red-900/40 active:scale-95'
          }`}
        >
          {isScanning ? <Cpu className="w-5 h-5 animate-spin" /> : <Zap className="w-5 h-5 fill-current" />}
          {isScanning ? 'RUNNING NEURAL SCAN...' : 'TRIGGER AI AUDIT'}
        </button>
      </div>

      {/* Hero Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: 'System Integrity', value: '99.9%', icon: Activity, trend: '+0.1%', color: 'text-green-500' },
          { label: 'Storage Consumed', value: '1.2 TB', icon: HardDrive, trend: '85% Capacity', color: 'text-red-500' },
          { label: 'Metadata Density', value: '4.2 MB/s', icon: Database, trend: 'Optimal', color: 'text-blue-500' },
          { label: 'AI Mapping Confidence', value: '96.4%', icon: Cpu, trend: 'High', color: 'text-purple-500' },
        ].map((stat, i) => (
          <div key={i} className="bg-zinc-900/40 border border-zinc-800 p-6 rounded-3xl relative overflow-hidden group">
            <div className="absolute -right-4 -bottom-4 opacity-5 group-hover:opacity-10 transition-opacity">
              <stat.icon className="w-24 h-24" />
            </div>
            <div className="flex justify-between items-start mb-4">
              <div className={`p-2 rounded-xl bg-zinc-950 border border-zinc-800 ${stat.color}`}>
                <stat.icon className="w-5 h-5" />
              </div>
              <span className="text-[10px] font-bold text-zinc-500 bg-zinc-950 border border-zinc-800 px-2 py-1 rounded-full">
                {stat.trend}
              </span>
            </div>
            <h3 className="text-zinc-500 text-xs font-bold uppercase tracking-widest">{stat.label}</h3>
            <p className="text-2xl font-bold mt-1 text-zinc-100">{stat.value}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Category Breakdown */}
        <div className="lg:col-span-2 bg-zinc-900/40 border border-zinc-800 rounded-3xl p-8 shadow-xl">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-lg font-bold flex items-center gap-3">
              <BarChart3 className="w-5 h-5 text-red-500" />
              Category Mass Distribution
            </h3>
            <div className="flex gap-2">
              <div className="flex items-center gap-2 bg-zinc-950 border border-zinc-800 px-3 py-1.5 rounded-xl text-xs">
                <Filter className="w-3 h-3 text-zinc-500" />
                <span className="text-zinc-400 font-bold">ALL DATA</span>
              </div>
            </div>
          </div>
          <div className="h-[350px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={CATEGORY_STATS} layout="vertical" margin={{ left: 40 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#27272a" horizontal={false} />
                <XAxis type="number" hide />
                <YAxis 
                  dataKey="name" 
                  type="category" 
                  stroke="#71717a" 
                  fontSize={10} 
                  fontWeight="bold" 
                  tickLine={false} 
                  axisLine={false}
                />
                <Tooltip 
                  cursor={{ fill: 'transparent' }}
                  contentStyle={{ backgroundColor: '#09090b', borderColor: '#27272a', borderRadius: '12px', border: '1px solid #3f3f46' }}
                  itemStyle={{ color: '#f4f4f5', fontSize: '12px' }}
                />
                <Bar dataKey="value" radius={[0, 8, 8, 0]} barSize={32}>
                  {CATEGORY_STATS.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* AI Insight Card */}
        <div className="bg-zinc-900 border border-red-900/20 rounded-3xl p-8 relative overflow-hidden flex flex-col shadow-2xl">
          <div className="absolute top-0 right-0 p-4">
             <div className="w-12 h-12 bg-red-600/10 rounded-full flex items-center justify-center animate-pulse">
                <Sparkles className="w-6 h-6 text-red-600" />
             </div>
          </div>
          <h3 className="text-lg font-bold mb-4">Neural Audit Report</h3>
          <div className="flex-1 space-y-6">
            <div className="bg-zinc-950/50 border border-zinc-800 p-4 rounded-2xl">
              <div className="flex items-center gap-2 text-red-500 mb-2">
                <AlertCircle className="w-4 h-4" />
                <span className="text-[10px] font-bold uppercase tracking-widest">Expansion Delta</span>
              </div>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Library is heavily weighted towards <span className="text-red-500 font-bold">Drum One-shots</span> (35.8%). 
                Metadata suggests a deficiency in <span className="text-purple-500 font-bold">Melodic Textures</span> for upcoming Trap expansions.
              </p>
            </div>

            <div className="bg-zinc-950/50 border border-zinc-800 p-4 rounded-2xl">
              <div className="flex items-center gap-2 text-blue-500 mb-2">
                <TrendingUp className="w-4 h-4" />
                <span className="text-[10px] font-bold uppercase tracking-widest">Growth Forecast</span>
              </div>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Based on current curation speed, your library will exceed <span className="text-zinc-100 font-bold">200k samples</span> by Q3. 
                Consider archival of unused C-Cell nodes.
              </p>
            </div>
          </div>
          <div className="mt-8 pt-6 border-t border-zinc-800">
             <div className="flex justify-between items-center text-[10px] font-bold text-zinc-600">
                <span>AUDIT ID: CLOS_9921_X</span>
                <span>SECURE PROTOCOL</span>
             </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Storage Growth */}
        <div className="bg-zinc-900/40 border border-zinc-800 rounded-3xl p-8">
          <h3 className="text-lg font-bold mb-8 flex items-center gap-3">
            <TrendingUp className="w-5 h-5 text-blue-500" />
            Asset Accumulation (GB)
          </h3>
          <div className="h-[250px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={STORAGE_TIMELINE}>
                <defs>
                  <linearGradient id="colorSize" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#3B82F6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <XAxis dataKey="month" stroke="#52525b" fontSize={10} axisLine={false} tickLine={false} />
                <YAxis stroke="#52525b" fontSize={10} axisLine={false} tickLine={false} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#09090b', borderColor: '#27272a', borderRadius: '12px' }}
                />
                <Area type="monotone" dataKey="size" stroke="#3B82F6" fillOpacity={1} fill="url(#colorSize)" strokeWidth={3} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Recent Search Activity */}
        <div className="bg-zinc-900/40 border border-zinc-800 rounded-3xl p-8 flex flex-col">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-lg font-bold flex items-center gap-3">
              <Search className="w-5 h-5 text-green-500" />
              Node Search Log
            </h3>
            <span className="text-[10px] font-bold text-zinc-500 uppercase">Live Stream</span>
          </div>
          <div className="flex-1 space-y-3">
             {[
               { tag: '808', freq: 'High', color: 'text-red-500' },
               { tag: 'Lofi Keys', freq: 'Rising', color: 'text-purple-500' },
               { tag: 'Vocals', freq: 'Stable', color: 'text-blue-500' },
               { tag: 'Techno', freq: 'Low', color: 'text-zinc-500' },
             ].map((node, i) => (
               <div key={i} className="flex items-center justify-between p-3 bg-zinc-950/50 rounded-xl border border-zinc-800 hover:border-zinc-700 transition-all cursor-default group">
                  <div className="flex items-center gap-3">
                    <div className={`w-2 h-2 rounded-full ${node.color} animate-pulse`} />
                    <span className="text-xs font-bold font-mono text-zinc-300">SEARCH_QUERY::{node.tag}</span>
                  </div>
                  <span className="text-[10px] text-zinc-600 font-bold uppercase">{node.freq}</span>
               </div>
             ))}
          </div>
        </div>
      </div>
      
      {/* Footer Disclaimer */}
      <footer className="pt-12 flex items-center justify-center gap-2 opacity-30 group cursor-default">
         <Info className="w-3 h-3 group-hover:text-red-500 transition-colors" />
         <span className="text-[9px] font-bold uppercase tracking-[0.3em]">C-Cell Analytics Engine • Hardware Encrypted</span>
      </footer>
    </div>
  );
};

const Sparkles = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z" />
    <path d="M5 3v4" />
    <path d="M19 17v4" />
    <path d="M3 5h4" />
    <path d="M17 19h4" />
  </svg>
);

export default LibraryAnalytics;
