/**
 * Ethereal Sacred Ambience Synthesizer
 * Uses Web Audio API to procedurally generate meditative Tibetan singing bowl /
 * gentle temple chime harmonics with zero network latency and no external assets.
 */

class SacredAmbiencePlayer {
  private ctx: AudioContext | null = null;
  private isPlaying: boolean = false;
  private masterGain: GainNode | null = null;
  private intervalId: any = null;

  private initContext() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  // Play a gentle singing bowl bell tone
  private playBellHarmonic(freq: number, duration: number, gainVal: number) {
    if (!this.ctx || !this.masterGain) return;

    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const osc2 = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    // Fundamental & overtone
    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq, now);

    osc2.type = 'sine';
    osc2.frequency.setValueAtTime(freq * 2.76, now); // Natural non-integer bell overtone

    // Exponential decay curve for singing bowl ring
    gain.gain.setValueAtTime(0.001, now);
    gain.gain.linearRampToValueAtTime(gainVal, now + 0.08);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + duration);

    osc.connect(gain);
    osc2.connect(gain);
    gain.connect(this.masterGain);

    osc.start(now);
    osc2.start(now);
    osc.stop(now + duration);
    osc2.stop(now + duration);
  }

  public toggle(): boolean {
    this.initContext();
    if (!this.ctx) return false;

    if (this.isPlaying) {
      this.stop();
      return false;
    } else {
      this.start();
      return true;
    }
  }

  public start() {
    this.initContext();
    if (!this.ctx) return;

    this.isPlaying = true;
    this.masterGain = this.ctx.createGain();
    this.masterGain.gain.setValueAtTime(0.18, this.ctx.currentTime);
    this.masterGain.connect(this.ctx.destination);

    // Initial serene bell chime (F# fundamental ~185Hz / C# ~277Hz)
    this.playBellHarmonic(216, 5.5, 0.25); // 432Hz harmonic half

    // Recurring gentle meditative cycle
    const pentatonicNotes = [144, 216, 288, 324, 432];
    this.intervalId = setInterval(() => {
      if (!this.isPlaying) return;
      const note = pentatonicNotes[Math.floor(Math.random() * pentatonicNotes.length)];
      this.playBellHarmonic(note, 6.0, 0.15);
    }, 4200);
  }

  public stop() {
    this.isPlaying = false;
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
    if (this.masterGain && this.ctx) {
      this.masterGain.gain.linearRampToValueAtTime(0.0001, this.ctx.currentTime + 0.5);
    }
  }

  public getStatus(): boolean {
    return this.isPlaying;
  }
}

export const sacredAmbience = new SacredAmbiencePlayer();
