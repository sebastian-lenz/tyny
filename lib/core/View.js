import { emitUpdate } from './components/components';
import { fastDom } from './components';
import { find, findAll } from '../utils/dom/node/find';
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
    callUpdate(type = 'update') {
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
        return this.findAllViews(selector, ctor)[0] || null;
    }
    findAll(selector) {
        return findAll(selector, this.el);
    }
    findAllViews(selector, ctor) {
        return findAll(selector, this.el).reduce((result, element) => {
            const views = element.__tynyViews;
            if (!views)
                return result;
            for (const name in views) {
                const view = views[name];
                if (view instanceof ctor) {
                    result.push(view);
                }
            }
            return result;
        }, []);
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
    _callDisconnected() {
        super._callDisconnected();
        this._behaviours.forEach((api) => api._callDisconnected());
    }
}
