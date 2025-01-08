import { UIError, UIErrorType } from "../errors/UIError";

/**
 * Accordion web component with smooth animation and accessibility support.
 *
 * @example
 * ```html
 * <ac-accordion>
 *   <button slot="trigger">Toggle Content</button>
 *   <div slot="content">Content here</div>
 * </ac-accordion>
 * ```
 *
 * @example
 * Group multiple accordions together:
 * ```html
 * <ac-accordion-group>
 *   <ac-accordion>...</ac-accordion>
 *   <ac-accordion>...</ac-accordion>
 * </ac-accordion-group>
 * ```
 */
export default class Accordion extends HTMLElement {
  public static COMPONENT_NAME = "ac-accordion";

  private trigger?: HTMLElement;
  private content!: HTMLElement;
  private isExpanded: boolean = false;

  constructor() {
    super();
    this.attachShadow({ mode: "open" });
  }

  connectedCallback() {
    this.render();
    this.initializeElements();
    this.attachEventListeners();
  }

  disconnectedCallback() {
    this.detachEventListeners();
  }

  /** Opens the accordion if it's closed */
  public open() {
    if (!this.isExpanded) {
      this.toggle();
    }
  }

  /** Closes the accordion if it's open */
  public close() {
    if (this.isExpanded) {
      this.toggle();
    }
  }

  /** Toggles the accordion state */
  public toggle() {
    this.isExpanded = !this.isExpanded;

    if (this.isExpanded) {
      const height = this.content.scrollHeight;
      this.content.style.height = `${height}px`;
      this.trigger?.setAttribute("aria-expanded", "true");
      this.content.setAttribute("aria-hidden", "false");
      this.notifyExpanded();
    } else {
      this.content.style.height = "0";
      this.trigger?.setAttribute("aria-expanded", "false");
      this.content.setAttribute("aria-hidden", "true");
    }
  }

  private render() {
    if (!this.shadowRoot) {
      throw new UIError(Accordion.COMPONENT_NAME, UIErrorType.SHADOW_ROOT_NOT_FOUND);
    }

    this.shadowRoot.innerHTML = `
      <style>
        .ac-accordion-content {
          overflow: hidden;
          transition: height 0.3s ease-out;
          height: 0;
        }
      </style>
      <div class="w-full">
        <div class="ac-accordion-trigger w-full cursor-pointer">
          <slot name="trigger"></slot>
        </div>
        <div class="ac-accordion-content">
          <slot name="content"></slot>
        </div>
      </div>
    `;
  }

  private initializeElements() {
    if (!this.shadowRoot) {
      throw new UIError(Accordion.COMPONENT_NAME, UIErrorType.SHADOW_ROOT_NOT_FOUND);
    }

    const trigger = this.shadowRoot.querySelector(".ac-accordion-trigger");
    const content = this.shadowRoot.querySelector(".ac-accordion-content");

    if (!content) {
      throw new UIError(Accordion.COMPONENT_NAME, UIErrorType.REQUIRED_ELEMENTS_NOT_FOUND, "Missing content element");
    }

    if (trigger) {
      this.trigger = trigger as HTMLElement;
      this.trigger.setAttribute("role", "button");
      this.trigger.setAttribute("aria-expanded", "false");
    }

    this.content = content as HTMLElement;
    this.content.setAttribute("role", "region");
    this.content.setAttribute("aria-hidden", "true");
  }

  /** Dispatches custom event to notify accordion group of state change */
  private notifyExpanded() {
    const event = new CustomEvent("accordion-expanded", {
      bubbles: true,
      composed: true,
      detail: { accordion: this },
    });
    this.dispatchEvent(event);
  }

  /** Sets up click and transition listeners */
  private attachEventListeners() {
    if (this.trigger) {
      this.trigger.addEventListener("click", this.handleTriggerClick.bind(this));
    }
    this.content.addEventListener("transitionend", this.handleTransitionEnd.bind(this));
  }

  /** Cleanup event listeners on component destroy */
  private detachEventListeners() {
    if (this.trigger) {
      this.trigger.removeEventListener("click", this.handleTriggerClick.bind(this));
    }
    this.content.removeEventListener("transitionend", this.handleTransitionEnd.bind(this));
  }

  private handleTriggerClick(triggerClickEvent: Event) {
    triggerClickEvent.preventDefault();
    this.toggle();
  }

  /** Sets content height to auto after expansion animation completes */
  private handleTransitionEnd() {
    if (this.isExpanded) this.content.style.height = "auto";
  }
}

customElements.define(Accordion.COMPONENT_NAME, Accordion);
