import { getInitializer } from '../initializers';
import Child, { ChildOptions } from '../initializers/Child';

function child(name: string, options?: ChildOptions): ClassDecorator;
function child(options?: ChildOptions): PropertyDecorator;
function child(...args: any[]) {
  if (args.length > 0 && typeof args[0] === 'string') {
    const property = <string>args.shift();
    const options = args.length ? args.shift() : {};
    const name = `ChildComponent::${property}`;

    return function(owner: any) {
      getInitializer(
        owner.prototype,
        name,
        () => new Child(property)
      ).setOptions(options);
    };
  } else {
    const options = args.length ? args.shift() : {};

    return function(owner: any, property: string) {
      const name = `ChildComponent::${property}`;
      getInitializer(owner, name, () => new Child(property)).setOptions(
        options
      );
    };
  }
}

export default child;
