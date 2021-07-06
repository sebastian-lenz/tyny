export default function createTransition({ childRef, effect, lastChildRef, }) {
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
                    effect(lastChildRef ? lastChildRef.current : null, childRef ? childRef.current : null).then(() => callback());
                }
            }
            checkRefs();
        },
    };
}
