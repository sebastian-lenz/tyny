import { __extends } from "tslib";
import { Behaviour } from '../../core/Behaviour';
var BehaviourModifier = /** @class */ (function (_super) {
    __extends(BehaviourModifier, _super);
    //
    function BehaviourModifier(view, options) {
        if (options === void 0) { options = {}; }
        return _super.call(this, view, options) || this;
    }
    BehaviourModifier.prototype.softReset = function () { };
    return BehaviourModifier;
}(Behaviour));
export { BehaviourModifier };
