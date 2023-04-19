import { trigger } from '../utils/dom/event';
import { css } from '../utils/dom/style/css';
import { getScrollLeft } from '../utils/dom/window/getScrollLeft';
import { getScrollTop } from '../utils/dom/window/getScrollTop';

const origins: Array<any> = [];
let _hasScrollbars: boolean = true;
let _scrollBarSize: number = Number.NaN;
let _scrollLeft: number = 0;
let _scrollTop: number = 0;

export const scrollbarsChangeEvent = 'tyny:scrollbarsChange';

export const scrollbarOptions = {
  classOptions: null as { className: string; target: HTMLElement } | null,
  scrollbarProp: '' as string | { (value: number): void },
};

export interface ScrollbarsEventArgs {
  hasScrollbars: boolean;
  scrollBarSize: number;
}

function disable() {
  const { body } = document;
  const { classOptions } = scrollbarOptions;

  classOptions
    ? classOptions.target.classList.add(classOptions.className)
    : css(body, { position: 'fixed', width: '100%' });
}

function setScrollbars(value: boolean) {
  if (_hasScrollbars === value) return;
  _hasScrollbars = value;
  const { body } = document;
  const { classOptions, scrollbarProp } = scrollbarOptions;

  if (value) {
    if (classOptions) {
      classOptions.target.classList.remove(classOptions.className);
    }

    css(body, {
      position: null,
      paddingRight: null,
      width: null,
      left: null,
      top: null,
    });

    window.scrollTo(_scrollLeft, _scrollTop);
  } else {
    _scrollLeft = getScrollLeft();
    _scrollTop = getScrollTop();

    if (isNaN(_scrollBarSize)) {
      const { offsetWidth } = body;
      disable();
      _scrollBarSize = body.offsetWidth - offsetWidth;

      if (typeof scrollbarProp === 'function') {
        scrollbarProp(_scrollBarSize);
      } else if (scrollbarProp) {
        body.style.setProperty(scrollbarProp, `${value}px`);
      }
    } else {
      disable();
    }

    css(body, {
      paddingRight: `${_scrollBarSize}px`,
      left: `${-_scrollLeft}px`,
      top: `${-_scrollTop}px`,
    });
  }

  trigger(body, scrollbarsChangeEvent, {
    hasScrollbars: _hasScrollbars,
    scrollBarSize: _scrollBarSize,
  });
}

export function getScrollBarSize(): number {
  if (isNaN(_scrollBarSize)) {
    setScrollbars(false);
    setScrollbars(true);
  }

  return _scrollBarSize;
}

export function hasScrollbars(): boolean {
  return _hasScrollbars;
}

export function toggleScrollbars(origin: any, enabled: boolean) {
  const index = origins.indexOf(origin);
  if (!enabled && index === -1) {
    origins.push(origin);
  } else if (enabled && index !== -1) {
    origins.splice(index, 1);
  }

  setScrollbars(origins.length === 0);
}

export function resetScrollbars() {
  if (origins.length) {
    origins.length = 0;
    setScrollbars(true);
  }
}
