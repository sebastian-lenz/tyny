export declare type Label<T> = (el: T) => string;
export interface Options<T extends HTMLElement = HTMLElement> {
    className: string;
    element: T;
    groupLabel: Label<HTMLOptGroupElement>;
    optionLabel: Label<HTMLOptionElement>;
}
export declare const template: (options: Options<HTMLSelectElement>) => string;
