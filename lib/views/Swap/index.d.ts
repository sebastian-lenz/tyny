import { Sequencer, SequenceOptions } from '../Slideshow/Sequencer';
import { Transition } from '../../fx/transitions';
import { View, ViewOptions } from '../../core/View';
import { TransistDimensionsOptions } from '../../fx/transistDimensions';
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
export declare const swapEndEvent = "tyny:swapEnd";
export declare const swapStartEvent = "tyny:swapStart";
export declare class Swap<TContent extends HTMLElement = HTMLElement> extends View {
    autoAppend: boolean;
    autoRemove: boolean;
    dimensions: TransistDimensionsOptions | null;
    selectedClass: string;
    sequencer: Sequencer<SwapSequencerOptions>;
    transition: Transition;
    viewport: HTMLElement;
    protected _content: TContent | null;
    constructor(options?: SwapOptions);
    get content(): TContent | null;
    set content(value: TContent | null);
    setContent(value?: TContent | null, options?: SwapTransitionOptions): void;
    protected onTransitionDismiss({ to }: SwapSequencerOptions): void;
    protected onTransitionStart({ dimensions, from, to }: SwapSequencerOptions): void;
    protected onTransitionEnd({ from, to }: SwapSequencerOptions): void;
}
