export type InsertResult = Node | Node[] | null;
export type InsertValue = Node | Node[] | NodeList | string | undefined | null;
export declare function append(target: tyny.ElementQuery, value: InsertValue): InsertResult;
export declare function after(target: tyny.ElementQuery, element: InsertValue): InsertResult;
export declare function before(target: tyny.ElementQuery, value: InsertValue): InsertResult;
export declare function prepend(target: tyny.ElementQuery, value: InsertValue): InsertResult;
