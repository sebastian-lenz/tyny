import { clearViewCache, emitUpdate } from './components/components';
import { fastDom } from './components';
import { find, findAll } from '../utils/dom/node/find';
import { findAllViews, findView } from '../utils/dom/node/findView';
import { isEmpty } from '../utils/lang/misc/isEmpty';
import { Lifecycle } from './Lifecycle';
import { Params } from './Params';
import { removeNode } from '../utils/dom/node/removeNode';
import { trigger } from '../utils/dom/event/trigger';
import { within } from '../utils/dom/node/within';
import { createElement, } from '../utils/dom/node/createElement';
let uid = 0;
export class View extends Lifecycle {
    constructor(options = {}) {
        super();
        this._behaviours = [];
        const { className: extraClassName, name } = this._component;
        const el = options.el || createElement(Object.assign(Object.assign({}, options), { extraClassName }));
        const views = el.__tynyViews || (el.__tynyViews = {});
        if (name in views) {
            throw new Error(`View ${name} already exists on target.`);
        }
        else {
            views[name] = this;
        }
        this.el = el;
        this.params = new Params(this, options);
        this.uid = uid++;
        clearViewCache();
        if (within(el, document)) {
            fastDom.read(this._callConnected.bind(this));
        }
    }
    get behaviours() {
        return [...this._behaviours];
    }
    get component() {
        return this._component;
    }
    addClass(...tokens) {
        this.el.classList.add(...tokens);
        return this;
    }
    callUpdate(type) {
        super.callUpdate(type);
        this._behaviours.forEach((api) => api.callUpdate(type));
    }
    destroy(options) {
        const { el, _component } = this;
        super.destroy();
        if (el.__tynyViews) {
            delete el.__tynyViews[_component.name];
            if (isEmpty(el.__tynyViews)) {
                delete el.__tynyViews;
            }
        }
        if (options && options.remove) {
            removeNode(el);
        }
    }
    find(selector) {
        return find(selector, this.el);
    }
    findView(selector, ctor) {
        return findView(selector, this.el, ctor);
    }
    findAll(selector) {
        return findAll(selector, this.el);
    }
    findAllViews(selector, ctor) {
        return findAllViews(selector, this.el, ctor);
    }
    hasClass(token) {
        return this.el.classList.contains(token);
    }
    removeClass(...tokens) {
        this.el.classList.remove(...tokens);
        return this;
    }
    toggleClass(token, force) {
        this.el.classList.toggle(token, force);
        return this;
    }
    trigger(event, detail) {
        trigger(this.el, event, detail);
    }
    triggerUpdate(type) {
        emitUpdate(this.el, type);
    }
    // Protected methods
    // -----------------
    addBehaviour(ctor, options = {}) {
        const behaviour = new ctor(this, options);
        this._behaviours.push(behaviour);
        return behaviour;
    }
    // Lifecycle API
    // -------------
    _callConnected() {
        super._callConnected();
        this._behaviours.forEach((api) => api._callConnected());
        this.callUpdate();
    }
    _callDestroyed() {
        super._callDestroyed();
        this._behaviours.forEach((api) => api._callDestroyed());
    }
    _callDisconnected() {
        super._callDisconnected();
        this._behaviours.forEach((api) => api._callDisconnected());
    }
}
