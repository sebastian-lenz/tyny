import components from '../components';

export interface ComponentOptions {
  allowChildComponents?: boolean;
}

export default function component(
  selector: string,
  options: ComponentOptions = {}
): ClassDecorator {
  return function<T extends Function>(target: T) {
    components.registerComponent({
      allowChildComponents: false,
      ...options,
      selector,
      viewClass: <any>target,
    });
  };
}
