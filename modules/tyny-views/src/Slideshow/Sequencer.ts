import { Transition } from 'tyny-fx/lib/transitions';
import { EventEmitter } from 'tyny-events';
import { View, whenViewLoaded } from 'tyny';

export interface SequenceOptions<TView extends View = View> {
  from: TView | undefined;
  to: TView | undefined;
  transition: Transition;
}

export default class Sequencer<
  TOptions extends SequenceOptions = SequenceOptions
> extends EventEmitter {
  protected sequence: Promise<any> | undefined;
  protected shelved: TOptions | undefined;

  inTransition(): boolean {
    return !!this.sequence;
  }

  transist(options: TOptions) {
    const { sequence } = this;
    if (sequence) {
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
      .then(() => this.handleTransitionStart(options))
      .then(() => transition(fromElement, toElement))
      .then(() => this.handleTransitionEnd(options));
  }

  protected handleTransitionEnd(options: TOptions) {
    const { shelved } = this;
    this.shelved = undefined;

    if (shelved) {
      shelved.from = options.to;
      this.sequence = this.createSequence(shelved);
    } else {
      this.sequence = undefined;
    }

    this.emit('transitionEnd', options);
  }

  protected handleTransitionStart(options: TOptions) {
    this.emit('transitionStart', options);
  }
}
