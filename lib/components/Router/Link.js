import { createElement } from 'preact';
import { route } from './index';
function handleLinkClick(e) {
    if (e.ctrlKey || e.metaKey || e.altKey || e.shiftKey || e.button !== 0) {
        return;
    }
    routeFromLink(e.currentTarget || e.target || this);
    return prevent(e);
}
function prevent(e) {
    if (e) {
        if (e.stopImmediatePropagation)
            e.stopImmediatePropagation();
        if (e.stopPropagation)
            e.stopPropagation();
        e.preventDefault();
    }
    return false;
}
function routeFromLink(node) {
    // only valid elements
    if (!node || !node.getAttribute)
        return;
    const href = node.getAttribute('href');
    const target = node.getAttribute('target');
    // ignore links with targets and non-path URLs
    if (!href || !href.match(/^\//g) || (target && !target.match(/^_?self$/i))) {
        return;
    }
    // attempt to route, if no match simply cede control to browser
    return route(href);
}
export function delegateLinkHandler(e) {
    // ignore events the browser takes care of already:
    if (e.ctrlKey || e.metaKey || e.altKey || e.shiftKey || e.button !== 0) {
        return;
    }
    let t = e.target;
    while (t) {
        if (String(t.nodeName).toUpperCase() === 'A' && t.getAttribute('href')) {
            if (t.hasAttribute('data-native') || t.hasAttribute('native'))
                return;
            // if link is handled by the router, prevent browser defaults
            if (routeFromLink(t)) {
                return prevent(e);
            }
        }
        t = t.parentElement;
    }
}
export function Link(props) {
    return createElement('a', Object.assign(Object.assign({}, props), { onClick: handleLinkClick }));
}
