import { LitElement, html, css } from "lit";
import { customElement, property } from "lit/decorators.js";

@customElement("control-panel")
export class ControlPanel extends LitElement {
  @property({ type: Number })
  testNumber = 4;

  @property({ type: String })
  theme = "white";

  static styles = css`
    :host {
      display: block;
      padding: 1rem;
      box-sizing: border-box;
    }
  `;

  connectedCallback() {
    super.connectedCallback();

    this.testNumber = Number(localStorage.getItem("test-number")) || 4;

    this.theme =
      localStorage.getItem("theme") ||
      (window.matchMedia("(prefers-color-scheme: dark)").matches
        ? "g100"
        : "white");

    this.updateApp();
  }

  updateApp() {
    const app = document.querySelector("app-root");

    // Test number
    app?.style.setProperty("--test-number", `${this.testNumber}px`);
    localStorage.setItem("test-number", String(this.testNumber));

    // Theme
    document.documentElement.className = `cds-theme-zone-${this.theme}`;
    localStorage.setItem("theme", this.theme);
  }

  render() {
    return html`
      <cds-layer level="1">
        <cds-stack gap="7">
          <cds-heading>Audio input</cds-heading>

          <!-- Test Number -->
          <cds-number-input
            label="--test-number"
            min="0"
            max="16"
            step="1"
            invalid-text="Are you sure about that?"
            .value=${this.testNumber}
            @cds-number-input=${(e: any) => {
              this.testNumber = Number(e.target.value);
              this.updateApp();
            }}
          ></cds-number-input>

          <!-- Theme -->
          <cds-dropdown
            label="Theme"
            .value=${this.theme}
            @cds-dropdown-selected=${(e: any) => {
              this.theme = e.detail.item.value;
              this.updateApp();
              this.requestUpdate();
            }}
          >
            <cds-dropdown-item value="white">White</cds-dropdown-item>
            <cds-dropdown-item value="g10">Gray 10</cds-dropdown-item>
            <cds-dropdown-item value="g90">Gray 90</cds-dropdown-item>
            <cds-dropdown-item value="g100">Dark</cds-dropdown-item>
          </cds-dropdown>

          <!-- Reset -->
          <cds-button
            kind="danger"
            @click=${() => {
              this.testNumber = 4;
              this.theme = "white";
              this.updateApp();
              this.requestUpdate();
            }}
          >
            Reset
          </cds-button>
        </cds-stack>
      </cds-layer>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "control-panel": ControlPanel;
  }
}
