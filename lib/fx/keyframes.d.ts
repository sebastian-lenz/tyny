export interface Rules {
    [name: string]: string;
}
export interface Keyframes {
    [name: string]: Rules;
}
export declare const keyframes: (name: string, frames: Keyframes) => string;
