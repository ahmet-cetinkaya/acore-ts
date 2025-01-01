import { UIError, UIErrorType } from "../errors/UIError";

/**
 * Accordion web component with smooth animation and accessibility support.
 * 
 * @example
 * ```html
 * <ac-accordion>
 *   <button slot="trigger">Toggle Content</button>
 *   <div slot="content">
 *     <p>This content will expand/collapse with animation</p>
 *   </div>
 * </ac-accordion>
 * ```
 */
export default class Accordion extends HTMLElement {
  public static COMPONENT_NAME = "ac-accordion";

  /** Button element that triggers accordion state change */
  private trigger!: HTMLElement;

  /** Container element that holds expandable content */
  private content!: HTMLElement;

  /** Current expansion state */
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

  /** @throws {UIError} When shadow root is not available */
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

  /** @throws {UIError} When required elements are not found */
  private initializeElements() {
    if (!this.shadowRoot) {
      throw new UIError(Accordion.COMPONENT_NAME, UIErrorType.SHADOW_ROOT_NOT_FOUND);
    }

    const trigger = this.shadowRoot.querySelector(".ac-accordion-trigger");
    const content = this.shadowRoot.querySelector(".ac-accordion-content");

    if (!trigger || !content) {
      throw new UIError(
        Accordion.COMPONENT_NAME,
        UIErrorType.REQUIRED_ELEMENTS_NOT_FOUND,
        "Missing trigger or content elements",
      );
    }

    this.trigger = trigger as HTMLElement;
    this.content = content as HTMLElement;

    this.trigger.setAttribute("role", "button");
    this.trigger.setAttribute("aria-expanded", "false");
    this.content.setAttribute("role", "region");
    this.content.setAttribute("aria-hidden", "true");
  }

  /** Handles accordion state change with smooth height animation */
  private toggleAccordion() {
    this.isExpanded = !this.isExpanded;

    if (this.isExpanded) {
      const height = this.content.scrollHeight;
      this.content.style.height = `${height}px`;
      this.trigger.setAttribute("aria-expanded", "true");
      this.content.setAttribute("aria-hidden", "false");
      this.notifyExpanded();
    } else {
      const height = this.content.scrollHeight;
      this.content.style.height = `${height}px`;
      this.content.offsetHeight;
      this.content.style.height = "0";
      this.trigger.setAttribute("aria-expanded", "false");
      this.content.setAttribute("aria-hidden", "true");
    }
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

  /** Public API to collapse accordion externally */
  public collapse() {
    if (this.isExpanded) {
      this.toggleAccordion();
    }
  }

  /** Sets up click and transition listeners */
  private attachEventListeners() {
    this.trigger.addEventListener("click", this.handleTriggerClick.bind(this));
    this.content.addEventListener("transitionend", this.handleTransitionEnd.bind(this));
  }

  /** Cleanup event listeners on component destroy */
  private detachEventListeners() {
    this.trigger.removeEventListener("click", this.handleTriggerClick.bind(this));
    this.content.removeEventListener("transitionend", this.handleTransitionEnd.bind(this));
  }

  /** @param {Event} e Click event on trigger element */
  private handleTriggerClick(e: Event) {
    e.preventDefault();
    this.toggleAccordion();
  }

  /** Sets content height to auto after expansion animation completes */
  private handleTransitionEnd() {
    if (this.isExpanded) {
      this.content.style.height = "auto";
    }
  }
}

customElements.define(Accordion.COMPONENT_NAME, Accordion);
