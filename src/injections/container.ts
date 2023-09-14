export type Injection = {
  token: string,
  reference: object
}

export default class Container {
  private static instance: Container;
  private static tokens: Map<string, object> = new Map();

  private constructor() {}

  static create() {
    if (!this.instance) this.instance = new Container();
    return this;
  }

  static add(injection: object) {
    const token = injection.constructor.name;
    const ref = injection;
    this.tokens.set(token, ref);
  }

  static get<T>(token: string) {
    const reference = this.tokens.get(token);
    if (!reference) throw Error(`${token} reference not found`);
    return reference as T;
  }
}