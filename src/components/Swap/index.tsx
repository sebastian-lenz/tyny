import cx from 'classnames';
import { useState } from 'preact/hooks';
import { cloneElement, createRef, JSX } from 'preact';

import { dissolve } from './effects/dissolve';
import {
  createTransition,
  Transition,
  TransitionEffect,
} from './createTransition';

const defaultEffect = dissolve();

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

export function Swap(props: Props) {
  const rootRef = createRef();
  const [state, setState] = useState<State>({
    child: props.children || null,
    index: 0,
    lastChild: null,
    transition: null,
    uri: props.uri,
  });

  let useStateChild = false;
  if (props.uri !== state.uri && !state.transition) {
    useStateChild = true;
    const children = {
      child: props.children || null,
      lastChild: state.child,
    };

    setState({
      ...state,
      ...children,
      index: state.index + 1,
      transition: createTransition({
        ...children,
        childRef: props.children ? createRef() : null,
        effect: props.effect || defaultEffect,
        lastChildRef: state.child ? createRef() : null,
        rootRef,
      }),
      uri: props.uri,
    });
  } else if (state.child !== props.children) {
    setState({
      ...state,
      child: props.children || null,
    });
  }

  const { index, lastChild, transition } = state;
  const { className, pageClassName, style } = props;
  const elements: Array<JSX.Element> = [];
  const child = transition || useStateChild ? state.child : props.children;

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
          key: index - 1,
          ref: transition ? transition.lastChildRef : undefined,
        })
      );
    }

    if (child) {
      elements.push(
        cloneElement(child, {
          key: index,
          ref: transition ? transition.childRef : undefined,
        })
      );
    }
  }

  transition?.begin(() => {
    setState({
      ...state,
      lastChild: null,
      transition: null,
    });
  });

  return (
    <div className={className} ref={rootRef} style={style}>
      {elements}
    </div>
  );
}
