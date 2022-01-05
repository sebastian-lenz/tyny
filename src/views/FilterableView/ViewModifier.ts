import { FilterableView } from './index';
import { getParentView, property, View, ViewOptions } from '../../core';
import { UrlParamValue } from '../../utils/types/Url';

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

  abstract getParams(): tyny.Map<UrlParamValue>;

  abstract sync(options: SyncOptions): boolean;
}
