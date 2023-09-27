export function createEaseInBack(scale = 1.70158) {
    const result = (function easeInBack(time, base, change, duration) {
        return (change * (time /= duration) * time * ((scale + 1) * time - scale) + base);
    });
    result.toCSS = () => 'cubic-bezier(0.6, -0.28, 0.735, 0.045)';
    return result;
}
const easeInBack = createEaseInBack();
export { easeInBack };
