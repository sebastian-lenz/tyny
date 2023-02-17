import { Selector, SelectorContext } from './find';
import type { View, ViewClass } from '../../../core';
export declare function findView<T extends View>(selector: Selector, context?: SelectorContext, ctor?: string | ViewClass<T>): T | null;
export declare function findAllViews<T extends View>(selector: Selector, context?: SelectorContext, ctor?: string | ViewClass<T>): T[];
