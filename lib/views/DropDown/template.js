import { __assign } from "tslib";
import { createElement, } from '../../utils/dom/node/createElement';
var tag = function (options) {
    return createElement(options).outerHTML;
};
var items = function (options) {
    return Array.prototype.slice
        .apply(options.element.children)
        .map(function (child) {
        switch (child.nodeName.toLowerCase()) {
            case 'option':
                return option(__assign(__assign({}, options), { element: child }));
            case 'optgroup':
                return optGroup(__assign(__assign({}, options), { element: child }));
            default:
                return child.nodeName;
        }
    })
        .join('');
};
var optGroup = function (options) { return "\n  <li class=\"" + options.className + "--listItem group\">\n    <div class=\"" + options.className + "--listGroup\">" + options.groupLabel(options.element) + "</div>\n    <ul class=\"" + options.className + "--list\">\n      " + items(options) + "\n    </ul>\n  </li>"; };
var option = function (_a) {
    var className = _a.className, element = _a.element, optionLabel = _a.optionLabel;
    return tag({
        attributes: {
            'data-dropdown-value': element.value,
        },
        className: className + "--listItem option",
        tagName: 'li',
        template: optionLabel(element),
    });
};
export var template = function (options) { return "\n  <ul class=\"" + options.className + "--list\">\n    " + items(options) + "\n  </ul>"; };
