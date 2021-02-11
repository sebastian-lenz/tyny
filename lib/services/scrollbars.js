import { css } from '../utils/dom/style/css';
import { getScrollLeft } from '../utils/dom/window/getScrollLeft';
import { getScrollTop } from '../utils/dom/window/getScrollTop';
const origins = [];
let _hasScrollbars = true;
let _scrollBarSize = Number.NaN;
let _scrollLeft = 0;
let _scrollTop = 0;
function setScrollbars(value) {
    if (_hasScrollbars === value)
        return;
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
    }
    else {
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
}
export function getScrollBarSize() {
    if (isNaN(_scrollBarSize)) {
        setScrollbars(false);
        setScrollbars(true);
    }
    return _scrollBarSize;
}
export function hasScrollbars() {
    return _hasScrollbars;
}
export function toggleScrollbars(origin, enabled) {
    const index = origins.indexOf(origin);
    if (!enabled && index === -1) {
        origins.push(origin);
    }
    else if (enabled && index !== -1) {
        origins.splice(index, 1);
    }
    setScrollbars(origins.length === 0);
}
