import { UIError, UIErrorType } from "../errors/UIError";

/**
 * Tab trigger component that acts as the clickable trigger for tab panels.
 * Used within ac-tab-group component as a tab button.
 *
 * @slot default - Content of the tab trigger button
 *
 * @fires {CustomEvent} tab-trigger-click - When the trigger is clicked
 *
 * @csspart trigger - The button element that wraps the trigger content
 *
 * @property {boolean} selected - Indicates if this tab trigger is currently selected
 * @property {string} aria-selected - ARIA attribute indicating selection state
 * @property {string} aria-controls - ID of the panel this trigger controls
 *
 * @example
 * ```html
 * <ac-tab-trigger slot="tab">
 *   <span class="icon"></span>
 *   Tab Label
 * </ac-tab-trigger>
 * ```
 */
export default class TabTrigger extends HTMLElement {
  public static COMPONENT_NAME = "ac-tab-trigger";

  constructor() {
    super();
    this.attachShadow({ mode: "open" });
  }

  connectedCallback() {
    this.render();
    this.setupAttributes();
    this.setupListeners();
  }

  public get isSelected(): boolean {
    return this.hasAttribute("selected");
  }

  public select() {
    this.setAttribute("selected", "");
    this.setAttribute("aria-selected", "true");
  }

  public deselect() {
    this.removeAttribute("selected");
    this.setAttribute("aria-selected", "false");
  }

  private render() {
    if (!this.shadowRoot) {
      throw new UIError(TabTrigger.COMPONENT_NAME, UIErrorType.SHADOW_ROOT_NOT_FOUND);
    }

    this.shadowRoot.innerHTML = `
      <style>
        :host {
          display: inline-block;
          cursor: pointer;
        }
        .trigger {
          all: inherit;
          border: none;
          background: none;
          padding: 0;
          margin: 0;
          width: 100%;
          height: 100%;
        }
      </style>
      <button class="trigger" role="tab">
        <slot></slot>
      </button>
    `;
  }

  private setupAttributes() {
    this.setAttribute("role", "tab");
    this.setAttribute("aria-selected", "false");
  }

  private setupListeners() {
    this.addEventListener("click", () => {
      const event = new CustomEvent("tab-trigger-click", {
        bubbles: true,
        composed: true,
        detail: { trigger: this },
      });
      this.dispatchEvent(event);
    });
  }
}

customElements.define(TabTrigger.COMPONENT_NAME, TabTrigger);
