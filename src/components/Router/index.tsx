import { useContext } from 'preact/hooks';
import { cloneElement, Component, createContext, toChildArray } from 'preact';

import { delegateLinkHandler } from './Link';
import { exec, pathRankSort, prepareVNodeForRanking } from './utils';

import type {
  CustomHistory,
  RouteMatch,
  RouterOnChangeArgs,
  RouterProps,
  RouterState,
  UrlInfo,
} from './types';

const routers: Array<Router> = [];
let customHistory: CustomHistory | null = null;

/** Check if the given URL can be handled by any router instances. */
function canRoute(url: string) {
  for (let i = routers.length; i--; ) {
    if (routers[i].canRoute(url)) return true;
  }

  return false;
}

/** Tell all router instances to handle the given URL.  */
function routeTo(url: string) {
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
  if (eventListenersInitialized) return;

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

function setUrl(url: string, type: 'replace' | 'push' = 'push') {
  if (customHistory && customHistory[type]) {
    customHistory[type](url);
  } else if (typeof history !== 'undefined' && history[`${type}State`]) {
    history[`${type}State`](null, '', url);
  }
}

export const RouterContext = createContext<RouterOnChangeArgs | {}>({});

export function getCurrentUrl() {
  let url;

  if (customHistory && customHistory.location) {
    url = customHistory.location;
  } else if (customHistory && customHistory.getCurrentLocation) {
    url = customHistory.getCurrentLocation();
  } else {
    url = typeof location !== 'undefined' ? location : {};
  }

  return `${url.pathname || ''}${url.search || ''}`;
}

export function route(url: string | UrlInfo, replace?: string | boolean) {
  if (typeof url !== 'string') {
    replace = url.replace;
    url = url.url;
  }

  // only push URL into history if we can handle it
  if (canRoute(url)) {
    setUrl(url, replace ? 'replace' : 'push');
  }

  return routeTo(url);
}

export function useRouter(): [Partial<RouterOnChangeArgs>, typeof route] {
  return [useContext(RouterContext), route];
}

export class Router<Props extends RouterProps = RouterProps> extends Component<
  Props,
  RouterState
> {
  contextValue: RouterOnChangeArgs | {};
  previousUrl?: string;
  unlisten?: Function;
  updating: boolean = false;

  constructor(props: Props) {
    super(props);
    if (props.history) {
      customHistory = props.history;
    }

    this.contextValue = {};
    this.state = {
      url: props.url || getCurrentUrl(),
    };

    initEventListeners();
  }

  shouldComponentUpdate(props: RouterProps) {
    if (props.static !== true) return true;
    return (
      props.url !== this.props.url || props.onChange !== this.props.onChange
    );
  }

  /** Check if the given URL can be matched against any children */
  canRoute(url: string) {
    const children = toChildArray(this.props.children);
    return this.getMatchingChildren(children, url, false).length > 0;
  }

  /** Re-render children with a new URL to match against. */
  routeTo(url: string) {
    this.setState({ url });

    const didRoute = this.canRoute(url);

    // trigger a manual re-route if we're not in the middle of an update:
    if (!this.updating) this.forceUpdate();

    return didRoute;
  }

  componentWillMount() {
    this.updating = true;
  }

  componentDidMount() {
    routers.push(this);

    if (customHistory) {
      this.unlisten = customHistory.listen((action: any) => {
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
      this.previousUrl = url;
      const newContext = (this.contextValue = {
        router: this,
        url,
        previous,
        active: active.map((a) => a.vnode),
        current,
        path: current ? current.props.path || null : null,
        matches,
      });

      this.onChange(newContext);
    }

    return current;
  }

  getMatchingChildren(children: Array<any>, url: string, invoke?: boolean) {
    return children
      .filter(prepareVNodeForRanking)
      .sort(pathRankSort)
      .reduce((result, vnode) => {
        const matches = exec(url, vnode.props.path || '', vnode.props);
        if (matches) {
          if (invoke) {
            const props: any = { url, matches, ...matches };
            delete props.ref;
            delete props.key;
            vnode = cloneElement(vnode, props) as any;
          }

          result.push({ vnode, matches });
        }

        return result;
      }, [] as Array<RouteMatch>);
  }

  onChange(newContext: RouterOnChangeArgs) {
    const { onChange } = this.props;

    if (typeof onChange === 'function') {
      onChange(newContext);
    }
  }

  render() {
    return (
      <RouterContext.Provider value={this.contextValue}>
        {this.getCurrent()}
      </RouterContext.Provider>
    );
  }
}
