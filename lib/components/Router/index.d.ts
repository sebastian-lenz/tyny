import { Component, RenderableProps } from 'preact';
import type { RouteMatch, RouterOnChangeArgs, RouterProps, RouterState, UrlInfo } from './types';
export declare function getCurrentUrl(): string;
export declare function route(url: string | UrlInfo, replace?: string | boolean): boolean;
export declare function useRouter(): {}[];
export declare class Router extends Component<RouterProps, RouterState> {
    contextValue: RouterOnChangeArgs | {};
    previousUrl?: string;
    unlisten?: Function;
    updating: boolean;
    constructor(props: RouterProps);
    shouldComponentUpdate(props: RouterProps): boolean;
    /** Check if the given URL can be matched against any children */
    canRoute(url: string): boolean;
    /** Re-render children with a new URL to match against. */
    routeTo(url: string): boolean;
    componentWillMount(): void;
    componentDidMount(): void;
    componentWillUnmount(): void;
    componentWillUpdate(): void;
    componentDidUpdate(): void;
    getMatchingChildren(children: Array<any>, url: string, invoke?: boolean): RouteMatch[];
    render({ children, onChange }: RenderableProps<RouterProps>, { url }: RouterState): import("preact").JSX.Element;
}
