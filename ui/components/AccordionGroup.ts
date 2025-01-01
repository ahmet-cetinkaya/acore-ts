import { UIError, UIErrorType } from "../errors/UIError";
import Accordion from "./Accordion";

/**
 * Container component that manages multiple accordions.
 * Ensures only one accordion is open at a time within the group.
 * 
 * @example
 * ```html
 * <ac-accordion-group>
 *   <ac-accordion>...</ac-accordion>
 *   <ac-accordion>...</ac-accordion>
 * </ac-accordion-group>
 * ```
 */
export default class AccordionGroup extends HTMLElement {
  public static COMPONENT_NAME = "ac-accordion-group";
  
  /** Currently expanded accordion within the group */
  private currentOpenAccordion: Accordion | null = null;

  constructor() {
    super();
    this.attachShadow({ mode: "open" });
  }

  /**
   * Lifecycle callback when element is connected to DOM.
   * Sets up the group container and accordion event listeners.
   */
  connectedCallback() {
    this.render();
    this.setupAccordionListeners();
  }

  /** @throws {UIError} When shadow root is not available */
  private render() {
    if (!this.shadowRoot) {
      throw new UIError(AccordionGroup.COMPONENT_NAME, UIErrorType.SHADOW_ROOT_NOT_FOUND);
    }

    this.shadowRoot.innerHTML = `
      <div class="divide-y divide-neutral-200 dark:divide-neutral-700">
        <slot></slot>
      </div>
    `;
  }

  /** Sets up event delegation for accordion state management */
  private setupAccordionListeners() {
    this.addEventListener("accordion-expanded", (e: Event) => {
      const newAccordion = (e as CustomEvent).detail.accordion as Accordion;

      if (this.currentOpenAccordion && this.currentOpenAccordion !== newAccordion) {
        this.currentOpenAccordion.collapse();
      }

      this.currentOpenAccordion = newAccordion;
    });
  }
}

customElements.define(AccordionGroup.COMPONENT_NAME, AccordionGroup);
