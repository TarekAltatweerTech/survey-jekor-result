const SOUND_FILES = ['tick', 'drumroll', 'impact', 'fireworks-1', 'fireworks-2', 'cheer'];

export class ShowAudio {
  constructor() {
    this.context = null;
    this.master = null;
    this.buffers = new Map();
    this.sources = new Set();
    this.muted = false;
    this.loadingPromise = null;
  }

  load() {
    if (!this.loadingPromise) this.loadingPromise = this.loadBuffers();
    return this.loadingPromise;
  }

  async loadBuffers() {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (!AudioContext) return;

    try {
      this.context = new AudioContext();
      this.master = this.context.createGain();
      this.master.gain.value = 0.9;
      this.master.connect(this.context.destination);

      await Promise.allSettled(
        SOUND_FILES.map(async (name) => {
          const response = await fetch('/sounds/' + name + '.mp3');
          if (!response.ok) throw new Error('Audio unavailable');
          const buffer = await this.context.decodeAudioData(await response.arrayBuffer());
          this.buffers.set(name, buffer);
        }),
      );
    } catch {
      this.context = null;
      this.master = null;
      this.buffers.clear();
    }
  }

  setMuted(muted) {
    this.muted = muted;
    if (this.master && this.context) {
      this.master.gain.setValueAtTime(muted ? 0 : 0.9, this.context.currentTime);
    }
  }

  schedule(name, when, offset = 0) {
    const buffer = this.buffers.get(name);
    if (!this.context || !this.master || !buffer || offset >= buffer.duration) return;

    try {
      const source = this.context.createBufferSource();
      source.buffer = buffer;
      source.connect(this.master);
      source.addEventListener('ended', () => this.sources.delete(source), { once: true });
      this.sources.add(source);
      source.start(when, Math.max(0, offset));
    } catch {
      // A missing or undecodable effect must never stop the visual show.
    }
  }

  async startShow(seconds) {
    const leadSeconds = 0.08;
    const preload = this.load();
    const resume = this.context?.resume().catch(() => {});
    let preloadTimer;

    await Promise.race([
      Promise.allSettled([preload, resume]),
      new Promise((resolve) => {
        preloadTimer = window.setTimeout(resolve, 3000);
      }),
    ]);
    window.clearTimeout(preloadTimer);

    if (!this.context || !this.master || this.context.state !== 'running') {
      const start = performance.now() + leadSeconds * 1000;
      return { startPerf: start, revealPerf: start + seconds * 1000 };
    }

    try {
      this.stop();
      const startContext = this.context.currentTime + leadSeconds;
      const startPerf = performance.now() + leadSeconds * 1000;
      const revealContext = startContext + seconds;

      for (let second = 0; second < seconds; second += 1) {
        this.schedule('tick', startContext + second);
      }

      const drumLead = 5.26;
      if (seconds >= drumLead) {
        this.schedule('drumroll', revealContext - drumLead);
      } else {
        this.schedule('drumroll', startContext, drumLead - seconds);
      }

      this.schedule('impact', revealContext);
      this.schedule('fireworks-1', revealContext + 0.3);
      this.schedule('cheer', revealContext + 0.4);
      this.schedule('fireworks-2', revealContext + 1.6);

      return { startPerf, revealPerf: startPerf + seconds * 1000 };
    } catch {
      const start = performance.now() + leadSeconds * 1000;
      return { startPerf: start, revealPerf: start + seconds * 1000 };
    }
  }

  stop() {
    this.sources.forEach((source) => {
      try {
        source.stop();
      } catch {
        // Sources that already ended are harmless.
      }
    });
    this.sources.clear();
  }

  destroy() {
    this.stop();
    if (this.context && this.context.state !== 'closed') void this.context.close();
  }
}
