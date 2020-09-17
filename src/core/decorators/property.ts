import type { CreateElementOptions } from '../../utils/dom/node/createElement';
import type { EnumParam, InstanceParam, Param, Params } from '../Params';

interface PropertyScope {
  _watchValues: tyny.AnyObject | null;
  params: any;
}

export type PropertyParam =
  | ({ type: 'bool' } & Omit<Param<boolean>, 'name'>)
  | ({ type: 'element' } & Omit<Param<string>, 'name'> & CreateElementOptions)
  | ({ type: 'enum' } & Omit<EnumParam, 'name'>)
  | ({ type: 'instance' } & Omit<InstanceParam, 'name'>)
  | ({ type: 'int' } & Omit<Param<number>, 'name'>)
  | ({ type: 'number' } & Omit<Param<number>, 'name'>)
  | ({ type: 'string' } & Omit<Param<string>, 'name'>);

export interface PropertyOptions {
  immediate?: boolean;
  immutable?: boolean;
  param?: PropertyParam;
  watch?: { (newValue: any, oldValue: any): void } | string;
}

export interface PropertyHandler extends PropertyOptions {
  name: string;
}

export type PropertyHandlerMap = tyny.Map<PropertyHandler>;

export function property(options: PropertyOptions = {}): PropertyDecorator {
  return function (target: any, name: any) {
    const { param } = options;
    const property = Object.getOwnPropertyDescriptor(target, name) || {};

    const { get, ...desc } = property;
    const properties: PropertyHandlerMap = target.hasOwnProperty('_properties')
      ? target._properties
      : (target._properties = { ...target._properties });

    properties[name] = {
      ...options,
      name,
    };

    Object.defineProperty(target, name, {
      ...desc,
      get: function (this: PropertyScope): any {
        const values = this._watchValues || (this._watchValues = {});
        if (name in values) {
          return values[name];
        }

        if (param) {
          const { type, ...options } = param;
          return (values[name] = this.params[type]({
            defaultValue: get,
            ...options,
            name,
          }));
        }

        return (values[name] = get ? get() : undefined);
      },
    });
  };
}
