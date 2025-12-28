
import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, BarChart, Bar, XAxis, YAxis } from 'recharts';
import { Database, FolderOpen, HardDrive, Cpu } from 'lucide-react';

const statsData = [
  { name: 'Drum One-shots', value: 61799, color: '#E11D48' },
  { name: 'Melodic One-shots', value: 45000, color: '#A855F7' },
  { name: 'Loops', value: 35000, color: '#3B82F6' },
  { name: 'FX', value: 20000, color: '#10B981' },
  { name: 'Other', value: 10938, color: '#F59E0B' },
];

const Dashboard: React.FC = () => {
  return (
    <div className="p-8 space-y-8 h-full overflow-y-auto custom-scrollbar">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: 'Total Files', value: '172,737', icon: Database, color: 'text-zinc-100' },
          { label: 'Expansion Packs', value: '5', icon: FolderOpen, color: 'text-red-500' },
          { label: 'Source SSD', value: 'C-Cell Core', icon: HardDrive, color: 'text-blue-500' },
          { label: 'AI Optimization', value: '98.2%', icon: Cpu, color: 'text-green-500' },
        ].map((stat, i) => (
          <div key={i} className="bg-zinc-900/50 p-6 rounded-2xl border border-zinc-800 hover:border-zinc-700 transition-colors">
            <div className="flex justify-between items-start mb-4">
              <stat.icon className={`w-6 h-6 ${stat.color}`} />
              <span className="text-[10px] font-bold text-zinc-500 bg-zinc-800 px-2 py-1 rounded">LIVE</span>
            </div>
            <h3 className="text-zinc-400 text-sm font-medium">{stat.label}</h3>
            <p className="text-2xl font-bold text-zinc-100 mt-1">{stat.value}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-zinc-900/50 p-8 rounded-2xl border border-zinc-800">
          <h2 className="text-lg font-bold mb-6 flex items-center gap-2">
            Library Composition
            <span className="text-xs font-normal text-zinc-500 ml-auto">Distribution by Category</span>
          </h2>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={statsData}>
                <XAxis dataKey="name" stroke="#52525b" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#52525b" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip 
                  cursor={{fill: '#27272a'}}
                  contentStyle={{backgroundColor: '#09090b', borderColor: '#27272a', borderRadius: '8px'}}
                  itemStyle={{color: '#f4f4f5'}}
                />
                <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                  {statsData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-zinc-900/50 p-8 rounded-2xl border border-zinc-800">
          <h2 className="text-lg font-bold mb-6">File Type Distribution</h2>
          <div className="h-[250px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={statsData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {statsData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                   contentStyle={{backgroundColor: '#09090b', borderColor: '#27272a', borderRadius: '8px'}}
                   itemStyle={{color: '#f4f4f5'}}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-4 space-y-2">
            {statsData.map((s, i) => (
              <div key={i} className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full" style={{backgroundColor: s.color}} />
                  <span className="text-zinc-400">{s.name}</span>
                </div>
                <span className="text-zinc-100 font-mono">{(s.value / 172737 * 100).toFixed(1)}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-zinc-900/50 p-6 rounded-2xl border border-zinc-800">
        <h2 className="text-lg font-bold mb-4">Phase 1 Status: Dataset Analysis</h2>
        <div className="space-y-4">
          <div className="relative pt-1">
            <div className="flex mb-2 items-center justify-between">
              <div>
                <span className="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full text-red-600 bg-red-200">
                  Classification Efficiency
                </span>
              </div>
              <div className="text-right">
                <span className="text-xs font-semibold inline-block text-red-600">
                  100%
                </span>
              </div>
            </div>
            <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-zinc-800">
              <div style={{ width: "100%" }} className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-red-500"></div>
            </div>
          </div>
          <p className="text-sm text-zinc-400 leading-relaxed">
            CLOS has successfully processed the file index. High-priority expansion targets identified: 
            <span className="text-red-500"> Trap Essentials</span>, 
            <span className="text-purple-500"> Vintage Drum Machines</span>, and 
            <span className="text-blue-500"> Hip-Hop Suite</span>.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
