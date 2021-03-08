import { getChildViews, View } from '../../core';

export const enum LoadMode {
  Always,
  Explicit,
  Visibility,
}

export interface LoadModeView {
  setLoadMode(mode: LoadMode): void;
}

export function isLoadModeView(value: any): value is LoadModeView {
  return value instanceof View && 'setLoadMode' in value;
}

export function setChildLoadMode(el: HTMLElement, mode: LoadMode) {
  getChildViews(el).forEach((view) => {
    if (isLoadModeView(view)) {
      view.setLoadMode(mode);
    }
  });
}
