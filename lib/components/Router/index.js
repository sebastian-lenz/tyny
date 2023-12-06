import { jsx as _jsx } from "preact/jsx-runtime";
import { useContext } from 'preact/hooks';
import { cloneElement, Component, createContext, toChildArray } from 'preact';
import { delegateLinkHandler } from './Link';
import { exec, pathRankSort, prepareVNodeForRanking } from './utils';
const routers = [];
let customHistory = null;
function canRoute(url) {
    for (let i = routers.length; i--;) {
        if (routers[i].canRoute(url))
            return true;
    }
    return false;
}
function routeTo(url) {
    let didRoute = false;
    for (let i = 0; i < routers.length; i++) {
        if (routers[i].routeTo(url) === true) {
            didRoute = true;
        }
    }
    return didRoute;
}
let eventListenersInitialized = false;
function initEventListeners() {
    if (eventListenersInitialized)
        return;
    if (typeof addEventListener === 'function') {
        if (!customHistory) {
            addEventListener('popstate', () => {
                routeTo(getCurrentUrl());
            });
        }
        addEventListener('click', delegateLinkHandler);
    }
    eventListenersInitialized = true;
}
function setUrl(url, type = 'push') {
    for (let i = 0; i < routers.length; i++) {
        routers[i].routeWillChange(url);
    }
    if (customHistory && customHistory[type]) {
        customHistory[type](url);
    }
    else if (typeof history !== 'undefined' && history[`${type}State`]) {
        history[`${type}State`](null, '', url);
    }
}
export const RouterContext = createContext({});
export function getCurrentUrl() {
    let url;
    if (customHistory && customHistory.location) {
        url = customHistory.location;
    }
    else if (customHistory && customHistory.getCurrentLocation) {
        url = customHistory.getCurrentLocation();
    }
    else {
        url = typeof location !== 'undefined' ? location : {};
    }
    return `${url.pathname || ''}${url.search || ''}`;
}
export function route(url, replace) {
    if (typeof url !== 'string') {
        replace = url.replace;
        url = url.url;
    }
    if (canRoute(url)) {
        setUrl(url, replace ? 'replace' : 'push');
    }
    return routeTo(url);
}
export function useRouter() {
    return [useContext(RouterContext), route];
}
export class Router extends Component {
    constructor(props) {
        super(props);
        this.updating = false;
        if (props.history) {
            customHistory = props.history;
        }
        this.contextValue = {};
        this.state = {
            url: props.url || getCurrentUrl(),
        };
        initEventListeners();
    }
    shouldComponentUpdate(props) {
        if (props.static !== true)
            return true;
        return (props.url !== this.props.url || props.onChange !== this.props.onChange);
    }
    canRoute(url) {
        const children = toChildArray(this.props.children);
        return this.getMatchingChildren(children, url, false).length > 0;
    }
    routeTo(url) {
        this.setState({ url });
        const didRoute = this.canRoute(url);
        if (!this.updating)
            this.forceUpdate();
        return didRoute;
    }
    componentWillMount() {
        this.updating = true;
    }
    componentDidMount() {
        routers.push(this);
        if (customHistory) {
            this.unlisten = customHistory.listen((action) => {
                let location = action.location || action;
                this.routeTo(`${location.pathname || ''}${location.search || ''}`);
            });
        }
        this.updating = false;
    }
    componentWillUnmount() {
        if (typeof this.unlisten === 'function') {
            this.unlisten();
        }
        routers.splice(routers.indexOf(this), 1);
    }
    componentWillUpdate() {
        this.updating = true;
    }
    componentDidUpdate() {
        this.updating = false;
    }
    getCurrent() {
        const { children } = this.props;
        const { url } = this.state;
        const previous = this.previousUrl;
        const active = this.getMatchingChildren(toChildArray(children), url, true);
        const { vnode: current, matches } = active[0] || {
            vnode: null,
            matches: null,
        };
        if (url !== previous) {
            const newContext = this.onChange({
                router: this,
                url,
                previous,
                active: active.map((a) => a.vnode),
                current,
                path: current ? current.props.path || null : null,
                matches,
            });
            this.previousUrl = url;
            this.contextValue = newContext;
        }
        return current;
    }
    getMatchingChildren(children, url, invoke) {
        return children
            .filter(prepareVNodeForRanking)
            .sort(pathRankSort)
            .reduce((result, vnode) => {
            const matches = exec(url, vnode.props.path || '', vnode.props);
            if (matches) {
                if (invoke) {
                    const props = Object.assign({ url, matches }, matches);
                    delete props.ref;
                    delete props.key;
                    vnode = cloneElement(vnode, props);
                }
                result.push({ vnode, matches });
            }
            return result;
        }, []);
    }
    onChange(context) {
        const { onChange } = this.props;
        if (typeof onChange === 'function') {
            onChange(context);
        }
        return context;
    }
    render() {
        return (_jsx(RouterContext.Provider, Object.assign({ value: this.contextValue }, { children: this.getCurrent() })));
    }
    routeWillChange(url) {
        const { onBeforeChange } = this.props;
        if (onBeforeChange) {
            onBeforeChange(url);
        }
    }
}
