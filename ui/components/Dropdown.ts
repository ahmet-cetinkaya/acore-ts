import { UIError, UIErrorType } from "../errors/UIError";

/**
 * Custom dropdown web component that provides a configurable dropdown menu with positioning logic.
 *
 * @example
 * ```html
 * <ac-dropdown>
 *   <button slot="trigger">Open Menu</button>
 *   <div slot="content">
 *     Dropdown content goes here
 *   </div>
 * </ac-dropdown>
 * ```
 */
export default class Dropdown extends HTMLElement {
  public static COMPONENT_NAME = "ac-dropdown";

  private trigger!: HTMLElement;
  private content!: HTMLElement;
  private dropdownContainer!: HTMLElement;
  private contentSlot!: HTMLSlotElement;

  constructor() {
    super();
    this.attachShadow({ mode: "open" });
  }

  /**
   * Lifecycle callback when element is connected to DOM.
   * Initializes the dropdown and sets up event listeners.
   */
  connectedCallback() {
    this.render();
    this.initializeElements();
    this.attachEventListeners();
  }

  /**
   * Lifecycle callback when element is disconnected from DOM.
   * Cleans up event listeners to prevent memory leaks.
   */
  disconnectedCallback() {
    this.detachEventListeners();
    // Remove content element from body
    this.content.remove();
  }

  /**
   * Renders the initial shadow DOM structure with slots for trigger and content.
   */
  private render() {
    if (!this.shadowRoot) {
      throw new UIError(Dropdown.COMPONENT_NAME, UIErrorType.SHADOW_ROOT_NOT_FOUND);
    }

    this.shadowRoot.innerHTML = `
      <style>
        :host {
          display: inline-block;
          position: relative;
        }
        .ac-dropdown-container {
          position: relative;
          display: inline-block;
        }
        ::slotted([slot="content"]) {
          display: none !important;
        }
      </style>
      <div class="ac-dropdown-container">
        <div class="ac-dropdown-trigger">
          <slot name="trigger"></slot>
        </div>
        <slot name="content"></slot>
      </div>
    `;
  }

  /**
   * Initializes DOM element references and validates required elements.
   * @throws {Error} When required elements are not found in the shadow DOM.
   */
  private initializeElements() {
    if (!this.shadowRoot) {
      throw new UIError(Dropdown.COMPONENT_NAME, UIErrorType.SHADOW_ROOT_NOT_FOUND);
    }

    const trigger = this.shadowRoot.querySelector(".ac-dropdown-trigger");
    this.contentSlot = this.shadowRoot.querySelector('slot[name="content"]') as HTMLSlotElement;
    this.dropdownContainer = this.shadowRoot.querySelector(".ac-dropdown-container") as HTMLElement;

    if (!trigger || !this.contentSlot || !this.dropdownContainer) {
      throw new UIError(
        Dropdown.COMPONENT_NAME,
        UIErrorType.REQUIRED_ELEMENTS_NOT_FOUND,
        "Missing trigger or content elements",
      );
    }

    this.trigger = trigger as HTMLElement;

    // Create content element in body
    this.content = document.createElement("div");
    this.content.className = "ac-dropdown-content fixed hidden z-50";
    this.content.setAttribute("role", "menu"); // Accessibility için
    this.content.setAttribute("aria-orientation", "vertical");
    document.body.appendChild(this.content);

    // Move slotted content to body element
    this.contentSlot.addEventListener("slotchange", () => {
      const elements = this.contentSlot.assignedElements();
      if (elements.length > 0) {
        const element = elements[0];
        this.content.innerHTML = "";
        // Tailwind class'larını aynen koru, sadece kendi class'ımızı ekle
        this.content.className = `ac-dropdown-content fixed hidden z-50 ${element.className}`;
        this.content.innerHTML = element.innerHTML;
      }
    });
  }

  private toggleMenu() {
    const isVisible = !this.content.classList.contains("hidden");

    if (isVisible) this.hideMenu();
    else this.showMenu();
  }

  private showMenu() {
    this.content.classList.remove("hidden");
    this.updatePosition();
  }

  private hideMenu() {
    this.content.classList.add("hidden");
  }

  /**
   * Updates dropdown menu position based on viewport constraints.
   * Handles both horizontal and vertical overflow scenarios.
   */
  private updatePosition() {
    const triggerRect = this.trigger.getBoundingClientRect();
    const contentRect = this.content.getBoundingClientRect();
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;

    // Calculate initial position (centered below trigger)
    let left = triggerRect.left + (triggerRect.width - contentRect.width) / 2;
    let top = triggerRect.bottom + 8;

    // Handle horizontal overflow
    if (left + contentRect.width > viewportWidth) {
      left = viewportWidth - contentRect.width - 8;
    }
    if (left < 8) left = 8;

    // Handle vertical overflow
    if (top + contentRect.height > viewportHeight) {
      // Try to position above if there's space
      const topPosition = triggerRect.top - contentRect.height - 8;
      if (topPosition > 0) {
        top = topPosition;
      } else {
        // If no space above, position at max visible height
        top = viewportHeight - contentRect.height - 8;
      }
    }

    this.content.style.top = `${top}px`;
    this.content.style.left = `${left}px`;
    this.content.style.maxWidth = `${viewportWidth - 16}px`;
  }

  /**
   * Attaches all required event listeners for dropdown functionality.
   * Includes click, scroll, and resize handlers.
   */
  private attachEventListeners() {
    this.trigger.addEventListener("click", this.handleTriggerClick.bind(this));
    document.addEventListener("click", this.handleDocumentClick.bind(this));
    window.addEventListener("scroll", this.updatePosition.bind(this), true);
    window.addEventListener("resize", this.updatePosition.bind(this));
  }

  /**
   * Removes all event listeners to prevent memory leaks.
   */
  private detachEventListeners() {
    this.trigger?.removeEventListener("click", this.handleTriggerClick.bind(this));
    document.removeEventListener("click", this.handleDocumentClick.bind(this));
    window.removeEventListener("scroll", this.updatePosition.bind(this), true);
    window.removeEventListener("resize", this.updatePosition.bind(this));
  }

  /**
   * Handles trigger element click events.
   * @param {Event} e - The click event object
   */
  private handleTriggerClick(e: Event) {
    e.stopPropagation();
    this.toggleMenu();
  }

  /**
   * Handles document click events for closing dropdown when clicking outside.
   * Uses composedPath for proper shadow DOM event handling.
   * @param {Event} e - The click event object
   */
  private handleDocumentClick(e: Event) {
    const path = e.composedPath();
    if (!path.includes(this)) {
      this.hideMenu();
    }
  }
}

// Register the web component
customElements.define(Dropdown.COMPONENT_NAME, Dropdown);
