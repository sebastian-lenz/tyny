import { setInitializer } from '../initializers';
import { PointerList, PointerListEvent } from '../pointers';
import View from '../View';

export { PointerListEvent };

export default function pointerEvent(
  type: 'add' | 'commit' | 'remove' | 'update'
): MethodDecorator {
  return function<T>(
    target: Object,
    propertyKey: string | symbol,
    descriptor: TypedPropertyDescriptor<T>
  ) {
    const propertyName = propertyKey.toString();
    setInitializer(target, propertyName, function(view: View) {
      const pointerList = PointerList.forView(view);
      view.listenTo(pointerList, type, (<any>view)[propertyKey]);
    });
  };
}
