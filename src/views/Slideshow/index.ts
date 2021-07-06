import { AutoPlay, AutoPlayOptions } from '../CycleableView/AutoPlay';
import { BrowseBehaviour, BrowseBehaviourOptions } from './BrowseBehaviour';
import { CycleableView, CycleableViewOptions } from '../CycleableView';
import { dissolve } from '../../fx/transitions/dissolve';
import { LoadMode, setChildLoadMode } from '../../utils/views/loadMode';
import { Sequencer, SequenceOptions } from './Sequencer';
import { Transition } from '../../fx/transitions';

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
  browse?: BrowseBehaviourOptions;
  transition?: Transition;
}

export interface SlideshowTransitionOptions {
  transition?: Transition;
}

export class Slideshow extends CycleableView<SlideshowTransitionOptions> {
  public autoPlay: AutoPlay;
  public browseBehaviour: BrowseBehaviour;
  public defaultTransition: Transition;
  public isBrowsing: boolean = false;
  protected wasAutoPlaying: boolean = false;
  protected sequencer!: Sequencer<SequenceOptions>;

  constructor(options: SlideshowOptions) {
    super({
      initialIndex: 0,
      isLooped: true,
      ...options,
    });

    this.autoPlay = this.addBehaviour(AutoPlay, options.autoPlay);
    this.browseBehaviour = this.addBehaviour(BrowseBehaviour, options.browse);
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

    if (!this.isBrowsing) {
      this.isBrowsing = true;
      this.wasAutoPlaying = this.autoPlay.isStarted;
      this.autoPlay.pause();
    }

    return true;
  }

  onBrowseEnd(): void {
    this.isBrowsing = false;
    if (this.wasAutoPlaying) {
      this.autoPlay.start();
    }
  }

  protected onConnected() {
    const { current, items } = this;
    items.forEach((item) => {
      if (item !== current) setChildLoadMode(item, LoadMode.Explicit);
    });

    super.onConnected();
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

    const { currentIndex, items } = this;
    for (let index = 0; index < items.length; index++) {
      setChildLoadMode(
        items[index],
        Math.abs(index - currentIndex) < 2
          ? LoadMode.Visibility
          : LoadMode.Explicit
      );
    }
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
