class SoundManager {
  private context: AudioContext | null = null;
  private masterGain: GainNode | null = null;
  private enabled: boolean = true;

  constructor() {
    // Initialize on first user interaction to handle autoplay policies
    if (typeof window !== 'undefined') {
      window.addEventListener('click', () => this.init(), { once: true });
      window.addEventListener('touchstart', () => this.init(), { once: true });
    }
  }

  private init() {
    if (this.context) return;
    
    try {
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      this.context = new AudioContextClass();
      this.masterGain = this.context.createGain();
      this.masterGain.gain.value = 0.3; // Global volume
      this.masterGain.connect(this.context.destination);
    } catch (e) {
      console.error('AudioContext not supported', e);
    }
  }

  public setEnabled(enabled: boolean) {
    this.enabled = enabled;
  }

  public toggle() {
    this.enabled = !this.enabled;
    return this.enabled;
  }

  public isEnabled() {
    return this.enabled;
  }

  private createOscillator(type: OscillatorType, freq: number, duration: number, startTime: number) {
    if (!this.context || !this.masterGain) return;

    const osc = this.context.createOscillator();
    const gain = this.context.createGain();

    osc.type = type;
    osc.frequency.setValueAtTime(freq, startTime);
    
    gain.gain.setValueAtTime(0, startTime);
    gain.gain.linearRampToValueAtTime(1, startTime + 0.01);
    gain.gain.exponentialRampToValueAtTime(0.01, startTime + duration);

    osc.connect(gain);
    gain.connect(this.masterGain);

    osc.start(startTime);
    osc.stop(startTime + duration);
  }

  public playPop() {
    if (!this.enabled || !this.context) return;
    if (this.context.state === 'suspended') this.context.resume();

    const now = this.context.currentTime;
    // Woodblock-ish sound
    this.createOscillator('sine', 600, 0.1, now);
    this.createOscillator('triangle', 1200, 0.05, now);
  }

  public playClick() {
    if (!this.enabled || !this.context) return;
    if (this.context.state === 'suspended') this.context.resume();

    const now = this.context.currentTime;
    this.createOscillator('sine', 800, 0.05, now);
  }

  public playPickUp() {
    if (!this.enabled || !this.context) return;
    if (this.context.state === 'suspended') this.context.resume();

    const now = this.context.currentTime;
    this.createOscillator('sine', 400, 0.1, now);
    // Slight pitch up
    const osc = this.context.createOscillator();
    const gain = this.context.createGain();
    osc.frequency.setValueAtTime(400, now);
    osc.frequency.linearRampToValueAtTime(600, now + 0.1);
    gain.gain.setValueAtTime(0, now);
    gain.gain.linearRampToValueAtTime(0.5, now + 0.02);
    gain.gain.linearRampToValueAtTime(0, now + 0.1);
    
    osc.connect(gain);
    if (this.masterGain) gain.connect(this.masterGain);
    osc.start(now);
    osc.stop(now + 0.1);
  }

  public playDrop() {
    if (!this.enabled || !this.context) return;
    if (this.context.state === 'suspended') this.context.resume();

    const now = this.context.currentTime;
    // Pitch down
    const osc = this.context.createOscillator();
    const gain = this.context.createGain();
    osc.frequency.setValueAtTime(500, now);
    osc.frequency.linearRampToValueAtTime(300, now + 0.15);
    gain.gain.setValueAtTime(0.5, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.15);
    
    osc.connect(gain);
    if (this.masterGain) gain.connect(this.masterGain);
    osc.start(now);
    osc.stop(now + 0.15);
  }

  public playMerge() {
    if (!this.enabled || !this.context) return;
    if (this.context.state === 'suspended') this.context.resume();

    const now = this.context.currentTime;
    // Major chord
    this.createOscillator('sine', 440, 0.3, now);       // A4
    this.createOscillator('sine', 554.37, 0.3, now + 0.05); // C#5
    this.createOscillator('sine', 659.25, 0.4, now + 0.1);  // E5
    
    // Sparkle effect
    const osc = this.context.createOscillator();
    const gain = this.context.createGain();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(880, now);
    osc.frequency.linearRampToValueAtTime(1760, now + 0.4);
    gain.gain.setValueAtTime(0.1, now);
    gain.gain.linearRampToValueAtTime(0, now + 0.4);
    
    osc.connect(gain);
    if (this.masterGain) gain.connect(this.masterGain);
    osc.start(now);
    osc.stop(now + 0.4);
  }

  public playSuccess() {
    if (!this.enabled || !this.context) return;
    if (this.context.state === 'suspended') this.context.resume();

    const now = this.context.currentTime;
    // Victory arpeggio
    [523.25, 659.25, 783.99, 1046.50].forEach((freq, i) => {
      this.createOscillator('sine', freq, 0.4, now + i * 0.1);
      this.createOscillator('triangle', freq, 0.2, now + i * 0.1);
    });
  }

  public playError() {
    if (!this.enabled || !this.context) return;
    if (this.context.state === 'suspended') this.context.resume();

    const now = this.context.currentTime;
    // Dissonant low buzz
    this.createOscillator('sawtooth', 150, 0.2, now);
    this.createOscillator('sawtooth', 140, 0.2, now);
  }
}

export const soundManager = new SoundManager();


