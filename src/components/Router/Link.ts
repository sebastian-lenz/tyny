import cx from 'classnames';
import { createElement, JSX } from 'preact';

import { route, useRouter } from './index';
import { exec } from './utils';

export interface Props
  extends Omit<preact.JSX.AnchorHTMLAttributes<HTMLAnchorElement>, 'href'> {
  activeClass?: string;
  href?: string;
}

function handleLinkClick(
  this: HTMLAnchorElement,
  e: JSX.TargetedMouseEvent<HTMLAnchorElement>
) {
  if (e.ctrlKey || e.metaKey || e.altKey || e.shiftKey || e.button !== 0) {
    return;
  }

  if (routeFromLink(e.currentTarget || e.target || this)) {
    prevent(e);
  }
}

function prevent(e?: Event) {
  if (e) {
    if (e.stopImmediatePropagation) e.stopImmediatePropagation();
    if (e.stopPropagation) e.stopPropagation();
    e.preventDefault();
  }

  return false;
}

function routeFromLink(node: any) {
  // only valid elements
  if (!node || !node.getAttribute) return;

  const href = node.getAttribute('href');
  const target = node.getAttribute('target');

  // ignore links with targets and non-path URLs
  if (!href || !href.match(/^\//g) || (target && !target.match(/^_?self$/i))) {
    return;
  }

  // attempt to route, if no match simply cede control to browser
  return route(href);
}

export function delegateLinkHandler(e: MouseEvent) {
  // ignore events the browser takes care of already:
  if (e.ctrlKey || e.metaKey || e.altKey || e.shiftKey || e.button !== 0) {
    return;
  }

  let t = e.target as Element | null;
  while (t) {
    if (String(t.nodeName).toUpperCase() === 'A' && t.getAttribute('href')) {
      if (t.hasAttribute('data-native') || t.hasAttribute('native')) return;
      // if link is handled by the router, prevent browser defaults
      if (routeFromLink(t)) {
        return prevent(e);
      }
    }

    t = t.parentElement;
  }
}

export function Link({
  activeClass,
  class: className,
  onClick: onClickCustom,
  ...props
}: Props) {
  if (activeClass) {
    const { href } = props;
    const { active = [] } = useRouter()[0];

    if (href && active.some(({ props }) => exec(href, props.path || '', {}))) {
      className = cx(className, activeClass);
    }
  }

  const onClick = onClickCustom
    ? function (
        this: HTMLAnchorElement,
        event: JSX.TargetedMouseEvent<HTMLAnchorElement>
      ) {
        onClickCustom.call(this as never, event);
        event.defaultPrevented ? null : handleLinkClick.call(this, event);
      }
    : handleLinkClick;

  return createElement('a', {
    ...props,
    class: className,
    onClick,
  } as any);
}
