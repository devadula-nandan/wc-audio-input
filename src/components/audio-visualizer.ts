import { LitElement, css, html } from "lit";
import { customElement, property, state } from "lit/decorators.js";

const prefix = "wc";

@customElement(`${prefix}-audio-visualizer`)
export class AudioVisualizer extends LitElement {
  static styles = css`
    :host {
      display: inline-flex;
      align-items: center;
      gap: 2px;
      max-block-size: 40px;
      overflow: hidden;
      inline-size: 100%;
      justify-content: flex-end;
    }

    .dot {
      width: 2px;
      background: currentColor;
      border-radius: 1px;
      will-change: height;
    }
  `;

  @property({ attribute: false }) audioContext?: AudioContext;
  @property({ attribute: false }) analyser?: AnalyserNode;
  @property({ type: Boolean, reflect: true }) recording = false;

  @state() private dots: number[] = new Array(30).fill(2);

  private data?: Uint8Array;
  private rafId?: number;
  private resizeObserver?: ResizeObserver;

  private readonly MIN_FREQ = 800;
  private readonly MAX_FREQ = 8000;
  private readonly NOISE_FLOOR = 12;

  connectedCallback() {
    super.connectedCallback();
    this.observeSize();
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    this.resizeObserver?.disconnect();
    if (this.rafId) cancelAnimationFrame(this.rafId);
  }

  updated(changed: Map<string, any>) {
    if (changed.has("recording")) {
      this.recording ? this.start() : this.stop();
    }
  }

  private observeSize() {
    this.resizeObserver = new ResizeObserver((entries) => {
      const width = entries[0].contentRect.width;
      const dotCount = Math.max(8, Math.floor(width / 4));

      if (this.dots.length !== dotCount) {
        const next = new Array(dotCount).fill(2);
        this.dots.forEach((v, i) => {
          if (i < next.length) next[i] = v;
        });
        this.dots = next;
      }
    });

    this.resizeObserver.observe(this);
  }

  private start() {
    if (this.rafId || !this.analyser || !this.audioContext) return;

    this.analyser.fftSize = 2048;
    this.analyser.smoothingTimeConstant = 0.7;

    this.data = new Uint8Array(this.analyser.frequencyBinCount);

    const loop = () => {
      if (!this.analyser || !this.data || !this.recording) return;

      this.analyser.getByteFrequencyData(this.data);

      const energy = this.data.reduce((a, b) => a + b, 0);

      if (energy < 120) {
        this.dots = this.dots.map((h) => Math.max(2, h * 0.9));
        this.requestUpdate();
        this.rafId = requestAnimationFrame(loop);
        return;
      }

      const nyquist = this.audioContext!.sampleRate / 2;
      const minIndex = Math.floor((this.MIN_FREQ / nyquist) * this.data.length);
      const maxIndex = Math.floor((this.MAX_FREQ / nyquist) * this.data.length);

      this.dots = this.dots.map((prev, i) => {
        const t = i / (this.dots.length - 1);
        const logIndex = minIndex * Math.pow(maxIndex / minIndex, t);
        const index = Math.floor(logIndex);

        let v = this.data![index] || 0;
        if (v < this.NOISE_FLOOR) v = 0;

        const normalized = Math.pow(v / 255, 1.4);
        const target = 2 + normalized * 52;

        return prev * 0.85 + target * 0.15;
      });

      this.requestUpdate();
      this.rafId = requestAnimationFrame(loop);
    };

    this.rafId = requestAnimationFrame(loop);
  }

  private stop() {
    if (this.rafId) cancelAnimationFrame(this.rafId);
    this.rafId = undefined;

    const decay = () => {
      let done = true;

      this.dots = this.dots.map((h) => {
        const next = h * 0.85;
        if (next > 2.5) done = false;
        return Math.max(2, next);
      });

      this.requestUpdate();
      if (!done) requestAnimationFrame(decay);
    };

    decay();
  }

  render() {
    return html`
      ${this.dots.map(
        (h) => html`<div class="dot" style="height:${h}px"></div>`
      )}
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "wc-audio-visualizer": AudioVisualizer;
  }
}
