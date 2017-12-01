import View, { MaybeView } from '../View';

export interface SelectableView extends View {
  setSelected(value: boolean): void;
}

export default function isSelectableView(
  view: MaybeView
): view is SelectableView {
  return view ? 'setSelected' in view : false;
}
