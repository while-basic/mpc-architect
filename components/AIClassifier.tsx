
import React, { useState } from 'react';
import { Terminal, Cpu, CheckCircle, AlertTriangle, Play, Sparkles } from 'lucide-react';
import { classifySamples } from '../services/geminiService';

const AIClassifier: React.FC = () => {
  const [inputText, setInputText] = useState('');
  const [isClassifying, setIsClassifying] = useState(false);
  const [results, setResults] = useState<any[]>([]);

  const runClassification = async () => {
    if (!inputText.trim()) return;
    setIsClassifying(true);
    const names = inputText.split('\n').filter(l => l.trim());
    try {
      const classified = await classifySamples(names);
      setResults(classified);
    } catch (e) {
      console.error(e);
    } finally {
      setIsClassifying(false);
    }
  };

  return (
    <div className="p-8 space-y-8 h-full overflow-y-auto">
      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden shadow-2xl">
        <div className="bg-zinc-800 px-6 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Terminal className="w-4 h-4 text-red-500" />
            <span className="text-xs font-mono font-bold text-zinc-300">CLOS_PROTOCOL_v1.0::CLASSIFIER</span>
          </div>
          <div className="flex gap-1">
            <div className="w-2 h-2 rounded-full bg-zinc-600" />
            <div className="w-2 h-2 rounded-full bg-zinc-600" />
            <div className="w-2 h-2 rounded-full bg-zinc-600" />
          </div>
        </div>
        <div className="p-8 space-y-6">
          <div className="space-y-2">
            <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest">Input Raw Filenames</label>
            <textarea 
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="kick01_vntg.wav&#10;808_sub_long.wav&#10;trap_loop_140bpm.aif"
              rows={6}
              className="w-full bg-zinc-950 border border-zinc-800 p-4 rounded-xl text-zinc-300 font-mono text-sm focus:outline-none focus:border-red-500/50 resize-none transition-all"
            />
          </div>
          <button 
            onClick={runClassification}
            disabled={isClassifying || !inputText}
            className={`w-full py-4 rounded-xl font-bold flex items-center justify-center gap-3 transition-all ${
              isClassifying 
                ? 'bg-zinc-800 text-zinc-500 cursor-not-allowed' 
                : 'bg-red-600 hover:bg-red-700 text-white shadow-lg shadow-red-900/20 active:scale-[0.98]'
            }`}
          >
            {isClassifying ? (
              <>
                <Cpu className="w-5 h-5 animate-spin" />
                NEURAL CLASSIFICATION IN PROGRESS...
              </>
            ) : (
              <>
                <Sparkles className="w-5 h-5" />
                ANALYZE WITH GEMINI AI
              </>
            )}
          </button>
        </div>
      </div>

      {results.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
          {results.map((res, i) => (
            <div key={i} className="bg-zinc-900/50 p-6 rounded-2xl border border-zinc-800 hover:border-zinc-700 transition-all">
              <div className="flex justify-between items-start mb-4">
                <span className={`text-[10px] font-bold px-2 py-1 rounded-full ${
                  res.category === 'DRUM_ONESHOT' ? 'bg-red-500/20 text-red-500' :
                  res.category === 'LOOP' ? 'bg-blue-500/20 text-blue-500' :
                  'bg-zinc-800 text-zinc-400'
                }`}>
                  {res.category}
                </span>
                <Play className="w-4 h-4 text-zinc-600 hover:text-white cursor-pointer transition-colors" />
              </div>
              <h4 className="font-mono text-sm text-zinc-100 mb-2 truncate" title={res.name}>{res.name}</h4>
              <p className="text-xs text-zinc-500 line-clamp-2">{res.reason}</p>
              <div className="mt-4 pt-4 border-t border-zinc-800 flex items-center gap-2">
                <CheckCircle className="w-3 h-3 text-green-500" />
                <span className="text-[10px] text-zinc-500">Auto-mapped to Drum Program Pad 01</span>
              </div>
            </div>
          ))}
        </div>
      )}
      
      {!results.length && !isClassifying && (
        <div className="flex flex-col items-center justify-center p-20 text-center space-y-4 bg-zinc-900/20 rounded-3xl border border-dashed border-zinc-800">
          <Cpu className="w-12 h-12 text-zinc-800" />
          <div>
            <h3 className="text-lg font-bold text-zinc-400">Awaiting Neural Input</h3>
            <p className="text-sm text-zinc-600">Enter a list of sample names to begin the pattern recognition protocol.</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default AIClassifier;
