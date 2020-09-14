import { toNodes } from '../misc';

const fragmentRe = /^\s*<(\w+|!)[^>]*>/;
const singleTagRe = /^<(\w+)\s*\/?>(?:<\/\1>)?$/;

export function fragment(html: string): Node | Node[] | null {
  const matches = singleTagRe.exec(html);
  if (matches) {
    return document.createElement(matches[1]);
  }

  const container = document.createElement('div');
  if (fragmentRe.test(html)) {
    container.insertAdjacentHTML('beforeend', html.trim());
  } else {
    container.textContent = html;
  }

  return container.childNodes.length > 1
    ? toNodes(container.childNodes)
    : container.firstChild;
}
