import { __rest } from "tslib";
import { jsx as _jsx } from "preact/jsx-runtime";
import cx from 'classnames';
import { cloneElement, createRef } from 'preact';
import { useLayoutEffect, useState } from 'preact/hooks';
import { dissolve } from './effects/dissolve';
import { createTransition, } from './createTransition';
const defaultEffect = dissolve();
export function Swap(_a) {
    var { childProps, children, effect, pageClassName, uri } = _a, props = __rest(_a, ["childProps", "children", "effect", "pageClassName", "uri"]);
    const [state, setState] = useState(() => ({
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
            setState(Object.assign(Object.assign(Object.assign({}, state), childProps), { index: state.index + 1, transition: createTransition(Object.assign(Object.assign({}, childProps), { childRef: children ? createRef() : null, effect: effect || defaultEffect, lastChildRef: state.child ? createRef() : null, rootRef: state.rootRef })), uri }));
        }
        else if (state.child !== children) {
            setState(Object.assign(Object.assign({}, state), { child: children || null }));
        }
    }
    const { index, lastChild, transition } = state;
    const elements = [];
    const child = transition || useStateChild ? state.child : children;
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
            elements.push(cloneElement(lastChild, Object.assign(Object.assign({}, (childProps ? childProps({ current: false }) : {})), { key: index - 1, ref: transition ? transition.lastChildRef : undefined })));
        }
        if (child) {
            elements.push(cloneElement(child, Object.assign(Object.assign({}, (childProps ? childProps({ current: true }) : {})), { key: index, ref: transition ? transition.childRef : undefined })));
        }
    }
    useLayoutEffect(() => {
        if (transition) {
            transition.begin(() => {
                setState(Object.assign(Object.assign({}, state), { lastChild: null, transition: null }));
            });
        }
    }, [transition]);
    return (_jsx("div", Object.assign({}, props, { ref: state.rootRef }, { children: elements })));
}
