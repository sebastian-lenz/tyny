import { Crop, CropOptions } from '../ImageCrop/Crop';
import { SourceSet, SourceSetSource } from '../Image/SourceSet';
export interface SourceOptions extends CropOptions {
    height: number;
    sourceSet: SourceSetSource;
    width: number;
}
export declare class Source extends Crop {
    sourceSet: SourceSet;
    constructor({ sourceSet, ...options }: SourceOptions);
}
