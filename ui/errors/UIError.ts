export enum UIErrorType {
  SHADOW_ROOT_NOT_FOUND = "Shadow root is not initialized",
  REQUIRED_ELEMENTS_NOT_FOUND = "Required elements not found",
  INITIALIZATION_FAILED = "Component initialization failed",
}

export class UIError extends Error {
  constructor(component: string, type: UIErrorType, details?: string) {
    const message = `${component}: ${type}${details ? ` - ${details}` : ""}`;
    super(message);
    this.name = "UIError";
  }
}
