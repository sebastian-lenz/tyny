import { Behaviour, BehaviourOptions } from '../Behaviour';
import type { View } from '../View';
export interface ClickBehaviourOptions extends BehaviourOptions {
    onClick?: (event: Event) => void;
}
export declare class ClickBehaviour<TView extends View = View> extends Behaviour<TView> {
    listeners: Array<Function> | null;
    onClick: ((event: Event) => void) | null;
    shouldPreventNextClick: boolean;
    constructor(view: TView, options: ClickBehaviourOptions);
    onDestroyed(): void;
    onViewClick(event: Event): void;
    preventNextClick(): void;
    static getClickBehaviour(view: View): ClickBehaviour<any> | null;
    static tryPreventNextClick(view: View): void;
}
