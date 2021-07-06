import { JSX } from 'preact';
import { Transition, TransitionEffect } from './createTransition';
export interface Props {
    children: JSX.Element | null;
    className?: string;
    effect?: TransitionEffect;
    pageClassName?: string;
    style?: JSX.CSSProperties;
    uri: string;
}
export interface State {
    child: JSX.Element | null;
    index: number;
    lastChild: JSX.Element | null;
    transition: Transition | null;
    uri: string;
}
export declare function Swap(props: Props): JSX.Element;
