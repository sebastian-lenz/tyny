import { $, View, ViewOptions, isSelectableView } from 'tyny';

import { Transition } from 'tyny-fx/lib/transitions';
import dissolve from 'tyny-fx/lib/transitions/dissolve';
import transistDimensions, {
  TransistDimensionsOptions,
} from 'tyny-fx/lib/transistDimensions';

import Sequencer, { SequenceOptions } from '../Slideshow/Sequencer';
import SwapContent from './SwapContent';
import SwapEvent from './SwapEvent';

export interface SwapOptions extends ViewOptions {
  appendContent?: boolean;
  disposeContent?: boolean;
  transition?: Transition;
  transist?: TransistDimensionsOptions | null;
}

export interface SwapTransitionOptions {
  transition?: Transition;
  transist?: TransistDimensionsOptions | null;
}

export interface SwapSequencerOptions<TContent extends View = View>
  extends SequenceOptions<TContent> {
  transist?: TransistDimensionsOptions | null;
}

export default class Swap<TContent extends View = View> extends View {
  @$.data({ type: 'bool', defaultValue: false })
  appendContent: boolean;

  @$.data({ type: 'bool', defaultValue: false })
  disposeContent: boolean;

  @$.data({ type: 'any', defaultValue: () => dissolve() })
  transition: Transition;

  @$.data({ type: 'any', defaultValue: null })
  transist: TransistDimensionsOptions | null;

  protected content: TContent | undefined;
  protected sequencer: Sequencer<SwapSequencerOptions<TContent>>;

  constructor(options?: SwapOptions) {
    super(options);

    const sequencer = new Sequencer<SwapSequencerOptions<TContent>>();
    sequencer.callbackContext = this;
    sequencer.endCallback = this.handleTransitionEnd;
    sequencer.startCallback = this.handleTransitionStart;
    this.sequencer = sequencer;
  }

  getContent(): TContent | undefined {
    return this.content;
  }

  setContent(content?: TContent, options: SwapTransitionOptions = {}) {
    const { content: from, sequencer, transition, transist } = this;
    if (from === content) return;
    this.content = content;

    sequencer.transist({
      transition,
      transist,
      ...options,
      from,
      to: content,
    });
  }

  protected handleTransitionStart({
    from,
    to,
    transist,
  }: SwapSequencerOptions<TContent>) {
    const { appendContent, element } = this;
    const callback = () => {
      if (isSelectableView(from)) from.setSelected(false);
      if (isSelectableView(to)) to.setSelected(true);
    };

    if (to && appendContent) {
      element.appendChild(to.element);
    }

    if (transist) {
      transistDimensions(this.element, callback, transist);
    } else {
      callback();
    }

    this.emit(
      new SwapEvent({
        from,
        target: <any>this,
        to,
        type: SwapEvent.transitionStartEvent,
      })
    );
  }

  protected handleTransitionEnd({ from, to }: SwapSequencerOptions<TContent>) {
    const { disposeContent } = this;
    if (from && disposeContent) {
      from.dispose();
    }

    this.emit(
      new SwapEvent({
        from,
        target: <any>this,
        to,
        type: SwapEvent.transitionEndEvent,
      })
    );
  }
}
