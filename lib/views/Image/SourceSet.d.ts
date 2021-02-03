export declare type SourceSetSource = string | Source[] | SourceSetMode;
export declare enum SourceSetMode {
    Width = 0,
    Density = 1
}
export interface Source {
    bias?: number;
    mode?: SourceSetMode;
    src: string;
}
export interface SafeSource extends Source {
    bias: number;
    isWebp: boolean;
}
export declare class SourceSet {
    mode: SourceSetMode | null;
    sources: SafeSource[];
    webpCheck: Promise<void>;
    constructor(data?: SourceSetSource);
    add(source: Source): void;
    get(width: number): Promise<string>;
    parse(rawValue: string): void;
}
