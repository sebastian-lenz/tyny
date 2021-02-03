export function apply(element, callback) {
    if (!element)
        return;
    callback(element);
    element = element.firstElementChild;
    while (element) {
        const next = element.nextElementSibling;
        apply(element, callback);
        element = next;
    }
}
