import { isString } from '../../lang/string/isString';

export function createEvent(
  name: string | Event,
  bubbles: boolean = true,
  cancelable: boolean = false,
  detail?: any
): Event {
  if (!isString(name)) {
    return name;
  }

  const event = document.createEvent('CustomEvent'); // IE 11
  event.initCustomEvent(name, bubbles, cancelable, detail);
  return event;
}
