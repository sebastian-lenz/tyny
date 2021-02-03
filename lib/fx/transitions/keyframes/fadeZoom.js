import { keyframes } from '../../keyframes';
function str(value) {
    return value.toString().replace('.', '_');
}
export function fadeZoom(_a) {
    var fromOpacity = _a.fromOpacity, fromScale = _a.fromScale, toOpacity = _a.toOpacity, toScale = _a.toScale;
    var name = [
        'tynyFadeZoomKeyframes',
        str(fromOpacity),
        str(fromScale),
        str(toOpacity),
        str(toScale),
    ].join('-');
    return keyframes(name, {
        from: {
            opacity: "" + fromOpacity,
            transform: "scale(" + fromScale + ")",
        },
        to: {
            opacity: "" + toOpacity,
            transform: "scale(" + toScale + ")",
        },
    });
}
