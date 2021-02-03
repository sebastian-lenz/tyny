import { keyframes } from '../../keyframes';
let id = 0;
export function transform({ extraFrom = {}, extraTo = {}, fromTransform, toTransform, }) {
    const name = `tynyTransformKeyframes-${id++}`;
    return keyframes(name, {
        from: Object.assign(Object.assign({}, extraFrom), { transform: fromTransform }),
        to: Object.assign(Object.assign({}, extraTo), { transform: toTransform }),
    });
}
