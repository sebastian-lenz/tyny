import { viewport, ViewportEvent } from 'tyny-services';

import { setInitializer } from '../initializers';
import View from '../View';

export default function scrollEvent(init?: boolean): MethodDecorator {
  return function<T>(
    target: Object,
    propertyKey: string | symbol,
    descriptor: TypedPropertyDescriptor<T>
  ) {
    const propertyName = propertyKey.toString();
    setInitializer(target, propertyName, function(view: View) {
      const listener = (<any>view)[propertyKey];
      const service = viewport();

      view.listenTo(service, 'scroll', listener);

      if (init) {
        listener.call(
          view,
          new ViewportEvent({
            target: service,
            type: ViewportEvent.scrollEvent,
          })
        );
      }
    });
  };
}
