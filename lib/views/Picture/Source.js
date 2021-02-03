import { __rest } from "tslib";
import { Crop } from '../ImageCrop/Crop';
import { SourceSet } from '../Image/SourceSet';
export class Source extends Crop {
    constructor(_a) {
        var { sourceSet } = _a, options = __rest(_a, ["sourceSet"]);
        super(options);
        this.sourceSet =
            sourceSet instanceof SourceSet ? sourceSet : new SourceSet(sourceSet);
    }
}
