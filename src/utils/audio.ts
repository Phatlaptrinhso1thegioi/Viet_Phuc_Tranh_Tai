// Web Audio API Retro Sound Effects & Vietnamese Pentatonic Chiptune Generator

class SoundEngine {
  private ctx: AudioContext | null = null;
  private isMuted: boolean = false;
  private sfxVolume: number = 0.7;
  private bgmVolume: number = 0.4;
  private bgmInterval: number | null = null;
  private currentBgmTrack: string = 'none';

  constructor() {
    // AudioContext will be initialized on first user interaction
  }

  private initCtx() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new AudioCtx();
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  public setMuted(muted: boolean) {
    this.isMuted = muted;
    if (muted && this.bgmInterval) {
      clearInterval(this.bgmInterval);
      this.bgmInterval = null;
    } else if (!muted && this.currentBgmTrack !== 'none') {
      this.playBGM(this.currentBgmTrack);
    }
  }

  public getMuted() {
    return this.isMuted;
  }

  public setVolume(sfx: number, bgm: number) {
    this.sfxVolume = Math.max(0, Math.min(1, sfx));
    this.bgmVolume = Math.max(0, Math.min(1, bgm));
  }

  public getVolume() {
    return { sfx: this.sfxVolume, bgm: this.bgmVolume };
  }

