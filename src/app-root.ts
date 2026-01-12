import { LitElement, css, html, nothing } from "lit";
import { customElement, state } from "lit/decorators.js";

import "./pages/default-example";
import "./pages/control-panel";

@customElement("app-root")
export class AppRoot extends LitElement {
  @state()
  private controlsVisible = true;

  static styles = css`
    :host {
      box-sizing: border-box;
    }
    cds-tabs {
      background-color: var(--cds-layer-01);
      box-shadow: inset 0px -2px 0px var(--cds-border-subtle);
    }
    .custom-flex {
      display: flex;
      height: calc(100dvh - 40px);
    }
    .left {
      flex: 1 1 auto;
      max-inline-size: calc(100% - 24rem - 1px);
      max-block-size: 100%;
    }
    .left.fw {
      max-inline-size: 100%;
    }
    .right {
      flex: 0 0 24rem;
      background-color: var(--cds-layer-01);
      border-inline-start: 1px solid var(--cds-border-subtle);
      z-index: 1;
    }
    .resize {
      resize: both;
      padding: 1rem;
      border: dashed 1px var(--cds-border-strong);
      /* outline: dashed 1px var(--cds-border-strong); */
      outline-offset: -17px;
      overflow: hidden;
      max-inline-size: calc(100% - 34px);
      max-block-size: calc(100% - 34px);
      block-size: 100%;
      min-inline-size: 120px;
      min-block-size: 120px;
      box-shadow: inset 0 0 0 1rem var(--cds-border-subtle);
    }
    .nav-container {
      display: flex;
      box-shadow: inset 0px -2px 0px var(--cds-border-subtle);
    }
    [role="tabpanel"] {
      block-size: 100%;
    }
  `;
  private getTabFromUrl() {
    const params = new URLSearchParams(window.location.search);
    return params.get("tab") ?? "home";
  }
  firstUpdated() {
    const tab = this.getTabFromUrl();

    const tabEl = this.renderRoot.querySelector<HTMLElement>(
      `cds-tab[value="${tab}"]`
    );
    requestAnimationFrame(() => {
      tabEl?.click();
    });
  }

  private updateUrl(tab: string) {
    const params = new URLSearchParams(window.location.search);
    params.set("tab", tab);
    const newUrl = `${window.location.pathname}?${params.toString()}`;
    history.pushState({}, "", newUrl);
  }

  render() {
    return html`
      <main>
        <div class="nav-container">
          <cds-tabs
          type=""
          @cds-tabs-selected=${(e: CustomEvent) => {
            const tabValue = e.detail.item.value;
            this.updateUrl(tabValue);
          }}
        >
          <cds-tab
            id="default-example"
            target="panel-default-example"
            value="default-example"
            >Default</cds-tab
          >
        </cds-tabs>
        <cds-button size="md" tooltip-text="Controls" kind="ghost" tooltip-position="left" isselected=${
          this.controlsVisible
        } @click=${() => {
      this.controlsVisible = !this.controlsVisible;
    }}>
  <svg focusable="false" slot="icon" preserveAspectRatio="xMidYMid meet" xmlns="http://www.w3.org/2000/svg" fill="currentColor" width="16" height="16" viewBox="0 0 16 16" aria-hidden="true"><path d="M13.5,8.4c0-0.1,0-0.3,0-0.4c0-0.1,0-0.3,0-0.4l1-0.8c0.4-0.3,0.4-0.9,0.2-1.3l-1.2-2C13.3,3.2,13,3,12.6,3	c-0.1,0-0.2,0-0.3,0.1l-1.2,0.4c-0.2-0.1-0.4-0.3-0.7-0.4l-0.3-1.3C10.1,1.3,9.7,1,9.2,1H6.8c-0.5,0-0.9,0.3-1,0.8L5.6,3.1	C5.3,3.2,5.1,3.3,4.9,3.4L3.7,3C3.6,3,3.5,3,3.4,3C3,3,2.7,3.2,2.5,3.5l-1.2,2C1.1,5.9,1.2,6.4,1.6,6.8l0.9,0.9c0,0.1,0,0.3,0,0.4	c0,0.1,0,0.3,0,0.4L1.6,9.2c-0.4,0.3-0.5,0.9-0.2,1.3l1.2,2C2.7,12.8,3,13,3.4,13c0.1,0,0.2,0,0.3-0.1l1.2-0.4	c0.2,0.1,0.4,0.3,0.7,0.4l0.3,1.3c0.1,0.5,0.5,0.8,1,0.8h2.4c0.5,0,0.9-0.3,1-0.8l0.3-1.3c0.2-0.1,0.4-0.2,0.7-0.4l1.2,0.4	c0.1,0,0.2,0.1,0.3,0.1c0.4,0,0.7-0.2,0.9-0.5l1.1-2c0.2-0.4,0.2-0.9-0.2-1.3L13.5,8.4z M12.6,12l-1.7-0.6c-0.4,0.3-0.9,0.6-1.4,0.8	L9.2,14H6.8l-0.4-1.8c-0.5-0.2-0.9-0.5-1.4-0.8L3.4,12l-1.2-2l1.4-1.2c-0.1-0.5-0.1-1.1,0-1.6L2.2,6l1.2-2l1.7,0.6	C5.5,4.2,6,4,6.5,3.8L6.8,2h2.4l0.4,1.8c0.5,0.2,0.9,0.5,1.4,0.8L12.6,4l1.2,2l-1.4,1.2c0.1,0.5,0.1,1.1,0,1.6l1.4,1.2L12.6,12z"></path><path d="M8,11c-1.7,0-3-1.3-3-3s1.3-3,3-3s3,1.3,3,3C11,9.6,9.7,11,8,11C8,11,8,11,8,11z M8,6C6.9,6,6,6.8,6,7.9C6,7.9,6,8,6,8	c0,1.1,0.8,2,1.9,2c0,0,0.1,0,0.1,0c1.1,0,2-0.8,2-1.9c0,0,0-0.1,0-0.1C10,6.9,9.2,6,8,6C8.1,6,8,6,8,6z"></path></svg>
</cds-button>
        </div>
        <div class="custom-flex">
        <div class="left ${this.controlsVisible ? "" : "fw"}">
          <div class="resize">
            <div
              id="panel-default-example"
              role="tabpanel"
              aria-labelledby="default-example"
              hidden=""
            >
              <default-example></default-example>
            </div>
          </div>
        </div>
        ${
          this.controlsVisible
            ? html`<aside class="right">
                <control-panel></control-panel>
              </aside>`
            : nothing
        }
        </div>
      </main>
      </aside>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "app-root": AppRoot;
  }
}
