import { createElement } from 'preact';

import { RoutableProps } from './types';

export type AnyComponent<Props> =
  | preact.FunctionalComponent<Props>
  | preact.ComponentConstructor<Props, any>;

export interface RouteProps<Props> extends RoutableProps {
  component: AnyComponent<Props>;
}

export function Route<Props>(props: RouteProps<Props> & Partial<Props>) {
  return createElement(props.component, props as any);
}
