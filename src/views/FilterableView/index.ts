import { BehaviourModifier } from './BehaviourModifier';
import { event, getViewsRecursive, property } from '../../core';
import { fetch } from '../../utils/env/fetch';
import { Modifier } from './Modifier';
import { Swap, SwapOptions } from '../Swap';
import { Url } from '../../utils/types/Url';
import { ViewModifier } from './ViewModifier';

export type FilterableViewParam = string | null | undefined;
export type FilterableViewParams = tyny.Map<FilterableViewParam>;

export interface FilterableViewOptions extends SwapOptions {}

export const filterChangedEvent = 'tyny:filterChanged';

export class FilterableView<
  TParams extends FilterableViewParams = FilterableViewParams
> extends Swap {
  //
  skipSameUrl: boolean = true;
  staticParams: FilterableViewParams = {};
  protected _basePath: string = '';
  protected _fetchPath: string | undefined;
  protected _hasChanges: boolean = false;
  protected _request: Promise<any> | null = null;
  static responseCache: tyny.Map<string> = {};

  constructor(options: FilterableViewOptions) {
    super({
      ...options,
      autoAppend: true,
      autoRemove: true,
    });
  }

  @property()
  get modifiers(): Modifier[] {
    return [
      ...this.behaviours.filter(
        (b): b is BehaviourModifier => b instanceof BehaviourModifier
      ),
      ...getViewsRecursive(this.el).filter(
        (v): v is ViewModifier => v instanceof ViewModifier
      ),
    ];
  }

  commit({ disableLoad }: { disableLoad?: boolean } = {}) {
    if (this._hasChanges) return;
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

  getParams(overrides: Partial<TParams> = {}): TParams {
    return this.modifiers.reduce(
      (params, modifier) => ({ ...modifier.getParams(), ...params }),
      overrides
    ) as TParams;
  }

  getUrl(overrides: Partial<TParams> = {}, path = this._basePath): string {
    return Url.compose({
      path,
      query: this.getParams(overrides),
    });
  }

  softReset() {
    this.modifiers.forEach((modifier) => modifier.softReset());
  }

  sync(silent: boolean = false) {
    const { modifiers } = this;
    const url = new Url(window.location.href);
    const hasChanged = modifiers.reduce(
      (hasChanged, modifier) => modifier.sync({ silent, url }) || hasChanged,
      false
    );

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

  protected createRequest(): Promise<string | null | false> {
    const { responseCache } = FilterableView;
    const url = this.getUrl(this.staticParams as any, this._fetchPath);
    if (url in responseCache) {
      return Promise.resolve(responseCache[url]);
    }

    return fetch(url)
      .then((response) => response.text())
      .then((html) => (responseCache[url] = html));
  }

  protected load() {
    const request = (this._request = this.createRequest().then((result) => {
      if (this._request !== request) return;
      this._request = null;

      if (result === null) {
        this.setContent(null);
      } else if (result !== false) {
        const parser = new DOMParser();
        const document = parser.parseFromString(result, 'text/html');
        this.setContent(document.body.firstElementChild as any);
      }
    }));
  }

  protected onConnected() {
    this.sync(true);
  }

  @event({ name: 'popstate', target: window })
  protected onPopState() {
    this.sync();
  }
}
