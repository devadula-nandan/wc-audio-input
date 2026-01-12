import { LitElement, html } from "lit";
import "../components/audio-input";

class DefaultExample extends LitElement {
  render() {
    return html` <wc-audio-input></wc-audio-input> `;
  }
}

customElements.define("default-example", DefaultExample);
