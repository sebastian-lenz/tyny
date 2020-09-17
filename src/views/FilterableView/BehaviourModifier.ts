import { Behaviour, BehaviourOptions } from '../../core/Behaviour';

import type { FilterableView } from './index';
import type { Modifier } from './Modifier';
import type { Url } from '../../utils/types/Url';

export interface BehaviourModifierOptions extends BehaviourOptions {}

export abstract class BehaviourModifier<
    TView extends FilterableView = FilterableView
  >
  extends Behaviour<TView>
  implements Modifier {
  //
  constructor(view: TView, options: BehaviourModifierOptions = {}) {
    super(view, options);
  }

  softReset() {}

  abstract getParams(): tyny.Map<string | null>;

  abstract sync(url: Url): boolean;
}
