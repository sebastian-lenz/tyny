import { DelegateOptions } from 'tyny-events';

import { setInitializer } from '../initializers';
import View from '../View';

export default function delegate(
  eventName: string,
  options?: DelegateOptions
): MethodDecorator {
  return function<T>(
    target: Object,
    propertyKey: string | symbol,
    descriptor: TypedPropertyDescriptor<T>
  ) {
    const propertyName = propertyKey.toString();
    setInitializer(target, propertyName, function(view: View) {
      view.delegate(eventName, (<any>view)[propertyKey], options);
    });
  };
}
