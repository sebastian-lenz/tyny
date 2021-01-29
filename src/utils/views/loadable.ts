import { View, getChildViews } from '../../core';

export interface LoadableView extends View {
  load(): Promise<any>;
}

export function isLoadable(value: any): value is LoadableView {
  return value instanceof View && typeof (value as any).load === 'function';
}

export function whenLoaded(element: HTMLElement | null | undefined) {
  return Promise.all(
    getChildViews(element)
      .filter(isLoadable)
      .map((view) => view.load())
  );
}

export function whenViewLoaded(view: any): Promise<any> {
  return isLoadable(view) ? view.load() : Promise.resolve();
}
