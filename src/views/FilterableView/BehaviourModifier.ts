import { Behaviour, BehaviourOptions } from '../../core/Behaviour';
import { UrlParamValue } from '../../utils/types/Url';

import type { FilterableView } from './index';
import type { Modifier, SyncOptions } from './Modifier';

export interface BehaviourModifierOptions extends BehaviourOptions {}

export abstract class BehaviourModifier<
    TView extends FilterableView = FilterableView
  >
  extends Behaviour<TView>
  implements Modifier
{
  constructor(view: TView, options: BehaviourModifierOptions = {}) {
    super(view, options);
  }

  softReset() {}

  abstract getParams(): tyny.Map<UrlParamValue>;

  abstract sync(options: SyncOptions): boolean;
}
