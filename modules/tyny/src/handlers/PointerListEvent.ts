import { Event, EventOptions } from 'tyny-events';

import Pointer from './Pointer';
import PointerList, { NativeEvent } from './PointerList';

export interface PointerListEventOptions extends EventOptions {
  nativeEvent: NativeEvent | undefined;
  pointer: Pointer;
  target: PointerList;
}

export default class PointerListEvent extends Event {
  readonly nativeEvent: NativeEvent | undefined;
  readonly pointer: Pointer;
  readonly target: PointerList;

  static addEvent: string = 'add';
  static commitEvent: string = 'commit';
  static removeEvent: string = 'remove';
  static updateEvent: string = 'update';

  constructor(options: PointerListEventOptions) {
    super(options);

    this.nativeEvent = options.nativeEvent;
    this.pointer = options.pointer;
  }
}
