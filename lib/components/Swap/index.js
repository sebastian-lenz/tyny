import { jsx as _jsx } from "preact/jsx-runtime";
import cx from 'classnames';
import { cloneElement, createRef } from 'preact';
import { useLayoutEffect, useState } from 'preact/hooks';
import { dissolve } from './effects/dissolve';
import { createTransition, } from './createTransition';
const defaultEffect = dissolve();
export function Swap(props) {
    const [state, setState] = useState({
        child: props.children || null,
        index: 0,
        lastChild: null,
        rootRef: createRef(),
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
        setState(Object.assign(Object.assign(Object.assign({}, state), children), { index: state.index + 1, transition: createTransition(Object.assign(Object.assign({}, children), { childRef: props.children ? createRef() : null, effect: props.effect || defaultEffect, lastChildRef: state.child ? createRef() : null, rootRef: state.rootRef })), uri: props.uri }));
    }
    else if (state.child !== props.children) {
        setState(Object.assign(Object.assign({}, state), { child: props.children || null }));
    }
    const { index, lastChild, transition } = state;
    const { className, pageClassName, style } = props;
    const elements = [];
    const child = transition || useStateChild ? state.child : props.children;
    if (pageClassName) {
        if (lastChild) {
            elements.push(_jsx("div", Object.assign({ className: pageClassName, ref: transition ? transition.lastChildRef : undefined }, { children: lastChild }), index - 1));
        }
        if (child) {
            elements.push(_jsx("div", Object.assign({ className: cx(pageClassName, 'current'), ref: transition ? transition.childRef : undefined }, { children: child }), index));
        }
    }
    else {
        if (lastChild) {
            elements.push(cloneElement(lastChild, {
                key: index - 1,
                ref: transition ? transition.lastChildRef : undefined,
            }));
        }
        if (child) {
            elements.push(cloneElement(child, {
                key: index,
                ref: transition ? transition.childRef : undefined,
            }));
        }
    }
    useLayoutEffect(() => {
        if (transition) {
            transition.begin(() => {
                setState(Object.assign(Object.assign({}, state), { lastChild: null, transition: null }));
            });
        }
    }, [transition]);
    return (_jsx("div", Object.assign({ className: className, ref: state.rootRef, style: style }, { children: elements })));
}
