import Crop, { CropOptions } from '../ImageCrop/Crop';
import SourceSet, { SourceSetSource } from '../Image/SourceSet';

export interface RatioOptions extends CropOptions {
  height: number;
  sourceSet: SourceSetSource;
  width: number;
}

export default class Ratio extends Crop {
  sourceSet: SourceSet;

  constructor(options: RatioOptions) {
    super(options);
    this.sourceSet = new SourceSet(options.sourceSet);
  }
}
