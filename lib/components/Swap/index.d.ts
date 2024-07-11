import { JSX, RefObject } from 'preact';
import { Transition, TransitionEffect } from './createTransition';
export interface ChildPropsOptions {
    current: boolean;
}
export interface Props extends JSX.HTMLAttributes<HTMLDivElement> {
    childProps?: (options: ChildPropsOptions) => any;
    children: JSX.Element | null;
    className?: string;
    effect?: TransitionEffect;
    pageClassName?: string;
    uri: string;
}
export interface State {
    child: JSX.Element | null;
    index: number;
    lastChild: JSX.Element | null;
    rootRef: RefObject<HTMLDivElement>;
    transition: Transition | null;
    uri: string;
}
export declare function Swap({ childProps, children, effect, pageClassName, uri, ...props }: Props): JSX.Element;
