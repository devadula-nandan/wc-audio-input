import { LitElement, css, html } from "lit";
import { customElement, property } from "lit/decorators.js";

const prefix = "wc";

@customElement(`${prefix}-audio-input`)
export class AudioInput extends LitElement {
  static styles = css`
    :host {
      display: inline-flex;
      gap: 2px;
      align-items: center;
      background-color: var(--cds-field);
    }

    .recording {
      animation: recording-pulse 1.2s ease-in-out infinite;
    }

    @keyframes recording-pulse {
      20%,
      60% {
        fill: var(--cds-support-error, #da1e28);
      }
    }
  `;

  @property({ type: String, reflect: true }) size = "md";
  @property({ type: Boolean, reflect: true }) disabled = false;
  @property({ type: Boolean, reflect: true, attribute: "is-recording" })
  isRecording = false;

  audioContext?: AudioContext;
  analyser?: AnalyserNode;
  private stream?: MediaStream;

  // private recognition?: SpeechRecognition;
  private recognition?: any;

  connectedCallback() {
    super.connectedCallback();

    const SpeechRecognition =
      (window as any).SpeechRecognition ||
      (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      console.warn("SpeechRecognition not supported in this browser");
      return;
    }

    this.recognition = new SpeechRecognition();
    this.recognition.continuous = true;
    this.recognition.interimResults = true;
    this.recognition.lang = "en-US";

    this.recognition.onresult = (e: any) => {
      let transcript = "";
      for (const result of e.results) {
        transcript += result[0].transcript;
      }

      this.dispatchEvent(
        new CustomEvent("speech-result", {
          detail: { transcript },
          bubbles: true,
          composed: true,
        })
      );
    };

    this.recognition.onend = () => {
      if (this.isRecording) {
        this.isRecording = false;
        this.stopMic();
        this.syncVisualizer();
      }
    };
  }

  private async startMic() {
    this.stream = await navigator.mediaDevices.getUserMedia({ audio: true });

    this.audioContext = new AudioContext();
    const source = this.audioContext.createMediaStreamSource(this.stream);

    this.analyser = this.audioContext.createAnalyser();
    this.analyser.fftSize = 256;

    source.connect(this.analyser);
    this.syncVisualizer();
  }

  private stopMic() {
    this.stream?.getTracks().forEach((t) => t.stop());
    this.stream = undefined;

    this.audioContext?.close();
    this.audioContext = undefined;

    this.analyser = undefined;
    this.syncVisualizer();
  }

  private async toggleRecording() {
    if (!this.recognition || this.disabled) return;

    if (this.isRecording) {
      this.recognition.stop();
      this.stopMic();
      this.isRecording = false;
    } else {
      await this.startMic();
      this.recognition.start();
      this.isRecording = true;
    }

    this.syncVisualizer();
  }

  private syncVisualizer() {
    const viz = this.querySelector("wc-audio-visualizer") as any;
    if (!viz) return;

    viz.audioContext = this.audioContext;
    viz.analyser = this.analyser;
    viz.recording = this.isRecording;
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    this.stopMic();
    this.recognition?.stop();
  }

  render() {
    return html`
      <slot name="visualizer"></slot>

      <cds-button
        tooltip-text=${this.isRecording ? "Stop recording" : "Start recording"}
        kind="ghost"
        tooltip-position="top-end"
        size=${this.size}
        ?disabled=${this.disabled}
        @click=${this.toggleRecording}
      >
        ${this.isRecording ? this.recordingIcon : this.micIcon}
      </cds-button>
    `;
  }

  private recordingIcon = html`
    <svg
      class="recording"
      fill="currentColor"
      slot="icon"
      width="16"
      height="16"
      viewBox="0 0 32 32"
    >
      <circle cx="16" cy="16" r="4" />
      <path
        d="M16,2C8.3,2,2,8.3,2,16s6.3,14,14,14s14-6.3,14-14S23.7,2,16,2z M16,22c-3.3,0-6-2.7-6-6s2.7-6,6-6s6,2.7,6,6S19.3,22,16,22z"
      />
    </svg>
  `;

  private micIcon = html`
    <svg
      fill="currentColor"
      slot="icon"
      width="16"
      height="16"
      viewBox="0 0 32 32"
    >
      <path
        d="M23,14v3A7,7,0,0,1,9,17V14H7v3a9,9,0,0,0,8,8.94V28H11v2H21V28H17V25.94A9,9,0,0,0,25,17V14Z"
      />
      <path
        d="M16,22a5,5,0,0,0,5-5V7A5,5,0,0,0,11,7V17A5,5,0,0,0,16,22ZM13,7a3,3,0,0,1,6,0V17a3,3,0,0,1-6,0Z"
      />
    </svg>
  `;
}

declare global {
  interface HTMLElementTagNameMap {
    "wc-audio-input": AudioInput;
  }
}
