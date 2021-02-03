export function getScrollTop() {
    return (window.pageYOffset ||
        (document.documentElement && document.documentElement.scrollTop) ||
        document.body.scrollTop);
}
