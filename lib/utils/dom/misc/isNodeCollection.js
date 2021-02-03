export function isNodeCollection(obj) {
    return !!toString.call(obj).match(/^\[object (NodeList|HTMLCollection)\]$/);
}
