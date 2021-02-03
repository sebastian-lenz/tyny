export interface EventOptions<T> {
  target: T;
  type: string;
}

export default class Event<T = any> {
  readonly type: string;
  readonly target: T;

  private _defaultPrevented: boolean = false;
  private _propagationStopped: boolean = false;

  constructor(options: EventOptions<T>) {
    this.target = options.target;
    this.type = options.type;
  }

  isDefaultPrevented(): boolean {
    return this._defaultPrevented;
  }

  isPropagationStopped(): boolean {
    return this._propagationStopped;
  }

  preventDefault() {
    this._defaultPrevented = true;
  }

  stopPropagation() {
    this._propagationStopped = true;
  }
}
