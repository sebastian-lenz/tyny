import { setInitializer } from '../initializers';
import initData, { InitDataOptions } from '../initializers/initData';

function data<T>(name: string, options: InitDataOptions<T>): ClassDecorator;
function data<T>(options: InitDataOptions<T>): PropertyDecorator;
function data() {
  if (arguments.length > 0 && typeof arguments[0] === 'string') {
    const property = <string>arguments[0];
    const options = arguments[1];
    return function(owner: Function) {
      setInitializer(owner, property, initData(property, options));
    };
  } else {
    const options = arguments[0];
    return function(owner: object, property: string) {
      setInitializer(owner, property, initData(property, options));
    };
  }
}

export default data;
