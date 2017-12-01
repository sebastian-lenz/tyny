import components from '../services/components';

export default function component(selector: string): ClassDecorator {
  return function<T extends Function>(target: T) {
    components.registerComponent({
      selector,
      viewClass: <any>target,
    });
  };
}
