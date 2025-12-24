type FadeOptions = {
  /** Fade duration in ms. */
  ms?: number;
};

class BackgroundMusic {
  private audio: HTMLAudioElement | null = null;
  private enabled = true;
  private desiredPlaying = false;
  private fadeRaf: number | null = null;
  private currentTargetVolume = 0;

  constructor() {
    if (typeof window === 'undefined') return;
    // Autoplay policies: retry on first user gesture.
    window.addEventListener('click', () => this.tryPlayIfDesired(), { once: true });
    window.addEventListener('touchstart', () => this.tryPlayIfDesired(), { once: true });
    window.addEventListener('keydown', () => this.tryPlayIfDesired(), { once: true });
  }

  public setEnabled(enabled: boolean) {
    this.enabled = enabled;
    if (!enabled) this.pause();
    else this.tryPlayIfDesired();
  }

  public setDesiredPlaying(desired: boolean) {
    this.desiredPlaying = desired;
    if (!desired) this.pause();
    else this.tryPlayIfDesired();
  }

  public setTargetVolume(volume: number, opts: FadeOptions = {}) {
    this.currentTargetVolume = clamp01(volume);
    const el = this.ensureAudio();
    if (!el) return;
    const ms = opts.ms ?? 450;
    this.fadeTo(el, this.currentTargetVolume, ms);
  }

  private pause() {
    const el = this.audio;
    if (!el) return;
    try {
      el.pause();
    } catch {
      // ignore
    }
  }

  private tryPlayIfDesired() {
    if (!this.enabled || !this.desiredPlaying) return;
    const el = this.ensureAudio();
    if (!el) return;

    // Ensure volume is set to whatever the app currently wants.
    el.volume = clamp01(this.currentTargetVolume);

    const p = el.play();
    if (p && typeof (p as Promise<void>).catch === 'function') {
      (p as Promise<void>).catch(() => {
        // Likely autoplay blocked; we will retry on user gesture.
      });
    }
  }

  private ensureAudio() {
    if (typeof window === 'undefined') return null;
    if (this.audio) return this.audio;

    const el = new Audio();
    el.loop = true;
    el.preload = 'auto';
    el.volume = 0;

    const canM4a = el.canPlayType('audio/mp4; codecs="mp4a.40.2"');
    el.src = canM4a ? '/music/bgm-kian-drive.m4a' : '/music/bgm-kian-drive.mp3';

    this.audio = el;
    return el;
  }

  private fadeTo(el: HTMLAudioElement, target: number, ms: number) {
    if (this.fadeRaf) {
      cancelAnimationFrame(this.fadeRaf);
      this.fadeRaf = null;
    }

    const from = clamp01(el.volume);
    const to = clamp01(target);
    if (ms <= 0) {
      el.volume = to;
      return;
    }

    const start = performance.now();

    const tick = (now: number) => {
      const t = clamp01((now - start) / ms);
      // Smoothstep
      const eased = t * t * (3 - 2 * t);
      el.volume = from + (to - from) * eased;
      if (t < 1) this.fadeRaf = requestAnimationFrame(tick);
      else this.fadeRaf = null;
    };

    this.fadeRaf = requestAnimationFrame(tick);
  }
}

function clamp01(n: number) {
  return Math.max(0, Math.min(1, n));
}

export const backgroundMusic = new BackgroundMusic();


