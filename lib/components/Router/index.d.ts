import { Component } from 'preact';
import type { RouteMatch, RouterOnChangeArgs, RouterProps, RouterState, UrlInfo } from './types';
export declare const RouterContext: import("preact").Context<{} | RouterOnChangeArgs<import("./types").RouterPropsBase>>;
export declare function getCurrentUrl(): string;
export declare function route(url: string | UrlInfo, replace?: string | boolean): boolean;
export declare function useRouter(): [Partial<RouterOnChangeArgs>, typeof route];
export declare class Router<Props extends RouterProps = RouterProps> extends Component<Props, RouterState> {
    contextValue: RouterOnChangeArgs | {};
    previousUrl?: string;
    unlisten?: Function;
    updating: boolean;
    constructor(props: Props);
    shouldComponentUpdate(props: RouterProps): boolean;
    canRoute(url: string): boolean;
    routeTo(url: string): boolean;
    componentWillMount(): void;
    componentDidMount(): void;
    componentWillUnmount(): void;
    componentWillUpdate(): void;
    componentDidUpdate(): void;
    getCurrent(): import("preact").VNode<import("./types").RoutableProps>;
    getMatchingChildren(children: Array<any>, url: string, invoke?: boolean): RouteMatch[];
    onChange(context: RouterOnChangeArgs): RouterOnChangeArgs;
    render(): import("preact").JSX.Element;
}