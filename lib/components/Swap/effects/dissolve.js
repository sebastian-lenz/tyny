import { animate } from '../../../fx/animate';
export function dissolve({ fadeIn = 300, fadeInKeyFrames = 'fadeIn', fadeOut = 300, fadeOutKeyFrames = 'fadeOut', } = {}) {
    return (from, to) => {
        const animations = [];
        if (from instanceof HTMLElement) {
            from.classList.add('hidden');
            animations.push(animate(from, fadeOutKeyFrames, { duration: fadeOut, fillMode: 'both' }));
        }
        if (to instanceof HTMLElement) {
            animations.push(animate(to, fadeInKeyFrames, {
                delay: from ? fadeOut : 0,
                duration: fadeIn,
                fillMode: 'both',
            }));
        }
        return Promise.all(animations);
    };
}
