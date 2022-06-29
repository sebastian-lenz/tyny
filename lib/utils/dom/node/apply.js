export function apply(element, preCallback, postCallback) {
    if (!element) {
        return;
    }
    preCallback(element);
    let child = element.firstElementChild;
    while (child) {
        const next = child.nextElementSibling;
        apply(child, preCallback);
        child = next;
    }
    if (postCallback) {
        postCallback(element);
    }
}
