import { getWindowWidth } from '../utils/dom/window/getWindowWidth';
function createDiff() {
    return {
        changed: [],
        created: [],
        deleted: [],
    };
}
export function createDiffState(elements) {
    return elements.map((element) => ({
        element,
        position: element.getBoundingClientRect(),
    }));
}
function inViewportFactory() {
    const min = 0;
    const max = getWindowWidth();
    return (rect) => rect.bottom > min && rect.top < max;
}
export function diff(elements, callback) {
    return diffFromState(createDiffState(elements), callback());
}
export function diffFromState(state, elements) {
    const isInViewport = inViewportFactory();
    const result = createDiff();
    for (const element of elements) {
        const position = element.getBoundingClientRect();
        const index = state.findIndex((state) => state.element === element);
        const inViewport = isInViewport(position);
        if (index === -1) {
            result.created.push({ element, position, inViewport });
        }
        else {
            const from = state[index].position;
            state.splice(index, 1);
            result.changed.push({
                element,
                from: from,
                to: position,
                inViewport: inViewport || isInViewport(from),
            });
        }
    }
    for (const deleted of state) {
        result.deleted.push(Object.assign(Object.assign({}, deleted), { inViewport: isInViewport(deleted.position) }));
    }
    return result;
}
