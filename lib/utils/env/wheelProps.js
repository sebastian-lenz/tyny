import { isEventSupported } from '../dom/event/isEventSupported';
export var onWheel = isEventSupported('wheel') ? 'wheel' : 'mousewheel';
