import { $ } from './$';
import { append } from './append';
import { empty } from './empty';
import { isUndefined } from '../../lang/misc/isUndefined';

export function html(value: tyny.ElementQuery): string;

export function html(value: tyny.ElementQuery, html: string): void;

export function html(value: tyny.ElementQuery, html?: string): string | void {
  const parent = $(value);

  if (isUndefined(html)) {
    return parent ? parent.innerHTML : '';
  } else if (parent) {
    append(parent.hasChildNodes() ? empty(parent) : parent, html);
  }
}
