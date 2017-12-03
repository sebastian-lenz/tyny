import { Delegate } from 'tyny-events';

import { dispatcher, DispatcherEvent } from '../dispatcher';

import ViewportEvent from './ViewportEvent';

/**
 * Test whether pageXOffset and pageYOffset are available on the window object.
 */
const supportsPageOffset = 'pageXOffset' in window;

/**
 * Test whether stupid IE is in css compat mode.
 */
const isCSS1Compat = (document.compatMode || '') === 'CSS1Compat';

/**
 * A service that triggers events on browser resize and document scroll actions.
 *
 * Both the resize and scrolling events will be synchronized with an animation frame
 * event to speed up page rendering.
 */
export default class Viewport extends Delegate {
  // The underlying element of this delegate.
  element: HTMLElement;

  // The height of the viewport.
  height: number = 0;

  // The size of the scrollbar. Only available after disabling the scrollbars once.
  scrollBarSize: number = Number.NaN;

  // The horizontal scroll position of the document.
  scrollLeft: number = 0;

  // The vertical scroll position of the document.
  scrollTop: number = 0;

  // The width of the viewport.
  width: number = 0;

  // Whether the scroll position of the document has changed or not.
  protected hasScrollChanged: boolean;

  // Whether the size of the viewport has changed or not.
  protected hasSizeChanged: boolean;

  // A list of initiators that have disabled the scrollbars of the document.
  protected scrollInitiators: any[] = [];

  /**
   * Viewport constructor.
   */
  constructor() {
    super(window);

    this.delegate('resize', this.handleResize);
    this.delegate('scroll', this.handleScroll);
    this.listenTo(dispatcher(), DispatcherEvent.frameEvent, this.handleFrame);

    this.handleResize();
    this.handleScroll();
    this.hasSizeChanged = false;
    this.hasScrollChanged = false;
  }

  /**
   * Disable the document scrollbars.
   *
   * @param initiator
   *   An identifier of the service or class that disables the scrollbars.
   *   Same value must be passed to enableScrolling, used to manage multiple
   *   scripts that turn scrolling on or off.
   */
  disableScrollbars(initiator: any) {
    const { element, scrollInitiators } = this;
    let { scrollBarSize } = this;

    const index = scrollInitiators.indexOf(initiator);
    if (index === -1) {
      scrollInitiators.push(initiator);
    }

    if (scrollInitiators.length === 1) {
      const { style } = element;
      if (isNaN(scrollBarSize)) {
        const { offsetWidth } = element;
        style.overflow = 'hidden';
        scrollBarSize = element.offsetWidth - offsetWidth;
        this.scrollBarSize = scrollBarSize;
      } else {
        style.overflow = 'hidden';
      }

      style.paddingRight = `${scrollBarSize}px`;
      this.handleResize();
      this.emitViewportEvent(ViewportEvent.scrollbarsEvent);
    }
  }

  /**
   * Enable the document scrollbars.
   *
   * @param initiator
   *   An identifier of the service or class that enabled the scrollbars.
   */
  enableScrollbars(initiator: any) {
    const { element, scrollInitiators } = this;
    const index = scrollInitiators.indexOf(initiator);
    if (index !== -1) {
      scrollInitiators.splice(index, 1);
    }

    if (scrollInitiators.length === 0) {
      element.style.overflow = '';
      element.style.paddingRight = '';
      this.handleResize();
      this.emitViewportEvent(ViewportEvent.scrollbarsEvent);
    }
  }

  setScrollLeft(value: number) {
    if (this.scrollLeft === value) return;
    window.scrollTo(value, this.scrollTop);
  }

  setScrollTop(value: number) {
    if (this.scrollTop === value) return;
    window.scrollTo(this.scrollLeft, value);
  }

  /**
   * Trigger a resize event.
   */
  triggerResize() {
    this.hasSizeChanged = true;
  }

  protected emitViewportEvent(type: string) {
    const { width, height, scrollInitiators, scrollLeft, scrollTop } = this;
    this.emit(
      new ViewportEvent({
        hasScrollbars: scrollInitiators.length === 0,
        height,
        scrollLeft,
        scrollTop,
        type,
        width,
      })
    );
  }

  /**
   * Triggered on every page repaint.
   */
  protected handleFrame() {
    if (this.hasSizeChanged) {
      this.hasSizeChanged = false;
      const width = this.width;
      const height = this.height;
      this.emitViewportEvent(ViewportEvent.resizeEvent);
    }

    if (this.hasScrollChanged) {
      this.hasScrollChanged = false;
      const scrollLeft = this.scrollLeft;
      const scrollTop = this.scrollTop;
      this.emitViewportEvent(ViewportEvent.scrollEvent);
    }
  }

  /**
   * Triggered after the size of the window has changed.
   */
  protected handleResize() {
    const width = Math.max(document.documentElement.clientWidth, 0);
    const height = Math.max(document.documentElement.clientHeight, 0);

    if (this.width != width || this.height != height) {
      this.width = width;
      this.height = height;
      this.hasSizeChanged = true;
    }
  }

  /**
   * Triggered after the scroll position of the document has changed.
   */
  protected handleScroll() {
    const scrollLeft = supportsPageOffset
      ? window.pageXOffset
      : isCSS1Compat
        ? document.documentElement.scrollLeft
        : document.body.scrollLeft;

    const scrollTop = supportsPageOffset
      ? window.pageYOffset
      : isCSS1Compat
        ? document.documentElement.scrollTop
        : document.body.scrollTop;

    if (this.scrollLeft != scrollLeft || this.scrollTop != scrollTop) {
      this.scrollLeft = scrollLeft;
      this.scrollTop = scrollTop;
      this.hasScrollChanged = true;
    }
  }
}
