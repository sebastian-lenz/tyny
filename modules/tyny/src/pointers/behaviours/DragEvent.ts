import { Event, EventOptions } from 'tyny-events';

import PointerEvent from '../PointerEvent';

export interface DragEventOptions extends EventOptions {
  listEvent: PointerEvent;
}

export default class DragEvent extends Event {
  readonly listEvent: PointerEvent;

  static clickEvent: string = 'click';
  static dragEvent: string = 'drag';
  static dragEndEvent: string = 'dragEnd';
  static dragStartEvent: string = 'dragStart';

  constructor(options: DragEventOptions) {
    super(options);
    this.listEvent = options.listEvent;
  }
}
