export interface Props extends preact.JSX.HTMLAttributes {
    activeClassName?: string;
}
export declare function delegateLinkHandler(e: MouseEvent): boolean | undefined;
export declare function Link(props: Props): import("preact").VNode<any>;
