import View, { MaybeView } from '../View';

export interface LoadableView extends View {
  load(): Promise<void>;
}

export default function isLoadableView(view: MaybeView): view is LoadableView {
  return view ? 'load' in view : false;
}
