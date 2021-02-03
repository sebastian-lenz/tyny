import { __rest } from "tslib";
import { animate } from '../animate';
import { fadeIn } from './keyframes/fadeIn';
import { fadeOut } from './keyframes/fadeOut';
export function dissolve(options) {
    if (options === void 0) { options = {}; }
    var noCrossFade = options.noCrossFade, noPureFadeIn = options.noPureFadeIn, noPureFadeOut = options.noPureFadeOut, animationOptions = __rest(options, ["noCrossFade", "noPureFadeIn", "noPureFadeOut"]);
    return function (from, to) {
        var animations = [];
        if (from && to && noCrossFade) {
            animations.push(animate(to, fadeIn(), animationOptions));
        }
        else {
            if (from && (!noPureFadeOut || to)) {
                animations.push(animate(from, fadeOut(), animationOptions));
            }
            if (to && (!noPureFadeIn || from)) {
                animations.push(animate(to, fadeIn(), animationOptions));
            }
        }
        return animations.length
            ? Promise.all(animations).then(function () { return undefined; })
            : Promise.resolve();
    };
}
