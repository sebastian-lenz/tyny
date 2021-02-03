import Behaviour from './Behaviour';
import PointerList from '../PointerList';
import PointerListEvent from '../PointerListEvent';
import TransformEvent from './TransformEvent';

export default class TransformBehaviour extends Behaviour {
  maxPointers: number | undefined;
  minPointers: number = 1;

  protected isActive: boolean = false;

  constructor(list: PointerList) {
    super(list);

    this.listenTo(list, PointerListEvent.addEvent, this.handlePointerAdd);
    this.listenTo(list, PointerListEvent.removeEvent, this.handlePointerRemove);
    this.listenTo(list, PointerListEvent.updateEvent, this.handlePointerUpdate);
  }

  protected emitTransformEvent(
    type: string,
    listEvent: PointerListEvent
  ): boolean {
    const event = new TransformEvent({
      listEvent,
      target: this,
      type,
    });

    this.emit(event);
    return event.isDefaultPrevented();
  }

  protected handlePointerAdd = (event: PointerListEvent) => {
    const { isActive, list, maxPointers, minPointers } = this;
    const numPointers = list.pointers.length + 1;
    if (numPointers < minPointers) {
      return;
    }

    if (typeof maxPointers === 'number' && numPointers >= maxPointers) {
      event.preventDefault();
      if (isActive) {
        this.emitTransformEvent(TransformEvent.transformEndEvent, event);
        this.isActive = false;
      }
    } else if (!isActive) {
      this.emitTransformEvent(TransformEvent.transformStartEvent, event);
      if (!event.isDefaultPrevented()) {
        this.isActive = true;
      }
    }
  };

  protected handlePointerRemove = (event: PointerListEvent) => {
    const { isActive, list, minPointers } = this;
    const numPointers = list.pointers.length - 1;

    if (isActive && numPointers < minPointers) {
      this.emitTransformEvent(TransformEvent.transformEndEvent, event);
      this.isActive = false;
    }
  };

  protected handlePointerUpdate = (event: PointerListEvent) => {
    if (this.isActive) {
      this.emitTransformEvent(TransformEvent.transformEvent, event);
    }
  };
}
