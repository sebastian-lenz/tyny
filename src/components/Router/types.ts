import type { VNode } from 'preact';

import type { Router } from './index';

export interface CustomHistory {
  getCurrentLocation?: Function;
  listen(callback: (location: Location) => void): () => void;
  location: Location;
  push(path: string): void;
  replace(path: string): void;
}

export interface RouteMatch {
  matches: { [name: string]: string };
  vnode: VNode<RoutableProps>;
}

export interface RoutableProps {
  path?: string;
  default?: boolean;
}

export type RouterPropsBase = Record<string, string | undefined> | null;

export interface RouterProps<
  RouteParams extends RouterPropsBase = RouterPropsBase
> extends RoutableProps {
  history?: CustomHistory;
  static?: boolean;
  url?: string;
  onBeforeChange?: (url: string) => void;
  onChange?: (args: RouterOnChangeArgs<RouteParams>) => void;
}

export interface RouterState {
  url: string;
}

export interface RouterOnChangeArgs<
  RouteParams extends RouterPropsBase = RouterPropsBase
> {
  router: Router;
  url: string;
  previous?: string;
  active: preact.VNode<RoutableProps>[];
  current: preact.VNode<RoutableProps>;
  path: string | null;
  matches: RouteParams;
}

export interface UrlInfo {
  url: string;
  replace?: boolean;
}
