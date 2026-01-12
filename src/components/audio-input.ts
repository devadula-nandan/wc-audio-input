import { LitElement, html } from "lit";
import { customElement } from "lit/decorators.js";
const prefix = "wc";

@customElement(`${prefix}-audio-input`)
export class AudioInput extends LitElement {
  render() {
    return html` <p>Audio Input Component</p> `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "wc-audio-input": AudioInput;
  }
}
