import { __extends, __rest } from "tslib";
import { Crop } from '../ImageCrop/Crop';
import { SourceSet } from '../Image/SourceSet';
var Source = /** @class */ (function (_super) {
    __extends(Source, _super);
    function Source(_a) {
        var sourceSet = _a.sourceSet, options = __rest(_a, ["sourceSet"]);
        var _this = _super.call(this, options) || this;
        _this.sourceSet =
            sourceSet instanceof SourceSet ? sourceSet : new SourceSet(sourceSet);
        return _this;
    }
    return Source;
}(Crop));
export { Source };
