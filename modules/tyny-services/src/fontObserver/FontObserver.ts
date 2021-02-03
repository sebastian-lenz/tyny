import { viewport } from '../viewport';
import Worker from './Worker';

export default class FontObserver {
  private workers: Worker[] = [];

  add(markup: string) {
    this.workers.push(new Worker({ observer: this, markup }));
  }

  handleFontLoaded() {
    viewport().triggerResize();
  }
}
