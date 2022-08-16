import { Transition } from '../../fx/transitions';
export interface SequenceOptions {
    from: HTMLElement | null;
    to: HTMLElement | null;
    transition: Transition;
}
export declare type SequencerCallback<TOptions extends SequenceOptions = SequenceOptions> = (options: TOptions) => void;
export interface SequencerOptions<TOptions extends SequenceOptions = SequenceOptions> {
    callbackContext?: any;
    dismissCallback?: SequencerCallback<TOptions> | null;
    endCallback?: SequencerCallback<TOptions> | null;
    startCallback?: SequencerCallback<TOptions> | null;
}
export declare class Sequencer<TOptions extends SequenceOptions = SequenceOptions> {
    readonly callbackContext: any;
    readonly dismissCallback: SequencerCallback<TOptions> | null;
    readonly endCallback: SequencerCallback<TOptions> | null;
    readonly startCallback: SequencerCallback<TOptions> | null;
    protected sequence: Promise<any> | null;
    protected shelved: TOptions | null;
    constructor(options?: SequencerOptions<TOptions>);
    createSequence(options: TOptions): Promise<void>;
    inTransition(): boolean;
    onTransitionEnd(options: TOptions): void | Promise<void>;
    onTransitionStart(options: TOptions): void | Promise<void>;
    transist(options: TOptions): void;
}
