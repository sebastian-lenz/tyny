import { DelegatedEvent, DelegateOptions } from 'tyny-events';

import { setInitializer } from '../initializers';
import View from '../View';

export { DelegatedEvent };

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
      eventName
        .split(' ')
        .forEach(name =>
          view.delegate(name, (<any>view)[propertyKey], options)
        );
    });
  };
}