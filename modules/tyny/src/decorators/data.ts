import createDataInitializer, { DataOptions } from '../initializers/datas';

function data(name: string, options: DataOptions): ClassDecorator;
function data(options: DataOptions): PropertyDecorator;
function data() {
  if (arguments.length > 0 && typeof arguments[0] === 'string') {
    const property = <string>arguments[0];
    const options = arguments[1];
    return function(owner: Function) {
      createDataInitializer(owner.prototype, name, options);
    };
  } else {
    const options = arguments[0];
    return function(owner: object, property: string) {
      createDataInitializer(owner, property, options);
    };
  }
}

export default data;
