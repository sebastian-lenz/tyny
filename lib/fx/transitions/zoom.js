import { __rest } from "tslib";
import { animate } from '../animate';
import { fadeZoom } from './keyframes/fadeZoom';
export function zoom(options) {
    if (options === void 0) { options = { zoom: 0.5 }; }
    var zoom = options.zoom, _a = options.zoomFrom, zoomFrom = _a === void 0 ? true : _a, _b = options.zoomTo, zoomTo = _b === void 0 ? true : _b, animationOptions = __rest(options, ["zoom", "zoomFrom", "zoomTo"]);
    var keyframesOut = fadeZoom({
        fromOpacity: 1,
        fromScale: 1,
        toOpacity: 0,
        toScale: zoomFrom ? 1 - zoom : 1,
    });
    var keyframesIn = fadeZoom({
        fromOpacity: 0,
        fromScale: zoomTo ? 1 + zoom : 1,
        toOpacity: 1,
        toScale: 1,
    });
    return function (from, to) {
        var animations = [];
        if (from) {
            animations.push(animate(from, keyframesOut, animationOptions));
        }
        if (to) {
            animations.push(animate(to, keyframesIn, animationOptions));
        }
        return animations.length
            ? Promise.all(animations).then(function () { return undefined; })
            : Promise.resolve();
    };
}
