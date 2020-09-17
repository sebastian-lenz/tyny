import { FilterableView } from './index';
import { getParentView, property, View, ViewOptions } from '../../core';

import type { Modifier } from './Modifier';
import type { Url } from '../../utils/types/Url';

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

  abstract getParams(): tyny.Map<string | null>;

  abstract sync(url: Url): boolean;
}
