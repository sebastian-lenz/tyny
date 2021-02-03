import { View, isSelectableView } from 'tyny';
import { Transition } from 'tyny-fx/lib/transitions';
import dissolve from 'tyny-fx/lib/transitions/dissolve';

import { CycleableView, CycleableViewOptions } from '../CycleableView';
import Sequencer, { SequenceOptions } from './Sequencer';
import SlideshowEvent from './SlideshowEvent';

export interface SlideshowOptions extends CycleableViewOptions {
  transition?: Transition;
}

export interface SlideshowTransitionOptions {
  transition?: Transition;
}

export default class Slideshow<
  TChild extends View = View
> extends CycleableView<TChild, SlideshowTransitionOptions> {
  transition: Transition;
  protected sequencer: Sequencer<SequenceOptions<TChild>>;

  constructor(options: SlideshowOptions = {}) {
    super({
      className: `${View.classNamePrefix}Slideshow`,
      isLooped: true,
      ...options,
    });

    const sequencer = new Sequencer<SequenceOptions<TChild>>({
      callbackContext: this,
      dismissCallback: this.handleTransitionDismiss,
      endCallback: this.handleTransitionEnd,
      startCallback: this.handleTransitionStart,
    });

    this.transition = options.transition || dissolve();
    this.sequencer = sequencer;
  }

  protected handleTransition(
    from: TChild | undefined,
    to: TChild | undefined,
    options: SlideshowTransitionOptions = {}
  ) {
    const { transition, sequencer } = this;
    sequencer.transist({ transition, from, to, ...options });
  }

  protected handleTransitionDismiss({ from, to }: SequenceOptions<TChild>) {
    this.emit(
      new SlideshowEvent({
        from,
        target: <any>this,
        to,
        type: SlideshowEvent.transitionDismissEvent,
      })
    );
  }

  protected handleTransitionStart({ from, to }: SequenceOptions<TChild>) {
    if (isSelectableView(from)) {
      from.setSelected(false);
    }

    if (isSelectableView(to)) {
      to.setSelected(true);
    }

    this.emit(
      new SlideshowEvent({
        from,
        target: <any>this,
        to,
        type: SlideshowEvent.transitionStartEvent,
      })
    );
  }

  protected handleTransitionEnd({ from, to }: SequenceOptions<TChild>) {
    this.emit(
      new SlideshowEvent({
        from,
        target: <any>this,
        to,
        type: SlideshowEvent.transitionEndEvent,
      })
    );
  }
}
