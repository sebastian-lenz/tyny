import { AutoPlay, AutoPlayOptions } from '../CycleableView/AutoPlay';
import { BrowseBehaviour, BrowseBehaviourOptions } from './BrowseBehaviour';
import { CycleableView, CycleableViewOptions } from '../CycleableView';
import { Sequencer, SequenceOptions } from './Sequencer';
import { Transition } from '../../fx/transitions';
export declare const slideshowDismissEvent = "tyny:slideshowDismiss";
export declare const slideshowEndEvent = "tyny:slideshowEnd";
export declare const slideshowStartEvent = "tyny:slideshowStart";
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
export declare class Slideshow extends CycleableView<SlideshowTransitionOptions> {
    autoPlay: AutoPlay;
    browseBehaviour: BrowseBehaviour;
    defaultTransition: Transition;
    isBrowsing: boolean;
    protected wasAutoPlaying: boolean;
    protected sequencer: Sequencer<SequenceOptions>;
    constructor(options: SlideshowOptions);
    get inTransition(): boolean;
    immediate(value: HTMLElement | null): void;
    onBrowseBegin(): boolean;
    onBrowseEnd(): void;
    protected onConnected(): void;
    protected onTransition(from: HTMLElement | null, to: HTMLElement | null, options?: SlideshowTransitionOptions): void;
    protected onTransitionDismiss({ from, to }: SequenceOptions): void;
    protected onTransitionEnd({ from, to }: SequenceOptions): void;
    protected onTransitionStart({ from, to }: SequenceOptions): void;
}
