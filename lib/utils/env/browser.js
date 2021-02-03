import { attr } from '../dom/attr/attr';
export var inBrowser = typeof window !== 'undefined';
export var isIE = inBrowser && /msie|trident/i.test(window.navigator.userAgent);
export var isRtl = inBrowser && attr(document.documentElement, 'dir') === 'rtl';
