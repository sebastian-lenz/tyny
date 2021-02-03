import { keyframes } from '../../keyframes';
function str(value) {
    return value.toString().replace('.', '_');
}
export function fadeZoom({ fromOpacity, fromScale, toOpacity, toScale, }) {
    const name = [
        'tynyFadeZoomKeyframes',
        str(fromOpacity),
        str(fromScale),
        str(toOpacity),
        str(toScale),
    ].join('-');
    return keyframes(name, {
        from: {
            opacity: `${fromOpacity}`,
            transform: `scale(${fromScale})`,
        },
        to: {
            opacity: `${toOpacity}`,
            transform: `scale(${toScale})`,
        },
    });
}
