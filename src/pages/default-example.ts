import { LitElement, html } from "lit";
import { state } from "lit/decorators.js";
import "../components/audio-input";
import "../components/audio-visualizer";

class DefaultExample extends LitElement {
  @state() transcript = "";
  @state() isRecording = false;

  private handleSpeechResult(e: CustomEvent) {
    this.transcript = e.detail.transcript;
  }

  private handleRecordingChange(e: Event) {
    const target = e.currentTarget as HTMLElement;
    this.isRecording = target.hasAttribute("is-recording");
  }

  render() {
    return html`
      <div style="padding: 1rem;">
        <cds-stack gap="6">
          <wc-audio-input
            @speech-result=${this.handleSpeechResult}
            @click=${this.handleRecordingChange}
          >
            <wc-audio-visualizer slot="visualizer"></wc-audio-visualizer>
          </wc-audio-input>

          <cds-textarea
            .value=${this.transcript}
            placeholder="The spoken text will appear here..."
            rows="4"
            cols="0"
            ?readonly=${this.isRecording}
          ></cds-textarea>
        </cds-stack>
      </div>
    `;
  }
}

customElements.define("default-example", DefaultExample);
