import { registerView } from '../components';

export function component(
  options: {
    className?: string;
    name?: string;
  } = {}
): ClassDecorator {
  return function (ctor: Function) {
    registerView(options.name || ctor.name, ctor as any, options);
  };
}
