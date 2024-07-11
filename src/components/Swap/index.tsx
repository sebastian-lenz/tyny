import cx from 'classnames';
import { cloneElement, createRef, JSX, RefObject } from 'preact';
import { useLayoutEffect, useState } from 'preact/hooks';

import { dissolve } from './effects/dissolve';
import {
  createTransition,
  Transition,
  TransitionEffect,
} from './createTransition';

const defaultEffect = dissolve();

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

export function Swap({
  childProps,
  children,
  effect,
  pageClassName,
  uri,
  ...props
}: Props) {
  const [state, setState] = useState<State>(() => ({
    child: children || null,
    index: 0,
    lastChild: null,
    rootRef: createRef(),
    transition: null,
    uri,
  }));

  let useStateChild = false;
  if (!state.transition) {
    if (uri !== state.uri) {
      useStateChild = true;
      const childProps = {
        child: children || null,
        lastChild: state.child,
      };

      setState({
        ...state,
        ...childProps,
        index: state.index + 1,
        transition: createTransition({
          ...childProps,
          childRef: children ? createRef() : null,
          effect: effect || defaultEffect,
          lastChildRef: state.child ? createRef() : null,
          rootRef: state.rootRef,
        }),
        uri,
      });
    } else if (state.child !== children) {
      setState({
        ...state,
        child: children || null,
      });
    }
  }

  const { index, lastChild, transition } = state;
  const elements: Array<JSX.Element> = [];
  const child = transition || useStateChild ? state.child : children;

  if (pageClassName) {
    if (lastChild) {
      elements.push(
        <div
          className={pageClassName}
          key={index - 1}
          ref={transition ? (transition.lastChildRef as any) : undefined}
        >
          {lastChild}
        </div>
      );
    }

    if (child) {
      elements.push(
        <div
          className={cx(pageClassName, 'current')}
          key={index}
          ref={transition ? (transition.childRef as any) : undefined}
        >
          {child}
        </div>
      );
    }
  } else {
    if (lastChild) {
      elements.push(
        cloneElement(lastChild, {
          ...(childProps ? childProps({ current: false }) : {}),
          key: index - 1,
          ref: transition ? transition.lastChildRef : undefined,
        })
      );
    }

    if (child) {
      elements.push(
        cloneElement(child, {
          ...(childProps ? childProps({ current: true }) : {}),
          key: index,
          ref: transition ? transition.childRef : undefined,
        })
      );
    }
  }

  useLayoutEffect(() => {
    if (transition) {
      transition.begin(() => {
        setState({
          ...state,
          lastChild: null,
          transition: null,
        });
      });
    }
  }, [transition]);

  return (
    <div {...props} ref={state.rootRef}>
      {elements}
    </div>
  );
}
