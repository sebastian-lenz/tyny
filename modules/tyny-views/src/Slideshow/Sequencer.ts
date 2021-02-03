import { Transition } from 'tyny-fx/lib/transitions';
import { EventEmitter } from 'tyny-events';
import { View, whenViewLoaded } from 'tyny';

export interface SequencerOptions<
  TOptions extends SequenceOptions = SequenceOptions
> {
  callbackContext?: any;
  dismissCallback?: SequencerCallback<TOptions> | undefined;
  endCallback?: SequencerCallback<TOptions> | undefined;
  startCallback?: SequencerCallback<TOptions> | undefined;
}

export interface SequenceOptions<TView extends View = View> {
  from: TView | undefined;
  to: TView | undefined;
  transition: Transition;
}

export type SequencerCallback<
  TOptions extends SequenceOptions = SequenceOptions
> = (options: TOptions) => void;

export default class Sequencer<
  TOptions extends SequenceOptions = SequenceOptions
> {
  callbackContext: any;
  dismissCallback: SequencerCallback<TOptions> | undefined;
  endCallback: SequencerCallback<TOptions> | undefined;
  startCallback: SequencerCallback<TOptions> | undefined;

  protected sequence: Promise<any> | undefined;
  protected shelved: TOptions | undefined;

  constructor(options: SequencerOptions<TOptions> = {}) {
    Object.assign(this, options);
  }

  inTransition(): boolean {
    return !!this.sequence;
  }

  transist(options: TOptions) {
    const { callbackContext, dismissCallback, sequence } = this;

    if (sequence) {
      if (this.shelved && dismissCallback) {
        dismissCallback.call(callbackContext, this.shelved);
      }
      this.shelved = options;
    } else {
      this.sequence = this.createSequence(options);
    }
  }

  protected createSequence(options: TOptions): Promise<any> {
    const { transition, from, to } = options;
    const fromElement = from ? from.element : undefined;
    const toElement = to ? to.element : undefined;

    return whenViewLoaded(to)
      .then(() => {
        this.handleTransitionStart(options);
        return transition(fromElement, toElement);
      })
      .then(() => this.handleTransitionEnd(options));
  }

  protected handleTransitionEnd(options: TOptions) {
    const { callbackContext, shelved, endCallback } = this;
    const { from, to } = options;
    this.shelved = undefined;

    if (from) {
      from.removeClass('sequenceFrom');
    }

    if (to) {
      to.removeClass('sequenceTo');
    }

    if (shelved) {
      shelved.from = options.to;
      this.sequence = this.createSequence(shelved);
    } else {
      this.sequence = undefined;
    }

    if (endCallback) {
      endCallback.call(callbackContext, options);
    }
  }

  protected handleTransitionStart(options: TOptions) {
    const { from, to } = options;
    const { callbackContext, startCallback } = this;
    if (startCallback) {
      startCallback.call(callbackContext, options);
    }

    if (from) {
      from.addClass('sequenceFrom');
    }

    if (to) {
      to.addClass('sequenceTo');
    }
  }
}
