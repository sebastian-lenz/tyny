import { AutoPlay, AutoPlayOptions } from '../CycleableView/AutoPlay';
import { CycleableView, CycleableViewOptions } from '../CycleableView';
import { dissolve } from '../../fx/transitions/dissolve';
import { Sequencer, SequenceOptions } from './Sequencer';
import { Transition } from '../../fx/transitions';
import { BrowseBehaviour } from './BrowseBehaviour';

export const slideshowDismissEvent = 'tyny:slideshowDismiss';
export const slideshowEndEvent = 'tyny:slideshowEnd';
export const slideshowStartEvent = 'tyny:slideshowStart';

export interface SlideshowEventArgs {
  from: HTMLElement | null;
  target: Slideshow;
  to: HTMLElement | null;
}

export interface SlideshowOptions extends CycleableViewOptions {
  autoPlay?: AutoPlayOptions;
  transition?: Transition;
}

export interface SlideshowTransitionOptions {
  transition?: Transition;
}

export class Slideshow extends CycleableView<SlideshowTransitionOptions> {
  public autoPlay: AutoPlay;
  public browseBehaviour: BrowseBehaviour;
  public defaultTransition: Transition;
  protected sequencer!: Sequencer<SequenceOptions>;

  constructor(options: SlideshowOptions) {
    super({
      initialIndex: 0,
      isLooped: true,
      ...options,
    });

    this.autoPlay = this.addBehaviour(AutoPlay, options.autoPlay);
    this.browseBehaviour = this.addBehaviour(BrowseBehaviour);
    this.defaultTransition = options.transition || dissolve();

    this.sequencer = new Sequencer<SequenceOptions>({
      callbackContext: this,
      dismissCallback: this.onTransitionDismiss,
      endCallback: this.onTransitionEnd,
      startCallback: this.onTransitionStart,
    });
  }

  get inTransition(): boolean {
    return this.sequencer.inTransition();
  }

  immediate(value: HTMLElement | null) {
    this.transist(value, { transition: () => Promise.resolve() });
  }

  onBrowseBegin(): boolean {
    if (this.inTransition) {
      return false;
    }

    this.autoPlay.pause();
    return true;
  }

  onBrowseEnd(): void {
    this.autoPlay.start();
  }

  protected onTransition(
    from: HTMLElement | null,
    to: HTMLElement | null,
    options: SlideshowTransitionOptions = {}
  ) {
    const { defaultTransition, sequencer } = this;
    const transition = from ? defaultTransition : () => Promise.resolve();

    sequencer.transist({
      transition,
      from,
      to,
      ...options,
    });
  }

  protected onTransitionDismiss({ from, to }: SequenceOptions) {
    this.trigger(slideshowDismissEvent, <SlideshowEventArgs>{
      from,
      target: this,
      to,
    });
  }

  protected onTransitionEnd({ from, to }: SequenceOptions) {
    this.trigger(slideshowEndEvent, <SlideshowEventArgs>{
      from,
      target: this,
      to,
    });
  }

  protected onTransitionStart({ from, to }: SequenceOptions) {
    if (from) {
      from.classList.remove('selected');
    }

    if (to) {
      to.classList.add('selected');
    }

    this.trigger(slideshowStartEvent, <SlideshowEventArgs>{
      from,
      target: this,
      to,
    });
  }
}
