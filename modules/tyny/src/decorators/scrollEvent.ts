import { viewport } from 'tyny-services';

import { setInitializer } from '../initializers';
import View from '../View';

export default function scrollEvent(): MethodDecorator {
  return function<T>(
    target: Object,
    propertyKey: string | symbol,
    descriptor: TypedPropertyDescriptor<T>
  ) {
    const propertyName = propertyKey.toString();
    setInitializer(target, propertyName, function(view: View) {
      view.listenTo(viewport(), 'scroll', (<any>view)[propertyKey]);
    });
  };
}
