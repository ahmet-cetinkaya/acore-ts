import { UIError, UIErrorType } from "../errors/UIError";
import Tab from "./Tab";
import TabTrigger from "./TabTrigger";

/**
 * Tab group component that manages tab interactions and state.
 * Ensures only one tab is active at a time and handles tab switching.
 *
 * @slot tab - Contains tab trigger elements that activate their corresponding panels
 * @slot panel - Contains tab panels that show content for each tab
 *
 * @fires {CustomEvent} tab-trigger-click - When a tab trigger is clicked
 * @fires {CustomEvent} tab-activated - When a tab panel becomes active
 *
 * @example
 * ```html
 * <ac-tab-group>
 *   <ac-tab-trigger slot="tab">Tab 1</ac-tab-trigger>
 *   <ac-tab-trigger slot="tab">Tab 2</ac-tab-trigger>
 *
 *   <ac-tab slot="panel">Panel 1</ac-tab>
 *   <ac-tab slot="panel">Panel 2</ac-tab>
 * </ac-tab-group>
 * ```
 */
export default class TabGroup extends HTMLElement {
  public static COMPONENT_NAME = "ac-tab-group";

  private tabList!: HTMLElement;
  private tabs: Tab[] = [];
  private _activeTab: Tab | null = null;

  constructor() {
    super();
    this.attachShadow({ mode: "open" });
  }

  connectedCallback() {
    this.render();
    this.initializeTabs();
    this.setupTabListeners();
  }

  /**
   * Activates the tab at the given index
   * @param index Zero-based index of the tab to activate
   * @returns {boolean} True if successful, false if index is invalid
   */
  public selectTab(index: number): boolean {
    if (index < 0 || index >= this.tabs.length) return false;

    this.activateTab(this.tabs[index]);
    return true;
  }

  public get activeTab(): Tab | null {
    return this._activeTab;
  }

  public get activeTabIndex(): number {
    return this._activeTab ? this.tabs.indexOf(this._activeTab) : -1;
  }

  public get tabCount(): number {
    return this.tabs.length;
  }

  /**
   * Selects the next tab in the group
   * @returns {boolean} True if successful, false if there is no next tab
   */
  public nextTab(): boolean {
    const currentIndex = this.activeTabIndex;
    return this.selectTab((currentIndex + 1) % this.tabCount);
  }

  /**
   * Selects the previous tab in the group
   * @returns {boolean} True if successful, false if there is no previous tab
   */
  public previousTab(): boolean {
    const currentIndex = this.activeTabIndex;
    const prevIndex = currentIndex - 1 < 0 ? this.tabCount - 1 : currentIndex - 1;
    return this.selectTab(prevIndex);
  }

  private render() {
    if (!this.shadowRoot) {
      throw new UIError(TabGroup.COMPONENT_NAME, UIErrorType.SHADOW_ROOT_NOT_FOUND);
    }

    this.shadowRoot.innerHTML = `
      <style>
        .tab-list {
          display: flex;
        }
        .tab-content {
          position: relative;
          min-height: 100px;
        }
        ::slotted([slot="panel"]) {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
        }
        ::slotted(button) {
          padding: 0.5rem 1rem;
          border: none;
          background: none;
          cursor: pointer;
          transition: all 0.3s ease;
        }
        ::slotted(button[aria-selected="true"]) {
          margin-bottom: -2px;
        }
      </style>
      <div class="tab-group">
        <div class="tab-list" role="tablist">
          <slot name="tab"></slot>
        </div>
        <div class="tab-content">
          <slot name="panel"></slot>
        </div>
      </div>
    `;
  }

  private initializeTabs() {
    if (!this.shadowRoot) return;

    this.tabList = this.shadowRoot.querySelector(".tab-list")!;
    this.tabs = Array.from(this.querySelectorAll(Tab.COMPONENT_NAME));
    const triggers = Array.from(this.querySelectorAll(TabTrigger.COMPONENT_NAME));

    triggers.forEach((trigger, index) => {
      trigger.setAttribute("aria-controls", `tab-${index}`);
      trigger.id = `tab-trigger-${index}`;
    });

    if (this.tabs.length > 0) {
      this.selectTab(0);
    }
  }

  private setupTabListeners() {
    this.addEventListener("tab-trigger-click", (e: Event) => {
      const trigger = (e as CustomEvent).detail.trigger as TabTrigger;
      const triggers = Array.from(this.querySelectorAll(TabTrigger.COMPONENT_NAME));
      const index = triggers.indexOf(trigger);
      if (index >= 0) {
        this.selectTab(index);
      }
    });

    this.addEventListener("tab-activated", (e: Event) => {
      const newTab = (e as CustomEvent).detail.tab as Tab;

      if (this._activeTab && this._activeTab !== newTab) {
        this._activeTab.deactivate();
      }

      this._activeTab = newTab;
      this.updateTabStates(this.tabs.indexOf(newTab));
    });
  }

  private updateTabStates(activeIndex: number) {
    const triggers = this.querySelectorAll(TabTrigger.COMPONENT_NAME);
    triggers.forEach((trigger, i) => {
      if (i === activeIndex) {
        (trigger as TabTrigger).select();
      } else {
        (trigger as TabTrigger).deselect();
      }
    });
  }

  private activateTab(tab: Tab) {
    this._activeTab?.deactivate();
    this.tabs.forEach((t) => t.removeAttribute("active"));

    tab.setAttribute("active", "");
    tab.activate();
    this._activeTab = tab;

    // Update aria attributes
    const index = this.tabs.indexOf(tab);
    const buttons = this.tabList.querySelectorAll("button");
    buttons.forEach((button, i) => {
      button.setAttribute("aria-selected", i === index ? "true" : "false");
      button.classList.toggle("active", i === index);
    });
  }
}

customElements.define(TabGroup.COMPONENT_NAME, TabGroup);
