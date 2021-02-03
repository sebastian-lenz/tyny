declare function flush(recursion?: number): void;
export declare type FastDomTask = {
    (): FastDomTask | void;
};
export declare const fastDom: {
    readonly reads: FastDomTask[];
    readonly scheduled: boolean;
    readonly writes: FastDomTask[];
    read(task: FastDomTask): FastDomTask;
    write(task: FastDomTask): FastDomTask;
    clear(task: FastDomTask): boolean;
    flush: typeof flush;
};
export {};
