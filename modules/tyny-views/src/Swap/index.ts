import { $, View, ViewOptions, isSelectableView } from 'tyny';

import { Transition } from 'tyny-fx/lib/transitions';
import dissolve from 'tyny-fx/lib/transitions/dissolve';
import transistDimensions, {
  TransistDimensionsOptions,
} from 'tyny-fx/lib/transistDimensions';

import Content from './Content';
import Sequencer, { SequenceOptions } from '../Slideshow/Sequencer';

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

export default class Swap<
  TOptions extends SwapOptions = SwapOptions,
  TContent extends View = View
> extends View<TOptions> {
  @$.data({ type: 'bool', defaultValue: false })
  appendContent: boolean;

  @$.data({ type: 'bool', defaultValue: false })
  disposeContent: boolean;

  @$.data({ type: 'any', defaultValue: dissolve() })
  transition: Transition;

  @$.data({ type: 'any', defaultValue: null })
  transist: TransistDimensionsOptions | null;

  protected content: TContent | undefined;
  protected sequencer: Sequencer<SwapSequencerOptions<TContent>>;

  getContent(): TContent | undefined {
    return this.content;
  }

  setContent(
    content: TContent | undefined,
    options: SwapTransitionOptions = {}
  ) {
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

  protected initialize(options: TOptions) {
    const sequencer = new Sequencer<SwapSequencerOptions<TContent>>();
    this.sequencer = sequencer;

    this.listenTo(sequencer, 'transitionStart', this.handleTransitionStart);
    this.listenTo(sequencer, 'transitionEnd', this.handleTransitionEnd);
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
  }

  protected handleTransitionEnd({ from }: SwapSequencerOptions<TContent>) {
    const { disposeContent } = this;
    if (from && disposeContent) {
      from.dispose();
    }
  }
}
