import { __rest } from "tslib";
import { animate } from '../animate';
import { fadeIn } from './keyframes/fadeIn';
import { fadeOut } from './keyframes/fadeOut';
export function dissolve(options = {}) {
    const { noCrossFade, noPureFadeIn, noPureFadeOut } = options, animationOptions = __rest(options, ["noCrossFade", "noPureFadeIn", "noPureFadeOut"]);
    return (from, to) => {
        const animations = [];
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
            ? Promise.all(animations).then(() => undefined)
            : Promise.resolve();
    };
}
