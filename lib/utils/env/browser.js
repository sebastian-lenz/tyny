import { attr } from '../dom/attr/attr';
export const inBrowser = typeof window !== 'undefined';
export const isIE = inBrowser && /msie|trident/i.test(window.navigator.userAgent);
export const isRtl = inBrowser && attr(document.documentElement, 'dir') === 'rtl';
