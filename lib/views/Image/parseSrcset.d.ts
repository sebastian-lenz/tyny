export type Candidate = {
    url: string;
    w?: number;
    d?: number;
    h?: number;
};
export declare function parseSrcset(input: string): Candidate[];
