import { toNodes } from '../misc';
var fragmentRe = /^\s*<(\w+|!)[^>]*>/;
var singleTagRe = /^<(\w+)\s*\/?>(?:<\/\1>)?$/;
export function fragment(html) {
    var matches = singleTagRe.exec(html);
    if (matches) {
        return document.createElement(matches[1]);
    }
    var container = document.createElement('div');
    if (fragmentRe.test(html)) {
        container.insertAdjacentHTML('beforeend', html.trim());
    }
    else {
        container.textContent = html;
    }
    return container.childNodes.length > 1
        ? toNodes(container.childNodes)
        : container.firstChild;
}
