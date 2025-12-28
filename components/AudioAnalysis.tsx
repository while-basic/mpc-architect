
import React, { useState, useEffect, useRef } from 'react';
import { 
  Activity, Zap, AudioWaveform, Music, Info, 
  Cpu, FileAudio, Play, Pause, BarChart4, 
  Crosshair, Search, Sparkles 
} from 'lucide-react';
import { 
  XAxis, YAxis, CartesianGrid, 
  Tooltip, ResponsiveContainer, AreaChart, Area 
} from 'recharts';
import { GoogleGenAI, Type } from "@google/genai";
import { audioEngine } from '../services/audioEngine';

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const AudioAnalysis: React.FC = () => {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [activeFile, setActiveFile] = useState<string>("Kick_808_Deep.wav");
  const [analysisResult, setAnalysisResult] = useState<any>(null);
  const [spectrumData, setSpectrumData] = useState<any[]>([]);
  const [audioMeta, setAudioMeta] = useState<any>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rafRef = useRef<number>(0);

  const startAnalysisLoop = () => {
    const update = () => {
      const freqData = audioEngine.getFrequencyData();
      const waveformData = audioEngine.getWaveformData();
      
      // Update spectrum for chart (sampled for performance)
      const sampledFreq = [];
      for (let i = 0; i < freqData.length; i += 16) {
        sampledFreq.push({ freq: i, amplitude: freqData[i] });
      }
      setSpectrumData(sampledFreq);

      // Draw Waveform on Canvas
      const canvas = canvasRef.current;
      if (canvas) {
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.clearRect(0, 0, canvas.width, canvas.height);
          ctx.beginPath();
          ctx.strokeStyle = '#ef4444';
          ctx.lineWidth = 2;
          const sliceWidth = canvas.width / waveformData.length;
          let x = 0;
          for (let i = 0; i < waveformData.length; i++) {
            const v = waveformData[i] * 200.0;
            const y = canvas.height / 2 + v;
            if (i === 0) ctx.moveTo(x, y);
            else ctx.lineTo(x, y);
            x += sliceWidth;
          }
          ctx.lineTo(canvas.width, canvas.height / 2);
          ctx.stroke();
        }
      }
      rafRef.current = requestAnimationFrame(update);
    };
    update();
  };

  useEffect(() => {
    startAnalysisLoop();
    return () => cancelAnimationFrame(rafRef.current);
  }, []);

  const runDeepAnalysis = async () => {
    setIsAnalyzing(true);
    try {
      // In a real app, we'd fetch the actual file. Here we simulate the metadata extraction.
      // We trigger a dummy sound to see the visuals move
      const dummyUrl = 'https://actions.google.com/sounds/v1/drums/beep_short.ogg'; 
      const buffer = await audioEngine.loadSample(dummyUrl, activeFile);
      audioEngine.playBuffer(buffer);
      
      const features = await audioEngine.analyzeFeatures(buffer);
      setAudioMeta(features);

      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: `Analyze sonic characteristics for: ${activeFile}. Features: Peak ${features.peak}dB, RMS ${features.rms}dB.`,
        config: {
          systemInstruction: "You are the CLOS Audio Engine. Provide a JSON analysis including timbre tags and a professional sonic description.",
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              spectralCentroid: { type: Type.STRING },
              zeroCrossingRate: { type: Type.STRING },
              description: { type: Type.STRING },
              timbre: { type: Type.ARRAY, items: { type: Type.STRING } }
            }
          }
        }
      });
      setAnalysisResult(JSON.parse(response.text || '{}'));
    } catch (e) {
      console.error("Analysis failed", e);
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="p-8 space-y-8 h-full overflow-y-auto custom-scrollbar pb-24">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Audio Analysis Engine</h2>
          <p className="text-zinc-400 text-sm mt-1">Real-time Web Audio spectral processing</p>
        </div>
        <button 
          onClick={runDeepAnalysis}
          disabled={isAnalyzing}
          className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-2xl font-bold flex items-center gap-2 shadow-lg shadow-red-900/20 transition-all active:scale-95"
        >
          {isAnalyzing ? <Cpu className="w-5 h-5 animate-spin" /> : <Zap className="w-5 h-5 fill-current" />}
          {isAnalyzing ? 'PROCESSING...' : 'ANALYZE NODE'}
        </button>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-zinc-900/40 border border-zinc-800 rounded-3xl p-8 shadow-xl space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold flex items-center gap-3">
              <AudioWaveform className="w-5 h-5 text-red-500" />
              Live Oscilloscope
            </h3>
            <span className="text-[10px] font-mono text-zinc-500 uppercase">Input: {activeFile}</span>
          </div>
          
          <div className="relative h-48 bg-zinc-950 rounded-2xl border border-zinc-800/50 overflow-hidden flex items-center justify-center">
            <canvas ref={canvasRef} width={800} height={200} className="w-full h-full opacity-80" />
            <div className="absolute inset-0 pointer-events-none border border-zinc-800/20 bg-[radial-gradient(circle_at_center,_transparent_0%,_rgba(0,0,0,0.4)_100%)]" />
          </div>

          <div className="grid grid-cols-4 gap-4">
             {[
               { label: 'RMS Power', value: audioMeta?.rms ? `${audioMeta.rms} dB` : '--', icon: Activity },
               { label: 'Peak Level', value: audioMeta?.peak ? `${audioMeta.peak} dB` : '--', icon: BarChart4 },
               { label: 'Duration', value: audioMeta?.duration ? `${audioMeta.duration}s` : '--', icon: Music },
               { label: 'Sample Rate', value: audioMeta?.sampleRate ? `${audioMeta.sampleRate}Hz` : '--', icon: Crosshair },
             ].map((m, i) => (
               <div key={i} className="bg-zinc-950/50 p-3 rounded-xl border border-zinc-800 flex flex-col items-center">
                 <m.icon className="w-4 h-4 text-zinc-600 mb-1" />
                 <span className="text-[10px] text-zinc-500 uppercase font-bold">{m.label}</span>
                 <span className="text-sm font-mono font-bold text-zinc-200">{m.value}</span>
               </div>
             ))}
          </div>
        </div>

        <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-8 shadow-2xl space-y-6">
           <h3 className="text-lg font-bold flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-red-600" />
              AI Sonic Profile
           </h3>
           <div className="space-y-4">
              <div className="p-4 bg-zinc-950 rounded-xl border border-zinc-800">
                <p className="text-xs text-zinc-400 italic leading-relaxed">
                  {analysisResult?.description || "Select a node and trigger a scan to build a high-fidelity sonic profile."}
                </p>
              </div>
              <div className="flex flex-wrap gap-2">
                {(analysisResult?.timbre || []).map((t: any, i: number) => (
                  <span key={i} className="px-2 py-1 bg-red-600/10 text-red-500 border border-red-500/20 rounded-md text-[10px] font-bold uppercase">
                    {t}
                  </span>
                ))}
              </div>
           </div>
        </div>
      </div>

      <div className="bg-zinc-900/40 border border-zinc-800 rounded-3xl p-8">
        <h3 className="text-lg font-bold mb-8 flex items-center gap-3">
          <BarChart4 className="w-5 h-5 text-purple-500" />
          Spectral Distribution
        </h3>
        <div className="h-[250px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={spectrumData}>
              <defs>
                <linearGradient id="colorAmp" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#ef4444" stopOpacity={0.4}/>
                  <stop offset="95%" stopColor="#ef4444" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#27272a" vertical={false} />
              <XAxis dataKey="freq" hide />
              <YAxis hide />
              <Area type="monotone" dataKey="amplitude" stroke="#ef4444" fill="url(#colorAmp)" strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default AudioAnalysis;
