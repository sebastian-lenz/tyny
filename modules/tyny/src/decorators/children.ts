import { getInitializer } from '../initializers';
import { ChildOptions } from '../initializers/Child';

import child from './child';

function children(name: string, options: ChildOptions): ClassDecorator;
function children(options: ChildOptions): PropertyDecorator;
function children(this: any, ...args: any[]) {
  if (args.length > 0 && typeof args[0] === 'string') {
    args[1] = Object.assign(args[1] || {}, { multiple: true });
  } else {
    args[0] = Object.assign(args[0] || {}, { multiple: true });
  }

  return <any>child(...args);
}

export default children;
