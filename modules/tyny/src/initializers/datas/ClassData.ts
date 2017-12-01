import Data, { DataOptions } from '../Data';
import View from '../../View';

export interface ClassDataOptions<T = any> extends DataOptions<T> {
  type: 'class';

  // The constructor function of the class.
  ctor: { new (data: any): T };
}

export default class ClassData<T> extends Data<T, ClassDataOptions<T>> {
  // The constructor function of the class.
  ctor: { new (data: any): T };

  /**
   * Convert the given option value.
   */
  convert(scope: View, value: any): T {
    const { ctor } = this;
    if (value instanceof ctor) {
      return value;
    }

    return new ctor(value);
  }
}
