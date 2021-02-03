export declare type UpdateMode = 'read' | 'write';
export interface UpdateOptions {
    events?: string[] | string;
    mode?: UpdateMode;
}
export interface UpdateHandler {
    events: string[];
    handler: string;
    mode: UpdateMode;
}
export declare function update({ events, mode, }?: UpdateOptions): MethodDecorator;
