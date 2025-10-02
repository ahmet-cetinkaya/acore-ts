export default class Injector {
  private static _instance: Injector = new Injector();
  private container = new Map<object | symbol, unknown>();

  constructor(initialContainer?: Map<object | symbol, unknown>) {
    if (Injector._instance) this.container = initialContainer!;
  }

  get instance(): Injector {
    return Injector._instance;
  }

  static getInstance(injectMap: Map<object | symbol, unknown>): Injector {
    if (injectMap) this._instance.container = injectMap;
    return Injector._instance;
  }

  register(token: object | symbol, value: unknown): void {
    this.container.set(token, value);
  }

  resolve<T>(token: object | symbol): T {
    if (!this.container.has(token)) throw new Error(`Token not found in container: ${String(token)}`);
    return this.container.get(token) as T;
  }
}
