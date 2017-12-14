import { viewport } from 'tyny-services';

import { setInitializer } from '../initializers';
import View from '../View';

export default function windowPointerDownEvent(): MethodDecorator {
  return function<T>(
    target: Object,
    propertyKey: string | symbol,
    descriptor: TypedPropertyDescriptor<T>
  ) {
    const propertyName = propertyKey.toString();
    setInitializer(target, propertyName, function(view: View) {
      const callback = (<any>view)[propertyKey];
      const service = viewport();

      if ('PointerEvent' in window) {
        service.delegate('pointerdown', callback, { scope: view });
      } else {
        if ('ontouchstart' in window) {
          service.delegate('touchstart', callback, { scope: view });
        }

        service.delegate('mousedown', callback, { scope: view });
      }
    });
  };
}
