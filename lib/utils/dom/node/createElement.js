export function createElement(options) {
    var appendTo = options.appendTo, attributes = options.attributes, className = options.className, extraClassName = options.extraClassName, prependTo = options.prependTo, _a = options.tagName, tagName = _a === void 0 ? 'div' : _a, template = options.template;
    var el = document.createElement(tagName);
    if (className) {
        el.className = className;
    }
    if (extraClassName) {
        el.classList.add(extraClassName);
    }
    if (attributes) {
        Object.keys(attributes).forEach(function (key) {
            el.setAttribute(key, attributes[key]);
        });
    }
    if (template) {
        if (typeof template === 'function') {
            el.innerHTML = template(options);
        }
        else {
            el.innerHTML = template;
        }
    }
    if (appendTo) {
        appendTo.appendChild(el);
    }
    else if (prependTo) {
        prependTo.insertBefore(el, prependTo.firstElementChild);
    }
    return el;
}
