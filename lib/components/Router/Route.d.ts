import { RoutableProps } from './types';
export type AnyComponent<Props> = preact.FunctionalComponent<Props> | preact.ComponentConstructor<Props, any>;
export interface RouteProps<Props> extends RoutableProps {
    component: AnyComponent<Props>;
}
export declare function Route<Props>(props: RouteProps<Props> & Partial<Props>): import("preact").VNode<Props>;
