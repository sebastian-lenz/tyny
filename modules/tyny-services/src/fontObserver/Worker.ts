import { View, ViewOptions } from 'tyny';
import FontObserver from './FontObserver';

export interface WorkerOptions extends ViewOptions {
  markup: string;
  observer: FontObserver;
}

export default class Worker extends View {
  observer: FontObserver;
  isReset: boolean = false;
  content: HTMLDivElement;
  innerWrapper: HTMLDivElement;
  innerContent: HTMLDivElement;

  constructor(options: WorkerOptions) {
    super({
      ...options,
      appendTo: document.body,
    });

    const { element } = this;
    element.style.position = 'absolute';
    element.style.left = '-1024px';
    element.style.top = '-1024px';
    element.style.overflow = 'hidden';

    const inner = (this.innerContent = document.createElement('div'));
    const wrapper = (this.innerWrapper = document.createElement('div'));
    wrapper.style.position = 'absolute';
    wrapper.style.overflow = 'hidden';
    wrapper.style.width = '100%';
    wrapper.style.height = '100%';
    wrapper.appendChild(inner);

    const content = (this.content = document.createElement('div'));
    content.style.position = 'relative';
    content.innerHTML = options.markup;
    content.appendChild(wrapper);

    this.observer = options.observer;
    this.element.appendChild(content);
    this.reset();

    this.element.addEventListener('scroll', () => this.onScroll());
    wrapper.addEventListener('scroll', () => this.onScroll());
  }

  reset() {
    this.isReset = true;

    const { content, element, innerContent, innerWrapper } = this;
    const width = content.offsetWidth;
    const height = content.offsetHeight;

    element.style.width = width - 1 + 'px';
    element.style.height = height - 1 + 'px';
    element.scrollLeft = element.scrollWidth - width - 1;
    element.scrollTop = element.scrollHeight - height - 1;

    innerContent.style.width = width + 1 + 'px';
    innerContent.style.height = height + 1 + 'px';
    innerContent.scrollLeft = innerWrapper.scrollWidth - width + 1;
    innerContent.scrollTop = innerWrapper.scrollHeight - height + 1;

    this.isReset = false;
  }

  onScroll() {
    if (this.isReset) return;
    this.observer.handleFontLoaded();

    this.reset();
  }
}
