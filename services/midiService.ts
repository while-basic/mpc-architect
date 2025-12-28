
export type MidiMessageCallback = (status: number, data1: number, data2: number, deviceId: string) => void;

export class MidiService {
  private access: MIDIAccess | null = null;
  private onMessageCallbacks: Set<MidiMessageCallback> = new Set();
  public inputs: MIDIInput[] = [];
  public outputs: MIDIOutput[] = [];
  public defaultChannel: number = 0; 

  async initialize(): Promise<boolean> {
    if (!navigator.requestMIDIAccess) {
      console.warn('Web MIDI API not supported in this browser.');
      return false;
    }

    try {
      this.access = await navigator.requestMIDIAccess({ sysex: true });
      this.updateDevices();
      this.access.onstatechange = () => this.updateDevices();
      return true;
    } catch (e) {
      console.error('Failed to get MIDI access', e);
      return false;
    }
  }

  private updateDevices() {
    if (!this.access) return;
    this.inputs = Array.from(this.access.inputs.values());
    this.outputs = Array.from(this.access.outputs.values());
    
    this.inputs.forEach(input => {
      input.onmidimessage = (event) => {
        const [status, data1, data2] = event.data;
        this.onMessageCallbacks.forEach(cb => cb(status, data1, data2, input.id));
      };
    });
  }

  // Fix: Ensure the cleanup function returned by onMessage returns void instead of boolean.
  onMessage(cb: MidiMessageCallback) {
    this.onMessageCallbacks.add(cb);
    return () => {
      this.onMessageCallbacks.delete(cb);
    };
  }

  sendNote(note: number, velocity: number = 100, duration: number = 200, channel?: number, targetOutputId?: string) {
    const ch = channel ?? this.defaultChannel;
    const noteOn = [0x90 | ch, note, velocity];
    const noteOff = [0x80 | ch, note, 0];
    
    const targets = targetOutputId 
      ? this.outputs.filter(o => o.id === targetOutputId)
      : this.outputs;

    targets.forEach(output => {
      output.send(noteOn);
      setTimeout(() => output.send(noteOff), duration);
    });
  }

  sendCC(cc: number, value: number, channel?: number, targetOutputId?: string) {
    const ch = channel ?? this.defaultChannel;
    const ccMessage = [0xB0 | ch, cc, Math.min(127, Math.max(0, Math.floor(value)))];
    
    const targets = targetOutputId 
      ? this.outputs.filter(o => o.id === targetOutputId)
      : this.outputs;

    targets.forEach(output => {
      output.send(ccMessage);
    });
  }

  sendTransport(command: 'start' | 'stop' | 'continue', targetOutputId?: string) {
    const codes = { start: 0xFA, stop: 0xFC, continue: 0xFB };
    const targets = targetOutputId 
      ? this.outputs.filter(o => o.id === targetOutputId)
      : this.outputs;

    targets.forEach(output => {
      output.send([codes[command]]);
    });
  }
}

export const midiService = new MidiService();
