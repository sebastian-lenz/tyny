import { __rest } from "tslib";
import cx from 'classnames';
import { createElement } from 'preact';
import { route, useRouter } from './index';
import { exec } from './utils';
function handleLinkClick(e) {
    if (e.ctrlKey || e.metaKey || e.altKey || e.shiftKey || e.button !== 0) {
        return;
    }
    if (routeFromLink(e.currentTarget || e.target || this)) {
        prevent(e);
    }
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
    if (!node || !node.getAttribute)
        return;
    const href = node.getAttribute('href');
    const target = node.getAttribute('target');
    if (!href || !href.match(/^\//g) || (target && !target.match(/^_?self$/i))) {
        return;
    }
    return route(href);
}
export function delegateLinkHandler(e) {
    if (e.ctrlKey || e.metaKey || e.altKey || e.shiftKey || e.button !== 0) {
        return;
    }
    let t = e.target;
    while (t) {
        if (String(t.nodeName).toUpperCase() === 'A' && t.getAttribute('href')) {
            if (t.hasAttribute('data-native') || t.hasAttribute('native'))
                return;
            if (routeFromLink(t)) {
                return prevent(e);
            }
        }
        t = t.parentElement;
    }
}
export function Link(_a) {
    var { activeClass, class: className, onClick: onClickCustom } = _a, props = __rest(_a, ["activeClass", "class", "onClick"]);
    if (activeClass) {
        const { href } = props;
        const { active = [] } = useRouter()[0];
        if (href && active.some(({ props }) => exec(href, props.path || '', {}))) {
            className = cx(className, activeClass);
        }
    }
    const onClick = onClickCustom
        ? function (event) {
            onClickCustom.call(this, event);
            event.defaultPrevented ? null : handleLinkClick.call(this, event);
        }
        : handleLinkClick;
    return createElement('a', Object.assign(Object.assign({}, props), { class: className, onClick }));
}
