export function getScrollLeft() {
    return (window.pageXOffset ||
        (document.documentElement && document.documentElement.scrollLeft) ||
        document.body.scrollLeft);
}
