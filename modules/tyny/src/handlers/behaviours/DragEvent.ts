import { Event, EventOptions } from 'tyny-events';

import PointerListEvent from '../PointerListEvent';

export interface DragEventOptions extends EventOptions {
  listEvent: PointerListEvent;
}

export default class DragEvent extends Event {
  readonly listEvent: PointerListEvent;

  static clickEvent: string = 'click';
  static dragEvent: string = 'drag';
  static dragEndEvent: string = 'dragEnd';
  static dragStartEvent: string = 'dragStart';

  constructor(options: DragEventOptions) {
    super(options);
    this.listEvent = options.listEvent;
  }
}
