import { fade } from '../../fx/transitions/fade';
import { removeNode } from '../../utils/dom/node';
import { Sequencer, SequenceOptions } from '../Slideshow/Sequencer';
import { Transition } from '../../fx/transitions';
import { View, ViewOptions } from '../../core/View';

import {
  transistDimensions,
  TransistDimensionsOptions,
} from '../../fx/transistDimensions';

export interface SwapOptions extends ViewOptions {
  autoAppend?: boolean;
  autoRemove?: boolean;
  dimensions?: TransistDimensionsOptions | null;
  content?: string | HTMLElement;
  selectedClass?: string;
  transition?: Transition;
  viewport?: string | HTMLElement;
}

export interface SwapEventArgs {
  from: HTMLElement | null;
  target: Swap;
  to: HTMLElement | null;
}

export interface SwapTransitionOptions {
  transition?: Transition;
  dimensions?: TransistDimensionsOptions | null;
}

export interface SwapSequencerOptions extends SequenceOptions {
  dimensions?: TransistDimensionsOptions | null;
}

export const swapEndEvent = 'tyny:swapEnd';
export const swapStartEvent = 'tyny:swapStart';

export class Swap<TContent extends HTMLElement = HTMLElement> extends View {
  autoAppend: boolean;
  autoRemove: boolean;
  dimensions: TransistDimensionsOptions | null;
  selectedClass: string;
  sequencer: Sequencer<SwapSequencerOptions>;
  transition: Transition;
  viewport: HTMLElement;
  protected _content: TContent | null = null;

  constructor(options: SwapOptions = {}) {
    super(options);

    this.autoAppend = options.autoAppend || false;
    this.autoRemove = options.autoRemove || false;
    this.dimensions = options.dimensions || null;
    this.selectedClass = options.selectedClass || 'selected';
    this.transition = options.transition || fade();
    this._content = this.params.element({ name: 'content' }) || null;

    this.viewport = this.params.element({
      defaultValue: this.el,
      name: 'viewport',
    });

    this.sequencer = new Sequencer<SwapSequencerOptions>({
      callbackContext: this,
      dismissCallback: this.onTransitionDismiss,
      endCallback: this.onTransitionEnd,
      startCallback: this.onTransitionStart,
    });
  }

  get content(): TContent | null {
    return this._content;
  }

  set content(value: TContent | null) {
    this.setContent(value);
  }

  setContent(
    value: TContent | null = null,
    options: SwapTransitionOptions = {}
  ) {
    const { dimensions, content, sequencer, transition } = this;
    if (content === value) {
      return;
    }

    this._content = value;

    sequencer.transist({
      transition,
      dimensions,
      ...options,
      from: content,
      to: value,
    });
  }

  protected onTransitionDismiss({ to }: SwapSequencerOptions) {
    if (to && this.autoRemove) {
      removeNode(to);
    }
  }

  protected onTransitionStart({ dimensions, from, to }: SwapSequencerOptions) {
    const { autoAppend, selectedClass, viewport } = this;
    const callback = () => {
      if (from) from.classList.remove(selectedClass);
      if (to) to.classList.add(selectedClass);
    };

    if (to && autoAppend) {
      viewport.appendChild(to);
    }

    if (dimensions) {
      transistDimensions(this.viewport, callback, dimensions);
    } else {
      callback();
    }

    this.trigger(swapStartEvent, <SwapEventArgs>{
      from,
      target: this,
      to,
    });
  }

  protected onTransitionEnd({ from, to }: SwapSequencerOptions) {
    if (from && this.autoRemove) {
      removeNode(from);
    }

    this.trigger(swapEndEvent, <SwapEventArgs>{
      from,
      target: this,
      to,
    });
  }
}
