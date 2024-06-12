import { JSX, RefObject, VNode } from 'preact';
import { Transition, TransitionEffect } from './createTransition';
export interface Props extends JSX.HTMLAttributes<HTMLDivElement> {
    children: JSX.Element | null;
    className?: string;
    effect?: TransitionEffect;
    pageClassName?: string;
    pageDecorator?: (node: VNode, current: boolean) => VNode;
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
export declare function Swap({ children, effect, pageClassName, pageDecorator, uri, ...props }: Props): JSX.Element;
