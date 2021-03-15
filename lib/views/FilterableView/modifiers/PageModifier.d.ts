import { FilterableView } from '../index';
import { SyncOptions } from '../Modifier';
import { BehaviourModifier, BehaviourModifierOptions } from '../BehaviourModifier';
export interface PageModifierOptions extends BehaviourModifierOptions {
    paramName?: string;
}
export declare class PageModifier extends BehaviourModifier {
    paramName: string;
    value: number;
    constructor(view: FilterableView, options?: PageModifierOptions);
    getParams(): tyny.Map<string | null>;
    getUrl(page: number): string;
    setPage(value: number): void;
    softReset(): void;
    sync({ url }: SyncOptions): boolean;
    protected onPageClick(event: tyny.DelegateEvent): void;
}