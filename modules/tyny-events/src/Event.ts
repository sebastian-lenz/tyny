export interface EventOptions {
  target?: any;
  type: string;
}

export default class Event {
  readonly type: string;
  readonly target: any | undefined;

  private _defaultPrevented: boolean = false;
  private _propagationStopped: boolean = false;

  constructor(options: EventOptions) {
    this.type = options.type;
    this.target = options.target;
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
