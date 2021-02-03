import { __rest } from "tslib";
import { animate } from '../animate';
import { fadeZoom } from './keyframes/fadeZoom';
export function zoom(options = { zoom: 0.5 }) {
    const { zoom, zoomFrom = true, zoomTo = true } = options, animationOptions = __rest(options, ["zoom", "zoomFrom", "zoomTo"]);
    const keyframesOut = fadeZoom({
        fromOpacity: 1,
        fromScale: 1,
        toOpacity: 0,
        toScale: zoomFrom ? 1 - zoom : 1,
    });
    const keyframesIn = fadeZoom({
        fromOpacity: 0,
        fromScale: zoomTo ? 1 + zoom : 1,
        toOpacity: 1,
        toScale: 1,
    });
    return (from, to) => {
        const animations = [];
        if (from) {
            animations.push(animate(from, keyframesOut, animationOptions));
        }
        if (to) {
            animations.push(animate(to, keyframesIn, animationOptions));
        }
        return animations.length
            ? Promise.all(animations).then(() => undefined)
            : Promise.resolve();
    };
}
