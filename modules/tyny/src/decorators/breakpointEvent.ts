import {
  breakpoints,
  Breakpoint,
  BreakpointsEvent,
} from 'tyny-services/lib/breakpoints';

import { setInitializer } from '../initializers';
import View from '../View';

export { Breakpoint, BreakpointsEvent };

export default function breakpointEvent(init?: boolean): MethodDecorator {
  return function<T>(
    target: Object,
    propertyKey: string | symbol,
    descriptor: TypedPropertyDescriptor<T>
  ) {
    const propertyName = propertyKey.toString();

    setInitializer(target, propertyName, function(view: View) {
      const listener = (<any>view)[propertyKey];
      const service = breakpoints();

      view.listenTo(service, BreakpointsEvent.changeEvent, listener);

      if (init) {
        listener.call(
          view,
          new BreakpointsEvent({
            breakpoint: service.current,
            type: BreakpointsEvent.changeEvent,
          })
        );
      }
    });
  };
}
