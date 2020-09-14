import { ucFirst } from '../lang/string/ucFirst';

const isNative = 'ontransitionend' in document.body;

const eventName = isNative
  ? (value: string) => value.toLowerCase()
  : (value: string) => `webkit${value}`;

const styleName = isNative
  ? (value: string) => value
  : (value: string) => `webkit${ucFirst(value)}`;

export const onTransitionEnd = eventName('transitionend');

export const transition = styleName('transition');
