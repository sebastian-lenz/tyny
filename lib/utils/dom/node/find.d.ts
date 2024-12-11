export type Selector = string | undefined | null;
export type SelectorContext = Document | Element | undefined | null;
export declare function find<T extends HTMLElement = HTMLElement>(selector: Selector, context?: SelectorContext): T | null;
export declare function findAll<T extends HTMLElement = HTMLElement>(selector: Selector, context?: SelectorContext): T[];
