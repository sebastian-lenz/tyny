import { Behaviour, BehaviourOptions } from '../../core/Behaviour';

import type { FilterableView, FilterableViewParams } from './index';
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

  abstract getParams(): FilterableViewParams;

  abstract sync(options: SyncOptions): boolean;
}
