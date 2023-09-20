export interface Props extends preact.JSX.HTMLAttributes<HTMLAnchorElement> {
    activeClass?: string;
}
export declare function delegateLinkHandler(e: MouseEvent): boolean | undefined;
export declare function Link({ activeClass, class: className, onClick: onClickCustom, ...props }: Props): import("preact").VNode<any>;
