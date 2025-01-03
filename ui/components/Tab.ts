import { UIError, UIErrorType } from "../errors/UIError";

/**
 * Tab panel component that displays content with smooth fade animation.
 * Used within ac-tab-group component as a panel.
 * 
 * @slot default - Content to be displayed when tab is active
 * 
 * @fires {CustomEvent} tab-activated - When the tab becomes active
 * 
 * @csspart panel - The tab panel container element
 * 
 * @property {boolean} active - Indicates if the tab is currently active
 * 
 * @example
 * ```html
 * <ac-tab slot="panel">
 *   <div>Tab content here</div>
 * </ac-tab>
 * ```
 */
export default class Tab extends HTMLElement {
  public static COMPONENT_NAME = "ac-tab";

  private panel!: HTMLElement;

  constructor() {
    super();
    this.attachShadow({ mode: "open" });
  }

  connectedCallback() {
    this.render();
    this.initializePanel();
  }

  public get isActive(): boolean {
    return this.hasAttribute("active");
  }

  public get panelElement(): HTMLElement {
    return this.panel;
  }

  public activate() {
    if (!this.isActive) {
      this.setAttribute("active", "");
      this.notifyActivated();
    }
  }

  public deactivate() {
    if (this.isActive) {
      this.removeAttribute("active");
    }
  }

  private notifyActivated() {
    const event = new CustomEvent("tab-activated", {
      bubbles: true,
      composed: true,
      detail: { tab: this },
    });
    this.dispatchEvent(event);
  }

  private render() {
    if (!this.shadowRoot) {
      throw new UIError(Tab.COMPONENT_NAME, UIErrorType.SHADOW_ROOT_NOT_FOUND);
    }

    this.shadowRoot.innerHTML = `
      <style>
        :host {
          display: block;
          width: 100%;
          opacity: 0;
          visibility: hidden;
          transition: opacity 0.3s ease, visibility 0.3s ease;
        }
        :host([active]) {
          opacity: 1;
          visibility: visible;
        }
        .tab-panel {
          padding: 1rem;
        }
      </style>
      <div class="tab-panel" role="tabpanel">
        <slot></slot>
      </div>
    `;
  }

  private initializePanel() {
    if (!this.shadowRoot) return;
    this.panel = this.shadowRoot.querySelector(".tab-panel")!;
  }
}

customElements.define(Tab.COMPONENT_NAME, Tab);
