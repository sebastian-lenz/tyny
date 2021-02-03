export function createEaseOutBack(scale = 1.70158) {
    const result = (function easeOutBack(time, base, change, duration) {
        return (change *
            ((time = time / duration - 1) * time * ((scale + 1) * time + scale) +
                1) +
            base);
    });
    result.toCSS = () => 'cubic-bezier(0.175, 0.885, 0.32, 1.275)';
    return result;
}
const easeOutBack = createEaseOutBack();
export { easeOutBack };
