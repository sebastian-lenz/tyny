import { inBrowser } from '../utils/env/browser';
import { isInViewport } from '../utils/dom/window/isInViewport';
import { on } from '../utils/dom/event/on';
import { toFloat } from '../utils/lang/number/toFloat';

export class IntersectionObserverClass implements IntersectionObserver {
  readonly root: Element | null;
  readonly rootMargin: string;
  readonly thresholds: ReadonlyArray<number>;

  private apply: { (): void };
  private off?: Function;
  private offsetTop: number;
  private offsetLeft: number;
  private targets: IntersectionObserverEntry[];

  constructor(
    callback: IntersectionObserverCallback,
    { rootMargin = '0 0' }: IntersectionObserverInit = {}
  ) {
    let pending: number | false = false;

    const [offsetTop, offsetLeft] = (rootMargin || '0 0')
      .split(' ')
      .map(toFloat);

    this.root = null;
    this.rootMargin = rootMargin;
    this.thresholds = [];
    this.targets = [];
    this.offsetTop = offsetTop;
    this.offsetLeft = offsetLeft;

    this.apply = () => {
      if (pending) {
        return;
      }

      pending = requestAnimationFrame(() =>
        setTimeout(() => {
          const records = this.takeRecords();
          if (records.length) {
            callback(records, this);
          }

          pending = false;
        })
      );
    };

    if (inBrowser) {
      this.off = on(window, 'scroll resize load', this.apply, {
        passive: true,
        capture: true,
      });
    }
  }

  disconnect() {
    this.targets = [];
    if (this.off) {
      this.off();
    }
  }

  observe(target: HTMLElement) {
    this.targets.push({
      target,
      isIntersecting: null,
    } as any);

    this.apply();
  }

  takeRecords() {
    return this.targets.filter((entry: any) => {
      const inView = isInViewport(
        entry.target,
        this.offsetTop,
        this.offsetLeft
      );

      if (inView !== entry.isIntersecting) {
        entry.isIntersecting = inView;
        return true;
      }
    });
  }

  unobserve(element: HTMLElement) {
    this.targets = this.targets.filter((target) => target.target !== element);
  }
}

export const IntersectionObserver =
  (inBrowser && window.IntersectionObserver) || IntersectionObserverClass;

export interface VisibilityCallback {
  (value: boolean): void;
  isIntersecting?: boolean;
}

export interface VisibilityTarget {
  el: Element;
  setVisible: VisibilityCallback;
}

export class VisibilityObserver {
  isPrinting: boolean = false;
  observer: IntersectionObserver;
  targets: VisibilityTarget[] = [];

  constructor() {
    const callback = (entries: IntersectionObserverEntry[]) => {
      const { isPrinting, targets } = this;

      for (const target of targets) {
        for (const entry of entries) {
          if (target.el === entry.target) {
            target.setVisible(entry.isIntersecting || isPrinting);
            target.setVisible.isIntersecting = entry.isIntersecting;
            break;
          }
        }
      }
    };

    if (typeof window !== 'undefined') {
      on(window, 'afterprint', this.onAfterPrint, { scope: this });
      on(window, 'beforeprint', this.onBeforePrint, { scope: this });
    }

    this.observer = new IntersectionObserver(callback, {
      rootMargin: '500px 0px',
    });
  }

  hasTargets(el: Element) {
    return this.targets.some((target) => target.el === el);
  }

  observe(target: VisibilityTarget) {
    const isObserved = this.hasTargets(target.el);
    this.targets.push(target);

    if (!isObserved) {
      this.observer.observe(target.el);
    }
  }

  onAfterPrint() {
    this.isPrinting = false;
    this.updateTargets();
  }

  onBeforePrint() {
    this.isPrinting = true;
    this.updateTargets();
  }

  unobserve(target: VisibilityTarget) {
    this.targets = this.targets.filter((value) => value !== target);

    if (!this.hasTargets(target.el)) {
      this.observer.unobserve(target.el);
    }
  }

  updateTargets() {
    const { isPrinting, targets } = this;

    for (const target of targets) {
      target.setVisible(target.setVisible.isIntersecting || isPrinting);
    }
  }
}

export const visibility = new VisibilityObserver();
