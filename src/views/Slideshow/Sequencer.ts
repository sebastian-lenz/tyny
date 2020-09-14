import { Transition } from '../../fx/transitions';
import { whenLoaded } from '../../utils/views/loadable';

export interface SequenceOptions {
  from: HTMLElement | null;
  to: HTMLElement | null;
  transition: Transition;
}

export type SequencerCallback<
  TOptions extends SequenceOptions = SequenceOptions
> = (options: TOptions) => void;

export interface SequencerOptions<
  TOptions extends SequenceOptions = SequenceOptions
> {
  callbackContext?: any;
  dismissCallback?: SequencerCallback<TOptions> | null;
  endCallback?: SequencerCallback<TOptions> | null;
  startCallback?: SequencerCallback<TOptions> | null;
}

export class Sequencer<TOptions extends SequenceOptions = SequenceOptions> {
  readonly callbackContext: any = null;
  readonly dismissCallback: SequencerCallback<TOptions> | null = null;
  readonly endCallback: SequencerCallback<TOptions> | null = null;
  readonly startCallback: SequencerCallback<TOptions> | null = null;
  protected sequence: Promise<any> | null = null;
  protected shelved: TOptions | null = null;

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

    return whenLoaded(to)
      .then(() => {
        this.onTransitionStart(options);
        return transition(from, to);
      })
      .then(() => this.onTransitionEnd(options));
  }

  protected onTransitionEnd(options: TOptions) {
    const { callbackContext, shelved, endCallback } = this;
    const { from, to } = options;
    this.shelved = null;

    if (from) {
      from.classList.remove('sequenceFrom');
    }

    if (to) {
      to.classList.remove('sequenceTo');
    }

    if (shelved) {
      shelved.from = options.to;
      this.sequence = this.createSequence(shelved);
    } else {
      this.sequence = null;
    }

    if (endCallback) {
      endCallback.call(callbackContext, options);
    }
  }

  protected onTransitionStart(options: TOptions) {
    const { from, to } = options;
    const { callbackContext, startCallback } = this;
    if (startCallback) {
      startCallback.call(callbackContext, options);
    }

    if (from) {
      from.classList.add('sequenceFrom');
    }

    if (to) {
      to.classList.add('sequenceTo');
    }
  }
}
