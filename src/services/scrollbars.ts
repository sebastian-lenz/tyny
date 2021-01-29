import { css } from '../utils/dom/style/css';
import { getScrollLeft } from '../utils/dom/window/getScrollLeft';
import { getScrollTop } from '../utils/dom/window/getScrollTop';

const origins: Array<any> = [];
let hasScrollbars: boolean = true;
let scrollBarSize: number = Number.NaN;
let scrollLeft: number = 0;
let scrollTop: number = 0;

function setScrollbars(value: boolean) {
  if (hasScrollbars === value) return;
  hasScrollbars = value;
  const { body } = document;

  if (value) {
    css(body, {
      position: null,
      paddingRight: null,
      width: null,
      left: null,
      top: null,
    });

    window.scrollTo(scrollLeft, scrollTop);
  } else {
    scrollLeft = getScrollLeft();
    scrollTop = getScrollTop();

    if (isNaN(scrollBarSize)) {
      const { offsetWidth } = body;
      css(body, { position: 'fixed', width: '100%' });
      scrollBarSize = body.offsetWidth - offsetWidth;
    }

    css(body, {
      position: 'fixed',
      paddingRight: `${scrollBarSize}px`,
      width: '100%',
      left: `${-scrollLeft}px`,
      top: `${-scrollTop}px`,
    });
  }
}

export function getScrollBarSize(): number {
  if (isNaN(scrollBarSize)) {
    setScrollbars(false);
    setScrollbars(true);
  }

  return scrollBarSize;
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