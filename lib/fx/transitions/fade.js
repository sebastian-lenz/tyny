import { animate } from '../animate';
import { fadeIn } from './keyframes/fadeIn';
import { fadeOut } from './keyframes/fadeOut';
export function fade(options = {}) {
    const merged = Object.assign(Object.assign({}, animate.defaultOptions), options);
    return (from, to) => {
        if (from && to) {
            const { delay, duration } = merged;
            return Promise.all([
                animate(from, fadeOut(), Object.assign(Object.assign({}, merged), { delay: 0, duration: duration * 0.5 })).then(() => {
                    from.style.visibility = 'hidden';
                }),
                animate(to, fadeIn(), Object.assign(Object.assign({}, merged), { delay: duration * 0.5 + delay, duration: duration * 0.5 })),
            ]).then(() => {
                from.style.visibility = '';
                return undefined;
            });
        }
        if (to) {
            return animate(to, fadeIn(), merged);
        }
        if (from) {
            return animate(from, fadeOut(), merged);
        }
        return Promise.resolve();
    };
}
