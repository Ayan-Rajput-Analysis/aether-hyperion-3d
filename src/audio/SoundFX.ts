/**
 * Web Audio API Procedural Synthesizer for Aether Hyperion GT
 * Generates agency-grade haptic clicks, servo motors, wind tunnels, and EV hums
 * entirely in real-time without external audio asset dependencies.
 */
class SoundFXController {
  private ctx: AudioContext | null = null;
  private isMuted: boolean = false;
  private windNode: AudioBufferSourceNode | null = null;
  private windGain: GainNode | null = null;
  private servoOsc: OscillatorNode | null = null;
  private servoGain: GainNode | null = null;

  private init() {
    if (!this.ctx && typeof window !== 'undefined') {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new AudioCtx();
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  public toggleMute(): boolean {
    this.isMuted = !this.isMuted;
    if (this.isMuted) {
      if (this.windGain && this.ctx) {
        this.windGain.gain.setValueAtTime(0, this.ctx.currentTime);
      }
      if (this.servoGain && this.ctx) {
        this.servoGain.gain.setValueAtTime(0, this.ctx.currentTime);
      }
    }
    return this.isMuted;
  }

  public getIsMuted(): boolean {
    return this.isMuted;
  }

  /**
   * Crisp aerospace tactile UI click
   */
  public playClick(freq = 1400, duration = 0.035) {
    if (this.isMuted) return;
    this.init();
    if (!this.ctx) return;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq, this.ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(320, this.ctx.currentTime + duration);

    gain.gain.setValueAtTime(0.12, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + duration);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start();
    osc.stop(this.ctx.currentTime + duration);
  }

  /**
   * Precision mode toggle chirp
   */
  public playChirp(rising = true) {
    if (this.isMuted) return;
    this.init();
    if (!this.ctx) return;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    const startFreq = rising ? 380 : 880;
    const endFreq = rising ? 920 : 340;
    const duration = 0.08;

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(startFreq, this.ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(endFreq, this.ctx.currentTime + duration);

    gain.gain.setValueAtTime(0.15, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + duration);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start();
    osc.stop(this.ctx.currentTime + duration);
  }

  /**
   * Continuous servo/actuator sound for explode scrub
   */
  public triggerServoFeedback(speed: number) {
    if (this.isMuted || speed < 0.001) return;
    this.init();
    if (!this.ctx) return;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    const filter = this.ctx.createBiquadFilter();

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(120 + speed * 300, this.ctx.currentTime);
    
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(480 + speed * 600, this.ctx.currentTime);
    filter.Q.setValueAtTime(3, this.ctx.currentTime);

    const dur = 0.04;
    gain.gain.setValueAtTime(Math.min(0.08, speed * 0.15), this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + dur);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start();
    osc.stop(this.ctx.currentTime + dur);
  }

  /**
   * Telemetry modal open sonic signature
   */
  public playModalChime() {
    if (this.isMuted) return;
    this.init();
    if (!this.ctx) return;

    const fundamental = 523.25; // C5
    [1, 1.5, 2.0, 3.0].forEach((harmonic, idx) => {
      if (!this.ctx) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(fundamental * harmonic, this.ctx.currentTime + idx * 0.02);

      gain.gain.setValueAtTime(0.05 / (idx + 1), this.ctx.currentTime + idx * 0.02);
      gain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + 0.45);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(this.ctx.currentTime + idx * 0.02);
      osc.stop(this.ctx.currentTime + 0.45);
    });
  }

  /**
   * Wind tunnel airflow ambient loop
   */
  public setWindTunnelActive(active: boolean) {
    if (this.isMuted && active) return;
    this.init();
    if (!this.ctx) return;

    if (active) {
      if (this.windGain) {
        this.windGain.gain.cancelScheduledValues(this.ctx.currentTime);
        this.windGain.gain.linearRampToValueAtTime(0.18, this.ctx.currentTime + 0.8);
        return;
      }

      // Generate pink/white noise buffer for aerodynamic flow
      const bufferSize = this.ctx.sampleRate * 2;
      const noiseBuffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
      const output = noiseBuffer.getChannelData(0);
      let b0 = 0, b1 = 0, b2 = 0;
      for (let i = 0; i < bufferSize; i++) {
        const white = Math.random() * 2 - 1;
        b0 = 0.99886 * b0 + white * 0.0555179;
        b1 = 0.99332 * b1 + white * 0.0750759;
        b2 = 0.96900 * b2 + white * 0.1538520;
        output[i] = (b0 + b1 + b2) * 0.11;
      }

      const whiteNoise = this.ctx.createBufferSource();
      whiteNoise.buffer = noiseBuffer;
      whiteNoise.loop = true;

      const filter = this.ctx.createBiquadFilter();
      filter.type = 'bandpass';
      filter.frequency.setValueAtTime(650, this.ctx.currentTime);
      filter.Q.setValueAtTime(1.5, this.ctx.currentTime);

      this.windGain = this.ctx.createGain();
      this.windGain.gain.setValueAtTime(0.001, this.ctx.currentTime);
      this.windGain.gain.linearRampToValueAtTime(0.16, this.ctx.currentTime + 0.8);

      whiteNoise.connect(filter);
      filter.connect(this.windGain);
      this.windGain.connect(this.ctx.destination);

      whiteNoise.start();
      this.windNode = whiteNoise;
    } else {
      if (this.windGain && this.ctx) {
        this.windGain.gain.linearRampToValueAtTime(0.001, this.ctx.currentTime + 0.4);
        setTimeout(() => {
          if (this.windNode) {
            try { this.windNode.stop(); } catch {}
            this.windNode.disconnect();
            this.windNode = null;
          }
          if (this.windGain) {
            this.windGain.disconnect();
            this.windGain = null;
          }
        }, 450);
      }
    }
  }
}

export const soundFX = new SoundFXController();
