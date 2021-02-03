import { Event, EventOptions } from 'tyny-events';

import DragBehaviour from './DragBehaviour';
import PointerListEvent from '../PointerListEvent';
import PointerList from '../PointerList';

export interface DragEventOptions extends EventOptions<DragBehaviour> {
  listEvent: PointerListEvent;
  pointerList: PointerList;
}

export default class DragEvent extends Event<DragBehaviour> {
  readonly listEvent: PointerListEvent;
  readonly pointerList: PointerList;

  static clickEvent: string = 'click';
  static dragEvent: string = 'drag';
  static dragEndEvent: string = 'dragEnd';
  static dragStartEvent: string = 'dragStart';

  constructor(options: DragEventOptions) {
    super(options);
    this.listEvent = options.listEvent;
    this.pointerList = options.pointerList;
  }
}
