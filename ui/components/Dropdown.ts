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

  connectedCallback() {
    this.render();
    this.initializeElements();
    this.attachEventListeners();
  }

  disconnectedCallback() {
    this.detachEventListeners();
    this.content.remove();
  }

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
    this.trigger.setAttribute('aria-haspopup', 'true');
    this.trigger.setAttribute('aria-expanded', 'false');
    this.trigger.setAttribute('aria-controls', 'dropdown-content');

    // Create content element in body
    this.content = document.createElement("div");
    this.content.className = "ac-dropdown-content fixed hidden z-50";
    this.content.setAttribute("role", "menu"); // Accessibility için
    this.content.setAttribute("aria-orientation", "vertical");
    this.content.setAttribute("id", "dropdown-content");
    this.content.setAttribute("tabindex", "-1");
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
    this.trigger.setAttribute('aria-expanded', (!isVisible).toString());
  }

  private showMenu() {
    this.content.classList.remove("hidden");
    this.updatePosition();
    // Add focus trap and make content focusable
    requestAnimationFrame(() => this.focusFirstMenuItem());
  }

  private hideMenu() {
    this.content.classList.add("hidden");
    this.trigger.focus();
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
    this.trigger.addEventListener("keydown", this.handleTriggerKeydown.bind(this));
    this.content.addEventListener("keydown", this.handleContentKeydown.bind(this));
    document.addEventListener("click", this.handleDocumentClick.bind(this));
    window.addEventListener("scroll", this.updatePosition.bind(this), true);
    window.addEventListener("resize", this.updatePosition.bind(this));
  }

  /**
   * Removes all event listeners to prevent memory leaks.
   */
  private detachEventListeners() {
    this.trigger?.removeEventListener("click", this.handleTriggerClick.bind(this));
    this.trigger?.removeEventListener("keydown", this.handleTriggerKeydown.bind(this));
    this.content?.removeEventListener("keydown", this.handleContentKeydown.bind(this));
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

  private handleTriggerKeydown(e: KeyboardEvent) {
    switch (e.key) {
      case 'Enter':
      case ' ':
      case 'ArrowDown':
        e.preventDefault();
        this.showMenu();
        this.focusFirstMenuItem();
        break;
      case 'Escape':
        this.hideMenu();
        break;
    }
  }

  private handleContentKeydown(e: KeyboardEvent) {
    const items = Array.from(this.content.querySelectorAll('[role="menuitem"]'));
    const currentIndex = items.indexOf(document.activeElement as HTMLElement);

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        if (currentIndex < items.length - 1) {
          (items[currentIndex + 1] as HTMLElement).focus();
        }
        break;
      case 'ArrowUp':
        e.preventDefault();
        if (currentIndex > 0) {
          (items[currentIndex - 1] as HTMLElement).focus();
        }
        break;
      case 'Escape':
        e.preventDefault();
        this.hideMenu();
        this.trigger.focus();
        break;
      case 'Tab':
        this.hideMenu();
        break;
    }
  }

  private focusFirstMenuItem() {
    const firstItem = this.content.querySelector('[role="menuitem"]') as HTMLElement;
    if (firstItem) {
      firstItem.focus();
    }
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
