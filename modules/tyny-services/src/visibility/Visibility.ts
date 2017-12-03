import { EventEmitter } from 'tyny-events';
import { IntervalType } from 'tyny-utils';

import { viewport, ViewportEvent } from '../viewport';

import { VisibilityTarget } from './index';
import VisibilityObserver from './VisibilityObserver';

export default class Visibility extends EventEmitter implements IntervalType {
  bleed: number = 500;
  max: number = 0;
  min: number = 0;
  observers: VisibilityObserver[] = [];

  constructor() {
    super();

    this.listenTo(
      viewport(),
      ViewportEvent.resizeEvent,
      this.handleViewportEvent,
      -10
    );

    this.listenTo(
      viewport(),
      ViewportEvent.scrollEvent,
      this.handleViewportEvent,
      -10
    );

    this.update();
  }

  getObserver(target: VisibilityTarget): VisibilityObserver | undefined {
    const { observers } = this;
    return observers.find(observer => observer.target === target);
  }

  register(target: VisibilityTarget): VisibilityObserver {
    const { observers } = this;
    let observer = this.getObserver(target);

    if (!observer) {
      observer = new VisibilityObserver(this, target);
      observer.update();
      observers.push(observer);
    }

    return observer;
  }

  unregister(target: VisibilityTarget): void {
    const { observers } = this;
    this.observers = observers.filter(observer => observer.target !== target);
  }

  update(): void {
    const { bleed, observers } = this;
    const { scrollTop, height } = viewport();
    const min = scrollTop - bleed;
    const max = scrollTop + height + bleed;

    if (this.max !== max || this.min !== min) {
      this.min = min;
      this.max = max;
      observers.forEach(observer => observer.update());
    }
  }

  updateTarget(target: VisibilityTarget): void {
    const observer = this.getObserver(target);
    if (observer) {
      observer.update();
    }
  }

  protected handleViewportEvent() {
    this.update();
  }
}
