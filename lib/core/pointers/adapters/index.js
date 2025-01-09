import { MouseAdapter } from './MouseAdapter';
import { PointerAdapter } from './PointerAdapter';
import { TouchAdapter } from './TouchAdapter';
export function createAdapter(element, pointerList) {
    if (PointerAdapter.isSupported()) {
        return new PointerAdapter(element, pointerList);
    }
    else if (TouchAdapter.isSupported()) {
        return new TouchAdapter(element, pointerList);
    }
    return new MouseAdapter(element, pointerList);
}
