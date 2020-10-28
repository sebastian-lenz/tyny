let nextUid = 1465;

export interface AdapterSetCurrentTimeOptions {
  allowSeekAhead?: boolean;
}

export abstract class Adapter<TElement extends HTMLElement = HTMLElement> {
  readonly el: TElement;
  protected uid: number;

  constructor(el: TElement) {
    this.el = el;
    this.uid = nextUid++;
  }

  enableApi(): Promise<void> {
    return Promise.resolve();
  }

  getCurrentTime() {
    return 0;
  }

  getDuration() {
    return 0;
  }

  getVolume() {
    return 0;
  }

  mute() {}

  pause() {}

  play() {}

  setCurrentTime(value: number, options: AdapterSetCurrentTimeOptions = {}) {}

  setVolume(volume: number) {}

  unmute() {}
}
