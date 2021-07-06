import { animate } from '../../../fx/animate';
export default function dissolve({ fadeIn = 150, fadeOut = 300, } = {}) {
    return (from, to) => {
        const animations = [];
        if (from instanceof HTMLElement) {
            from.classList.add('hidden');
            animations.push(animate(from, 'fadeOut', { duration: fadeOut, fillMode: 'both' }));
        }
        if (to instanceof HTMLElement) {
            animations.push(animate(to, 'fadeIn', {
                delay: from ? fadeOut : 0,
                duration: fadeIn,
                fillMode: 'both',
            }));
        }
        return Promise.all(animations);
    };
}
