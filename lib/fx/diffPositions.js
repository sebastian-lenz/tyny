import { diff } from './diff';
import { noop } from '../utils/lang/function';
import { transform } from '../utils/env/transformProps';
import { transist } from './transist';
export function transistPositions({ changed }, { ignoreX, ignoreY, positionTransition, useTransform3D } = {}) {
    const transitions = [];
    const translate = (x = 0, y = 0) => useTransform3D
        ? `translate3d(${x}px, ${y}px, 0)`
        : `translate(${x}px, ${y}px)`;
    for (const { element, from, inViewport, to } of changed) {
        const x = ignoreX ? 0 : from.left - to.left;
        const y = ignoreY ? 0 : from.top - to.top;
        if (!inViewport || (x == 0 && y == 0)) {
            continue;
        }
        transitions.push(transist(element, {
            [transform]: { clear: true, from: translate(x, y), to: translate() },
        }, positionTransition));
    }
    return Promise.all(transitions).then(noop);
}
export function diffPositions(initialElements, callback, options = {}) {
    const result = diff(initialElements, callback);
    const promise = transistPositions(result, options);
    if (options.finished) {
        promise.then(options.finished);
    }
    return result;
}
