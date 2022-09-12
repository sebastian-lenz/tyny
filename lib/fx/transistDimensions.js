import { transist } from './transist';
import { transition } from '../utils/env/transitionProps';
import { withoutTransition } from './withoutTransition';
export function transistDimensions(element, callback, options) {
    if (!element) {
        callback();
        return Promise.resolve();
    }
    const { extraProperties, throwErrorOnSkip, transistHeight, transistWidth } = options;
    const fromHeight = element.offsetHeight;
    const fromWidth = element.offsetWidth;
    const style = element.style;
    const properties = extraProperties
        ? Object.assign({}, extraProperties) : {};
    withoutTransition(element, function () {
        style.height = '';
        style.width = '';
        style[transition] = 'none';
        callback();
    });
    const toHeight = element.clientHeight;
    const toWidth = element.clientWidth;
    let hasChanged = false;
    if (transistHeight && fromHeight !== toHeight) {
        hasChanged = true;
        properties.height = {
            clear: true,
            from: `${fromHeight}px`,
            to: `${toHeight}px`,
        };
    }
    if (transistWidth && fromWidth !== toWidth) {
        hasChanged = true;
        properties.width = {
            clear: true,
            from: `${fromWidth}px`,
            to: `${toWidth}px`,
        };
    }
    if (!hasChanged && !extraProperties) {
        if (throwErrorOnSkip) {
            throw new Error();
        }
        else {
            return Promise.resolve();
        }
    }
    return transist(element, properties, options);
}
