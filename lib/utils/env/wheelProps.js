import { isEventSupported } from '../dom/event/isEventSupported';
export const onWheel = isEventSupported('wheel') ? 'wheel' : 'mousewheel';
