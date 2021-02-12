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

export interface ScrollbarsEventArgs {
  hasScrollbars: boolean;
  scrollBarSize: number;
}

function setScrollbars(value: boolean) {
  if (_hasScrollbars === value) return;
  _hasScrollbars = value;
  const { body } = document;

  if (value) {
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
      css(body, { position: 'fixed', width: '100%' });
      _scrollBarSize = body.offsetWidth - offsetWidth;
    }

    css(body, {
      position: 'fixed',
      paddingRight: `${_scrollBarSize}px`,
      width: '100%',
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
