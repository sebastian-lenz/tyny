declare type Feature = keyof typeof testImages;
declare const testImages: {
    lossy: string;
    lossless: string;
    alpha: string;
    animation: string;
};
export declare function supportsWebp(feature?: Feature): Promise<boolean>;
export {};
