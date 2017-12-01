import { View } from 'tyny';
import { Transition } from 'tyny-fx/lib/transitions';
import dissolve from 'tyny-fx/lib/transitions/dissolve';

import CycleableView, { CycleableViewOptions } from '../CycleableView/index';
import Sequencer from './Sequencer';
import Slide from './Slide';

export interface SlideshowOptions extends CycleableViewOptions {
  transition?: Transition;
}

export interface SlideshowTransitionOptions {
  transition?: Transition;
}

export default class Slideshow<
  TOptions extends SlideshowOptions = SlideshowOptions,
  TChild extends View = Slide
> extends CycleableView<TOptions, TChild, SlideshowTransitionOptions> {
  transition: Transition;
  protected sequencer: Sequencer;

  constructor(options: TOptions) {
    super(
      Object.assign(
        {
          className: `${View.classNamePrefix}Slideshow`,
        },
        options
      )
    );
  }

  protected initialize(options: TOptions) {
    const sequencer = new Sequencer();
    this.listenTo(sequencer, 'transitionStart', this.handleTransitionStart);
    this.listenTo(sequencer, 'transitionEnd', this.handleTransitionEnd);

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
