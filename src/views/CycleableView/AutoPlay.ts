import { Behaviour } from '../../core/Behaviour';
import { CycleableView, transistEvent } from './index';
import { off, on } from '../../utils/dom/event/on';

export interface AutoPlayOptions {
  autoStart?: boolean;
  interval?: number;
}

export class AutoPlay extends Behaviour<CycleableView> {
  id: number = Math.round(Math.random() * 1024);
  interval: number;
  isStarted: boolean = false;
  protected _timeout: number | null = null;

  constructor(view: CycleableView, options: AutoPlayOptions = {}) {
    super(view, {
      interval: 5000,
      ...options,
    });

    const { autoStart = true, interval = 5000 } = options;
    this.interval = interval;

    on(this.el, transistEvent, this.onTransist);

    if (autoStart) {
      this.start();
    }
  }

  pause() {
    const { _timeout } = this;
    if (_timeout) {
      clearTimeout(_timeout);
      this._timeout = null;
    }

    this.isStarted = false;
  }

  start() {
    const { interval, onTimeout, _timeout } = this;
    if (_timeout) {
      clearTimeout(_timeout);
    }

    this.isStarted = true;
    this._timeout = window.setTimeout(onTimeout, interval);
  }

  protected onDestroyed() {
    off(this.el, transistEvent, this.onTransist);
  }

  protected onTimeout = () => {
    const { view } = this;
    this._timeout = null;

    view.currentIndex = view.currentIndex + 1;
    this.start();
  };

  protected onTransist = () => {
    if (this._timeout) {
      this.start();
    }
  };
}
