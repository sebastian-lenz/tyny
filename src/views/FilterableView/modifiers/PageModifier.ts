import { attr } from '../../../utils/dom/attr';
import { event } from '../../../core/decorators/event';
import { FilterableView, FilterableViewParams } from '../index';
import { SyncOptions } from '../Modifier';
import { toInt } from '../../../utils/lang/number/toInt';
import { Url } from '../../../utils/types/Url';

import {
  BehaviourModifier,
  BehaviourModifierOptions,
} from '../BehaviourModifier';

export interface PageModifierOptions extends BehaviourModifierOptions {
  paramName?: string;
}

export class PageModifier extends BehaviourModifier {
  paramName: string;
  value: number = 1;

  constructor(view: FilterableView, options: PageModifierOptions = {}) {
    super(view, options);

    const { paramName = 'page' } = options;
    this.paramName = paramName;
  }

  getParams(): FilterableViewParams {
    const { paramName, value } = this;
    return {
      [paramName]: value > 1 ? `${value}` : null,
    };
  }

  getUrl(page: number): string {
    const { paramName, view } = this;
    return view.getUrl({
      [paramName]: page > 1 ? `${page}` : null,
    });
  }

  setPage(value: number) {
    if (this.value !== value) {
      this.value = value;
      this.view.commit();
    }
  }

  softReset() {
    this.setPage(1);
  }

  sync({ url }: SyncOptions): boolean {
    const page = url.getParam(this.paramName, 1);
    const value = typeof page === 'number' ? page : parseInt(`${page}`);

    if (this.value === value) {
      return false;
    }

    this.value = value;
    return true;
  }

  // Protected methods
  // -----------------

  @event({ name: 'click', selector: '*[data-filter-page]' })
  protected onPageClick(event: tyny.DelegateEvent) {
    const href = attr(event.current, 'href') || '';
    const page = toInt(Url.create(href).getParam(this.paramName, '1'));

    this.setPage(page);
    event.preventDefault();
  }
}
