export interface PropertyMap<T> {
    [name: string]: T;
}
export interface PropertyMapCallback<T, U> {
    (key: string, value: T): U;
}
export declare function propertyMap<T, U>(map: PropertyMap<T>, callback: PropertyMapCallback<T, U>): U[];
