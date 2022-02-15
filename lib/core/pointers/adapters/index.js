import { MouseAdapter } from './MouseAdapter';
import { PointerAdapter } from './PointerAdapter';
import { TouchAdapter } from './TouchAdapter';
export function createAdapter(element, pointerList) {
    if (TouchAdapter.isSupported()) {
        return new TouchAdapter(element, pointerList);
    }
    else if (PointerAdapter.isSupported()) {
        return new PointerAdapter(element, pointerList);
    }
    return new MouseAdapter(element, pointerList);
}
