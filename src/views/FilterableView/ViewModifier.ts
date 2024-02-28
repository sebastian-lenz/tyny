import { FilterableView, FilterableViewParams } from './index';
import { getParentView, property, View, ViewOptions } from '../../core';

import type { Modifier, SyncOptions } from './Modifier';

export interface ViewModifierOptions extends ViewOptions {}

export abstract class ViewModifier extends View implements Modifier {
  constructor(options: ViewModifierOptions = {}) {
    super(options);
  }

  @property()
  get target(): FilterableView | null {
    return getParentView(this.el, FilterableView);
  }

  softReset() {}

  abstract getParams(): FilterableViewParams;

  abstract sync(options: SyncOptions): boolean;
}
