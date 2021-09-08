import { __decorate } from "tslib";
import { BehaviourModifier } from './BehaviourModifier';
import { event, getChildViews, property } from '../../core';
import { fetch } from '../../utils/env/fetch';
import { Swap } from '../Swap';
import { Url } from '../../utils/types/Url';
import { ViewModifier } from './ViewModifier';
export const filterChangedEvent = 'tyny:filterChanged';
export class FilterableView extends Swap {
    constructor(options) {
        super(Object.assign(Object.assign({}, options), { autoAppend: true, autoRemove: true }));
        //
        this.skipSameUrl = true;
        this.staticParams = {};
        this._basePath = '';
        this._hasChanges = false;
        this._request = null;
    }
    get modifiers() {
        return [
            ...this.behaviours.filter((b) => b instanceof BehaviourModifier),
            ...getChildViews(this.el).filter((v) => v instanceof ViewModifier),
        ];
    }
    commit({ disableLoad } = {}) {
        if (this._hasChanges)
            return;
        this._hasChanges = true;
        setTimeout(() => {
            const url = this.getUrl();
            if (this.skipSameUrl && window.location.href === url) {
                this._hasChanges = false;
                return;
            }
            window.history.pushState(null, document.title, url);
            if (!disableLoad) {
                this.load();
            }
            this.trigger(filterChangedEvent, { target: this });
            this._hasChanges = false;
        }, 50);
    }
    getParams(overrides = {}) {
        return this.modifiers.reduce((params, modifier) => (Object.assign(Object.assign({}, modifier.getParams()), params)), overrides);
    }
    getUrl(overrides = {}, path = this._basePath) {
        return Url.compose({
            path,
            query: this.getParams(overrides),
        });
    }
    softReset() {
        this.modifiers.forEach((modifier) => modifier.softReset());
    }
    sync(silent = false) {
        const { modifiers } = this;
        const url = new Url(window.location.href);
        const hasChanged = modifiers.reduce((hasChanged, modifier) => modifier.sync({ silent, url }) || hasChanged, false);
        if (!this._basePath) {
            this._basePath = url.path;
        }
        if (hasChanged && !silent) {
            this.load();
            this.trigger(filterChangedEvent, { target: this });
        }
    }
    // Protected methods
    // -----------------
    createRequest() {
        const { responseCache } = FilterableView;
        const url = this.getUrl(this.staticParams, this._fetchPath);
        if (url in responseCache) {
            return Promise.resolve(responseCache[url]);
        }
        return fetch(url)
            .then((response) => response.text())
            .then((html) => (responseCache[url] = html));
    }
    findContent(doc) {
        return doc.body.firstElementChild;
    }
    load() {
        const request = (this._request = this.createRequest().then((result) => {
            if (this._request !== request)
                return;
            this._request = null;
            if (result === null) {
                this.setContent(null);
            }
            else if (result !== false) {
                const parser = new DOMParser();
                const document = parser.parseFromString(result, 'text/html');
                this.setContent(this.findContent(document));
            }
        }));
    }
    onConnected() {
        this.sync(true);
    }
    onPopState() {
        this.sync();
    }
}
FilterableView.responseCache = {};
__decorate([
    property()
], FilterableView.prototype, "modifiers", null);
__decorate([
    event({ name: 'popstate', target: window })
], FilterableView.prototype, "onPopState", null);
