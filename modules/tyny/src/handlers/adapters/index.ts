import Adapter from './Adapter';
import MouseAdapter from './MouseAdapter';
import PointerAdapter from './PointerAdapter';
import PointerList from '../PointerList';
import TouchAdapter from './TouchAdapter';

export default function createAdapter(element: HTMLElement): Adapter {
  const pointers = new PointerList();

  if (PointerAdapter.isSupported()) {
    return new PointerAdapter(element, pointers);
  } else if (TouchAdapter.isSupported()) {
    return new TouchAdapter(element, pointers);
  }

  return new MouseAdapter(element, pointers);
}
