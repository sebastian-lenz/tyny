export function toElement(value) {
    if (!value || value instanceof HTMLElement) {
        return value;
    }
    return value.base;
}
export function createTransition(options) {
    const { childRef, effect, lastChildRef } = options;
    let didBegin = false;
    return {
        childRef,
        lastChildRef,
        begin: (callback) => {
            if (didBegin)
                return;
            didBegin = true;
            function checkRefs() {
                let valid = true;
                if (childRef && !childRef.current)
                    valid = false;
                if (lastChildRef && !lastChildRef.current)
                    valid = false;
                if (!valid) {
                    window.requestAnimationFrame(checkRefs);
                }
                else {
                    effect(lastChildRef ? toElement(lastChildRef.current) : null, childRef ? toElement(childRef.current) : null, options).then(() => callback());
                }
            }
            checkRefs();
        },
    };
}
