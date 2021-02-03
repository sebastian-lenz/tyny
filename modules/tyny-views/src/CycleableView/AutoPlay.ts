import CycleableView from './CycleableView';

export interface AutoPlayOptions {
  autoStart?: boolean;
  interval?: number;
  target: CycleableView;
}

export default class AutoPlay {
  interval: number;

  readonly target: CycleableView;
  private timeout: number | undefined;

  constructor(options: AutoPlayOptions) {
    this.target = options.target;
    this.interval = options.interval || 5000;

    if (options.autoStart) {
      this.start();
    }
  }

  pause() {
    if (this.timeout) {
      clearTimeout(this.timeout);
      this.timeout = undefined;
    }
  }

  start() {
    const { handleTimeout, interval } = this;
    if (this.timeout) {
      clearTimeout(this.timeout);
    }

    this.timeout = setTimeout(handleTimeout, interval);
  }

  private handleTimeout = () => {
    this.timeout = undefined;

    const { target } = this;
    target.setCurrentIndex(target.getCurrentIndex() + 1);

    this.start();
  };
}
