import { __assign } from "tslib";
import { transist } from './transist';
import { transition } from '../utils/env/transitionProps';
import { withoutTransition } from './withoutTransition';
export function transistDimensions(element, callback, options) {
    if (!element) {
        callback();
        return Promise.resolve();
    }
    var extraProperties = options.extraProperties, transistHeight = options.transistHeight, transistWidth = options.transistWidth;
    var fromHeight = element.offsetHeight;
    var fromWidth = element.offsetWidth;
    var style = element.style;
    var properties = extraProperties
        ? __assign({}, extraProperties) : {};
    withoutTransition(element, function () {
        style.height = '';
        style.width = '';
        style[transition] = 'none';
        callback();
    });
    var toHeight = element.clientHeight;
    var toWidth = element.clientWidth;
    var hasChanged = false;
    if (transistHeight && fromHeight !== toHeight) {
        hasChanged = true;
        properties.height = {
            clear: true,
            from: fromHeight + "px",
            to: toHeight + "px",
        };
    }
    if (transistWidth && fromWidth !== toWidth) {
        hasChanged = true;
        properties.width = {
            clear: true,
            from: fromWidth + "px",
            to: toWidth + "px",
        };
    }
    if (!hasChanged && !extraProperties) {
        return Promise.resolve();
    }
    return transist(element, properties, options);
}
