export abstract class Effect {
  from: HTMLElement | null = null;
  to: HTMLElement | null = null;
  value: number = Number.NaN;

  apply(from: HTMLElement | null, to: HTMLElement | null, value: number) {
    const { from: lastFrom, to: lastTo, value: lastValue } = this;
    if (lastFrom === from && lastTo === to && lastValue === value) {
      return;
    }

    if (lastFrom !== from) {
      this.from = from;
      if (lastFrom && lastFrom !== to) this.unbindElement(lastFrom);
      if (from) this.bindElement(from);
    }

    if (lastTo !== to) {
      this.to = to;
      if (lastTo && lastTo !== from) this.unbindElement(lastTo);
      if (to) this.bindElement(to);
    }

    if (from) {
      this.applyFrom(from, value);
    }

    if (to) {
      this.applyTo(to, value);
    }
  }

  clear() {
    const { from, to } = this;
    this.from = null;
    this.to = null;

    if (from) {
      this.unbindElement(from);
    }

    if (to) {
      this.unbindElement(to);
    }
  }

  protected applyFrom(element: HTMLElement, value: number) {}

  protected applyTo(element: HTMLElement, value: number) {}

  protected bindElement(element: HTMLElement) {
    element.classList.add('effect');
  }

  protected unbindElement(element: HTMLElement) {
    element.classList.remove('effect');
    this.clearElement(element);
  }

  protected clearElement(element: HTMLElement) {}
}
