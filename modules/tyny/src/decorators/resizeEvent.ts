import { setInitializer } from '../initializers';
import View from '../View';

export interface ResizeEventOptions {}

export default function resizeEvent(beforeChildren?: boolean): MethodDecorator {
  return function<T>(
    target: Object,
    propertyKey: string | symbol,
    descriptor: TypedPropertyDescriptor<T>
  ) {
    const propertyName = propertyKey.toString();
    setInitializer(target, propertyName, function(view: View) {
      const node = view.getComponentNode();
      node.setResizeHandler((<any>view)[propertyKey], beforeChildren);
    });
  };
}
