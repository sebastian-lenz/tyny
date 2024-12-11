import type { CreateElementOptions } from '../../utils/dom/node/createElement';
import type { EnumParam, InstanceParam, Param } from '../Params';
export type PropertyParam = ({
    type: 'bool';
} & Omit<Param<boolean>, 'name'>) | ({
    type: 'element';
} & Omit<Param<string>, 'name'> & CreateElementOptions) | ({
    type: 'enum';
} & Omit<EnumParam, 'name'>) | ({
    type: 'instance';
} & Omit<InstanceParam, 'name'>) | ({
    type: 'int';
} & Omit<Param<number>, 'name'>) | ({
    type: 'number';
} & Omit<Param<number>, 'name'>) | ({
    type: 'string';
} & Omit<Param<string>, 'name'>);
export interface PropertyOptions {
    immediate?: boolean;
    immutable?: boolean;
    param?: PropertyParam;
    watch?: {
        (newValue: any, oldValue: any): void;
    } | string;
}
export interface PropertyHandler extends PropertyOptions {
    name: string;
}
export type PropertyHandlerMap = tyny.Map<PropertyHandler>;
export declare function property(options?: PropertyOptions): PropertyDecorator;
