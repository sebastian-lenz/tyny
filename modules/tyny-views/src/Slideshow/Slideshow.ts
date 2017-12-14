import { View } from 'tyny';
import { Transition } from 'tyny-fx/lib/transitions';
import dissolve from 'tyny-fx/lib/transitions/dissolve';

import { CycleableView, CycleableViewOptions } from '../CycleableView';
import Sequencer from './Sequencer';
import SlideshowSlide from './SlideshowSlide';

export interface SlideshowOptions extends CycleableViewOptions {
  transition?: Transition;
}

export interface SlideshowTransitionOptions {
  transition?: Transition;
}

export default class Slideshow<
  TChild extends View = SlideshowSlide
> extends CycleableView<TChild, SlideshowTransitionOptions> {
  transition: Transition;
  protected sequencer: Sequencer;

  constructor(options: SlideshowOptions = {}) {
    super({
      className: `${View.classNamePrefix}Slideshow`,
      ...options,
    });

    const sequencer = new Sequencer();
    sequencer.callbackContext = this;
    sequencer.endCallback = this.handleTransitionEnd;
    sequencer.startCallback = this.handleTransitionStart;

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

  protected handleTransitionEnd() {}

  protected handleTransitionStart() {}
}
