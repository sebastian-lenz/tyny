import Adapter from './Adapter';
import MouseAdapter from './MouseAdapter';
import PointerAdapter from './PointerAdapter';
import PointerList from '../PointerList';
import TouchAdapter from './TouchAdapter';

export { Adapter };

export default function createAdapter(
  element: HTMLElement,
  pointerList: PointerList
): Adapter {
  if (PointerAdapter.isSupported()) {
    return new PointerAdapter(element, pointerList);
  } else if (TouchAdapter.isSupported()) {
    return new TouchAdapter(element, pointerList);
  }

  return new MouseAdapter(element, pointerList);
}
