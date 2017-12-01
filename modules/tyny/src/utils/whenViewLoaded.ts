import { MaybeView } from '../View';
import isLoadableView from './isLoadableView';

export default function whenViewLoaded(view: MaybeView): Promise<void> {
  return isLoadableView(view) ? view.load() : Promise.resolve();
}
