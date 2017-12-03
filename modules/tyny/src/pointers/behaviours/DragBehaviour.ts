import Behaviour from './Behaviour';
import PointerList from '../PointerList';
import PointerListEvent from '../PointerListEvent';
import DragEvent from './DragEvent';

export default class DragBehaviour extends Behaviour {
  direction: 'horizontal' | 'vertical' | 'both' = 'both';
  threshold: number = 5;

  protected watchMode: 'idle' | 'listening' | 'draging' = 'idle';

  constructor(list: PointerList) {
    super(list);

    this.listenTo(list, PointerListEvent.addEvent, this.handlePointerAdd);
    this.listenTo(list, PointerListEvent.removeEvent, this.handlePointerRemove);
    this.listenTo(list, PointerListEvent.updateEvent, this.handlePointerUpdate);
  }

  protected emitDragEvent(type: string, listEvent: PointerListEvent): boolean {
    const event = new DragEvent({
      listEvent,
      type,
    });

    this.emit(event);
    return event.isDefaultPrevented();
  }

  protected handlePointerAdd = (event: PointerListEvent) => {
    if (this.watchMode !== 'idle') {
      event.preventDefault();
    } else {
      this.watchMode = 'listening';
    }
  };

  protected handlePointerRemove = (event: PointerListEvent) => {
    const { watchMode } = this;
    this.watchMode = 'idle';

    if (watchMode === 'draging') {
      this.emitDragEvent(DragEvent.dragEndEvent, event);
    } else if (watchMode === 'listening') {
      this.emitDragEvent(DragEvent.clickEvent, event);
    }
  };

  protected handlePointerUpdate = (event: PointerListEvent) => {
    const { watchMode } = this;
    const { pointer } = event;

    if (watchMode === 'listening') {
      const { direction, threshold } = this;
      if (pointer.getDeltaLength() < threshold) return;

      const { x, y } = pointer.getDelta();
      if (
        (direction === 'horizontal' && Math.abs(x) < Math.abs(y)) ||
        (direction === 'vertical' && Math.abs(x) > Math.abs(y)) ||
        this.emitDragEvent(DragEvent.dragStartEvent, event)
      ) {
        this.watchMode = 'idle';
        return;
      }

      pointer.resetInitialPosition();
      this.watchMode = 'draging';
    }

    if (watchMode === 'draging') {
      const { x, y } = pointer.getDelta();
      this.emitDragEvent(DragEvent.dragEvent, event);

      if (event.isDefaultPrevented()) {
        this.watchMode = 'idle';
        return;
      }
    }
  };
}
