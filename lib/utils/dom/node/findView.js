import { findAll } from './find';
export function findView(selector, context, ctor) {
    return findAllViews(selector, context, ctor)[0] || null;
}
export function findAllViews(selector, context, ctor) {
    return findAll(selector, context).reduce((result, element) => {
        const views = element.__tynyViews;
        if (!views)
            return result;
        if (!ctor) {
            result.push(...Object.values(views));
        }
        else if (typeof ctor === 'string') {
            if (ctor in views) {
                result.push(views[ctor]);
            }
        }
        else {
            for (const name in views) {
                const view = views[name];
                if (view instanceof ctor) {
                    result.push(view);
                }
            }
        }
        return result;
    }, []);
}
