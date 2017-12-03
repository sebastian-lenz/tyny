import { setInitializer } from '../initializers';
import initChild, { InitChildOptions } from '../initializers/initChild';

function child(name: string, options?: InitChildOptions): ClassDecorator;
function child(options?: InitChildOptions): PropertyDecorator;
function child(...args: any[]) {
  if (args.length > 0 && typeof args[0] === 'string') {
    const property = <string>args.shift();
    const options = args.length ? args.shift() : {};
    const name = `ChildComponent::${property}`;

    return function(owner: any) {
      const initializer = initChild(property, options);
      setInitializer(owner.prototype, name, initializer);
    };
  } else {
    const options = args.length ? args.shift() : {};

    return function(owner: any, property: string) {
      const name = `ChildComponent::${property}`;
      const initializer = initChild(property, options);
      setInitializer(owner, name, initializer);
    };
  }
}

export default child;
