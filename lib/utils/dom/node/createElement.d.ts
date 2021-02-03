export interface CreateElementOptions {
    appendTo?: HTMLElement;
    attributes?: {
        [name: string]: string;
    };
    className?: string;
    extraClassName?: string;
    prependTo?: HTMLElement;
    tagName?: string;
    template?: string | Function;
}
export declare function createElement(options: CreateElementOptions): HTMLElement;
