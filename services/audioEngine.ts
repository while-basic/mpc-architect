
export class AudioEngine {
  private ctx: AudioContext;
  private masterGain: GainNode;
  private analyser: AnalyserNode;
  private buffers: Map<string, AudioBuffer> = new Map();

  constructor() {
    this.ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
    this.masterGain = this.ctx.createGain();
    this.analyser = this.ctx.createAnalyser();
    this.analyser.fftSize = 2048;
    
    this.masterGain.connect(this.analyser);
    this.analyser.connect(this.ctx.destination);
  }

  async loadSample(url: string, id: string): Promise<AudioBuffer> {
    if (this.buffers.has(id)) return this.buffers.get(id)!;
    
    const response = await fetch(url);
    const arrayBuffer = await response.arrayBuffer();
    const audioBuffer = await this.ctx.decodeAudioData(arrayBuffer);
    this.buffers.set(id, audioBuffer);
    return audioBuffer;
  }

  playBuffer(buffer: AudioBuffer, velocity: number = 1, pitch: number = 1) {
    if (this.ctx.state === 'suspended') this.ctx.resume();
    
    const source = this.ctx.createBufferSource();
    const gain = this.ctx.createGain();
    
    source.buffer = buffer;
    source.playbackRate.value = pitch;
    gain.gain.value = velocity;
    
    source.connect(gain);
    gain.connect(this.masterGain);
    
    source.start(0);
  }

  getFrequencyData(): Uint8Array {
    const data = new Uint8Array(this.analyser.frequencyBinCount);
    this.analyser.getByteFrequencyData(data);
    return data;
  }

  getWaveformData(): Float32Array {
    const data = new Float32Array(this.analyser.fftSize);
    this.analyser.getFloatTimeDomainData(data);
    return data;
  }

  async analyzeFeatures(buffer: AudioBuffer) {
    const data = buffer.getChannelData(0);
    let peak = 0;
    let sumSq = 0;
    
    for (let i = 0; i < data.length; i++) {
      const val = Math.abs(data[i]);
      if (val > peak) peak = val;
      sumSq += val * val;
    }
    
    const rms = Math.sqrt(sumSq / data.length);
    const rmsDb = 20 * Math.log10(rms || 1e-6);
    const peakDb = 20 * Math.log10(peak || 1e-6);
    
    return {
      rms: rmsDb.toFixed(2),
      peak: peakDb.toFixed(2),
      duration: buffer.duration.toFixed(3),
      sampleRate: buffer.sampleRate
    };
  }
}

export const audioEngine = new AudioEngine();
