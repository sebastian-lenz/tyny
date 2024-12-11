export interface Props extends Omit<preact.JSX.AnchorHTMLAttributes<HTMLAnchorElement>, 'href'> {
    activeClass?: string;
    href?: string;
}
export declare function delegateLinkHandler(e: MouseEvent): boolean | undefined;
export declare function Link({ activeClass, class: className, onClick: onClickCustom, ...props }: Props): import("preact").VNode<any>;
