/**
 * Page-turn sound, synthesised with the Web Audio API – no audio files to ship.
 * swish (band-passed noise sweep) + paper crackle + soft thump when the page lands.
 */
export class PageSound {
  enabled = true;
  private ctx?: AudioContext;
  private noise?: AudioBuffer;

  private ensure(): AudioContext | null {
    if (typeof window === "undefined") return null;
    if (!this.ctx) {
      const AC = window.AudioContext ?? (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
      if (!AC) return null;
      this.ctx = new AC();
      const len = this.ctx.sampleRate * 2;
      this.noise = this.ctx.createBuffer(1, len, this.ctx.sampleRate);
      const d = this.noise.getChannelData(0);
      for (let i = 0; i < len; i++) d[i] = Math.random() * 2 - 1;
    }
    if (this.ctx.state === "suspended") void this.ctx.resume();
    return this.ctx;
  }

  private burst(ctx: AudioContext, at: number, dur: number, type: BiquadFilterType, freq: number, peak: number, q = 0.7) {
    const src = ctx.createBufferSource();
    src.buffer = this.noise!;
    const f = ctx.createBiquadFilter();
    f.type = type; f.frequency.value = freq; f.Q.value = q;
    const g = ctx.createGain();
    g.gain.setValueAtTime(0.0001, at);
    g.gain.exponentialRampToValueAtTime(peak, at + dur * 0.15);
    g.gain.exponentialRampToValueAtTime(0.0001, at + dur);
    src.connect(f).connect(g).connect(ctx.destination);
    src.start(at, Math.random() * 1.5, dur + 0.05);
    src.stop(at + dur + 0.05);
  }

  /** @param duration length of the page animation in seconds */
  turn(duration: number, dir: 1 | -1 = 1) {
    if (!this.enabled) return;
    const ctx = this.ensure();
    if (!ctx || !this.noise) return;
    const t0 = ctx.currentTime + 0.01;
    const vol = dir === 1 ? 1 : 0.8;

    // swish
    const src = ctx.createBufferSource();
    src.buffer = this.noise;
    const bp = ctx.createBiquadFilter();
    bp.type = "bandpass"; bp.Q.value = 0.9;
    const [a, b, c] = dir === 1 ? [650, 3400, 1300] : [1300, 3000, 650];
    bp.frequency.setValueAtTime(a, t0);
    bp.frequency.exponentialRampToValueAtTime(b, t0 + duration * 0.4);
    bp.frequency.exponentialRampToValueAtTime(c, t0 + duration * 0.9);
    const hp = ctx.createBiquadFilter();
    hp.type = "highpass"; hp.frequency.value = 250;
    const g = ctx.createGain();
    g.gain.setValueAtTime(0.0001, t0);
    g.gain.exponentialRampToValueAtTime(0.28 * vol, t0 + duration * 0.32);
    g.gain.exponentialRampToValueAtTime(0.0001, t0 + duration * 0.92);
    src.connect(bp).connect(hp).connect(g).connect(ctx.destination);
    src.start(t0, Math.random() * 1.5, duration);
    src.stop(t0 + duration);

    // paper crackle
    for (let i = 0; i < 4; i++) {
      this.burst(ctx, t0 + duration * (0.08 + Math.random() * 0.7), 0.035, "highpass", 2600, 0.07 * vol);
    }

    // landing thump
    const land = t0 + duration * 0.86;
    this.burst(ctx, land, 0.14, "lowpass", 200, 0.4 * vol, 0.5);
    const osc = ctx.createOscillator();
    const og = ctx.createGain();
    osc.frequency.setValueAtTime(85, land);
    osc.frequency.exponentialRampToValueAtTime(48, land + 0.12);
    og.gain.setValueAtTime(0.0001, land);
    og.gain.exponentialRampToValueAtTime(0.22 * vol, land + 0.01);
    og.gain.exponentialRampToValueAtTime(0.0001, land + 0.16);
    osc.connect(og).connect(ctx.destination);
    osc.start(land); osc.stop(land + 0.2);

    if (typeof navigator !== "undefined") navigator.vibrate?.(8);
  }
}
