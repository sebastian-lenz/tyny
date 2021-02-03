export interface TranslateOptions {
    extraFrom?: any;
    extraTo?: any;
    fromTransform: string;
    toTransform: string;
}
export declare function transform({ extraFrom, extraTo, fromTransform, toTransform, }: TranslateOptions): string;
