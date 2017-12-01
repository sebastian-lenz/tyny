import Data, { DataOptions } from '../Data';
import View, { MaybeView, ViewOptions } from '../../View';

export interface OwnerDataOptions extends DataOptions<MaybeView> {
  type: 'owner';
}

export default class OwnerData extends Data<MaybeView, OwnerDataOptions> {
  /**
   * Extract the value from the given view and options object.
   */
  getValue(scope: View, options: ViewOptions): View | undefined {
    return options.owner;
  }
}