  // Generic sound generator
  public playTone(freq: number, type: OscillatorType, duration: number, startVol = 0.3, endVol = 0.001) {
    if (this.isMuted) return;
    try {
      this.initCtx();
      if (!this.ctx) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = type;
      osc.frequency.setValueAtTime(freq, this.ctx.currentTime);

      gain.gain.setValueAtTime(startVol * this.sfxVolume, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(endVol, this.ctx.currentTime + duration);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start();
      osc.stop(this.ctx.currentTime + duration);
    } catch {
      // Audio autoplay policy safely handled
    }
  }

  // SFX: UI Click
  public playClick() {
    this.playTone(660, 'square', 0.05, 0.2);
  }

  // SFX: Sword slash
  public playSlash() {
    if (this.isMuted) return;
    this.initCtx();
    if (!this.ctx) return;

    const dur = 0.18;
    const now = this.ctx.currentTime;
    
    // White noise / frequency drop for sword whoosh
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(800, now);
    osc.frequency.exponentialRampToValueAtTime(120, now + dur);

    gain.gain.setValueAtTime(0.4 * this.sfxVolume, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + dur);

    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start(now);
    osc.stop(now + dur);
  }

  // SFX: Heavy slash / Special attack
  public playHeavySlash() {
    if (this.isMuted) return;
    this.initCtx();
    if (!this.ctx) return;

    const dur = 0.35;
    const now = this.ctx.currentTime;
    
    const osc1 = this.ctx.createOscillator();
    const osc2 = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc1.type = 'sawtooth';
    osc1.frequency.setValueAtTime(1200, now);
    osc1.frequency.exponentialRampToValueAtTime(80, now + dur);

    osc2.type = 'square';
    osc2.frequency.setValueAtTime(440, now);
    osc2.frequency.exponentialRampToValueAtTime(60, now + dur);

    gain.gain.setValueAtTime(0.5 * this.sfxVolume, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + dur);

    osc1.connect(gain);
    osc2.connect(gain);
    gain.connect(this.ctx.destination);

    osc1.start(now);
    osc2.start(now);
    osc1.stop(now + dur);
    osc2.stop(now + dur);
  }

  // SFX: Monster Hit
  public playEnemyHit() {
    this.playTone(180, 'triangle', 0.12, 0.4);
    setTimeout(() => this.playTone(90, 'square', 0.15, 0.3), 40);
  }

  // SFX: Player hurt
  public playPlayerHurt() {
    this.playTone(220, 'sawtooth', 0.2, 0.4);
  }

  // SFX: Level Up Fanfare
  public playLevelUp() {
    const notes = [261.63, 329.63, 392.00, 523.25, 659.25, 783.99, 1046.50];
    notes.forEach((freq, idx) => {
      setTimeout(() => {
        this.playTone(freq, 'triangle', 0.22, 0.4);
      }, idx * 75);
    });
  }

  // SFX: Chest / Relic Found
  public playChestOpen() {
    const notes = [392.0, 523.25, 659.25, 783.99];
    notes.forEach((freq, idx) => {
      setTimeout(() => {
        this.playTone(freq, 'sine', 0.2, 0.35);
      }, idx * 90);
    });
  }

  // SFX: Quiz Correct Answer
  public playCorrect() {
    this.playTone(523.25, 'triangle', 0.12, 0.35);
    setTimeout(() => this.playTone(783.99, 'triangle', 0.25, 0.4), 100);
  }

  // SFX: Quiz Wrong Answer
  public playWrong() {
    this.playTone(220, 'sawtooth', 0.2, 0.3);
    setTimeout(() => this.playTone(180, 'sawtooth', 0.3, 0.3), 150);
  }

  // SFX: Space-time Dive / Glitch warp
  public playWarp() {
    if (this.isMuted) return;
    this.initCtx();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    const dur = 1.2;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(150, now);
    osc.frequency.exponentialRampToValueAtTime(1800, now + dur * 0.7);
    osc.frequency.exponentialRampToValueAtTime(300, now + dur);

    gain.gain.setValueAtTime(0.35 * this.sfxVolume, now);
    gain.gain.linearRampToValueAtTime(0.5 * this.sfxVolume, now + dur * 0.5);
    gain.gain.exponentialRampToValueAtTime(0.01, now + dur);

    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start(now);
    osc.stop(now + dur);
  }

  // SFX: Boss Roar / Glitch scream
  public playBossRoar() {
    if (this.isMuted) return;
    this.initCtx();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    const dur = 0.8;

    const osc1 = this.ctx.createOscillator();
    const osc2 = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc1.type = 'sawtooth';
    osc1.frequency.setValueAtTime(90, now);
    osc1.frequency.linearRampToValueAtTime(45, now + dur);

    osc2.type = 'square';
    osc2.frequency.setValueAtTime(130, now);
    osc2.frequency.linearRampToValueAtTime(65, now + dur);

    gain.gain.setValueAtTime(0.6 * this.sfxVolume, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + dur);

    osc1.connect(gain);
    osc2.connect(gain);
    gain.connect(this.ctx.destination);

    osc1.start(now);
    osc2.start(now);
    osc1.stop(now + dur);
    osc2.stop(now + dur);
  }

  // Background Music: Vietnamese Pentatonic Melody Synthesizer (Hò Ba Lý / Hào Khí Chữ S)
  public playBGM(track: string = 'peaceful') {
    this.stopBGM();
    this.currentBgmTrack = track;
    if (this.isMuted) return;

    this.initCtx();
    if (!this.ctx) return;

    // Pentatonic scale notes (Frequencies in Hz): C, D, F, G, A
    // D Minor / Dong Pentatonic: D4, F4, G4, A4, C5, D5
    const pentatonicMap = {
      peaceful: [293.66, 349.23, 392.00, 440.00, 523.25, 587.33, 523.25, 440.00], // Village / Map theme
      combat: [146.83, 174.61, 196.00, 220.00, 293.66, 349.23, 392.00, 440.00], // Fast battle tempo
      boss: [110.00, 130.81, 146.83, 164.81, 220.00, 261.63, 110.00, 146.83], // Dark menacing
      trivia: [329.63, 392.00, 440.00, 493.88, 587.33, 659.25, 587.33, 440.00], // Academic / ethereal
    };

    const notes = pentatonicMap[track as keyof typeof pentatonicMap] || pentatonicMap.peaceful;
    const intervalMs = track === 'combat' || track === 'boss' ? 240 : 380;
    let step = 0;

    this.bgmInterval = window.setInterval(() => {
      if (this.isMuted || !this.ctx) return;
      const freq = notes[step % notes.length];
      const bassFreq = freq / 2;

      // Play soft melody note
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = track === 'boss' ? 'sawtooth' : 'triangle';
      osc.frequency.setValueAtTime(freq, now);

      gain.gain.setValueAtTime(0.08 * this.bgmVolume, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + (intervalMs / 1000) * 0.9);

      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now);
      osc.stop(now + (intervalMs / 1000));

      // Bass note every 2 steps
      if (step % 2 === 0) {
        const bassOsc = this.ctx.createOscillator();
        const bassGain = this.ctx.createGain();
        bassOsc.type = 'sine';
        bassOsc.frequency.setValueAtTime(bassFreq, now);

        bassGain.gain.setValueAtTime(0.12 * this.bgmVolume, now);
        bassGain.gain.exponentialRampToValueAtTime(0.001, now + (intervalMs / 1000) * 1.8);

        bassOsc.connect(bassGain);
        bassGain.connect(this.ctx.destination);
        bassOsc.start(now);
        bassOsc.stop(now + (intervalMs / 1000) * 1.9);
      }

      step++;
    }, intervalMs);
  }

  public stopBGM() {
    if (this.bgmInterval) {
      clearInterval(this.bgmInterval);
      this.bgmInterval = null;
    }
  }
}

export const soundEngine = new SoundEngine();
