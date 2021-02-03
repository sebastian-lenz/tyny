import { Event, EventOptions } from 'tyny-events';

import Pointer from './Pointer';
import PointerList, { NativeEvent } from './PointerList';

export interface PointerListEventOptions extends EventOptions<PointerList> {
  nativeEvent: NativeEvent | undefined;
  pointer: Pointer;
}

export default class PointerListEvent extends Event<PointerList> {
  readonly nativeEvent: NativeEvent | undefined;
  readonly pointer: Pointer;

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
