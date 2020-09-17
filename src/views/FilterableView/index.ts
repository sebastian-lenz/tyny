import { BehaviourModifier } from './BehaviourModifier';
import { event, getViewsRecursive, property } from '../../core';
import { fetch } from '../../utils/env/fetch';
import { Modifier } from './Modifier';
import { Swap, SwapOptions } from '../Swap';
import { Url } from '../../utils/types/Url';
import { ViewModifier } from './ViewModifier';

export type FilterableViewParams = tyny.Map<string | null | undefined>;

export interface FilterableViewOptions extends SwapOptions {}

export const filterChangedEvent = 'tyny:filterChanged';

export class FilterableView<
  TParams extends FilterableViewParams = FilterableViewParams
> extends Swap {
  //
  staticParams: tyny.Map<string> = {};
  protected _basePath: string = '';
  protected _hasChanges: boolean = false;
  protected _request: Promise<any> | null = null;

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

  commit() {
    if (this._hasChanges) return;
    this._hasChanges = true;

    setTimeout(() => {
      window.history.pushState(null, document.title, this.getUrl());

      this.load();
      this.trigger(filterChangedEvent, { target: this });
      this._hasChanges = false;
    }, 0);
  }

  getParams(overrides: Partial<TParams> = {}): TParams {
    return this.modifiers.reduce(
      (params, modifier) => ({ ...modifier.getParams(), ...params }),
      overrides
    ) as TParams;
  }

  getUrl(overrides: Partial<TParams> = {}): string {
    return Url.compose({
      path: this._basePath,
      query: this.getParams(overrides),
    });
  }

  softReset() {
    this.modifiers.forEach((modifier) => modifier.softReset());
  }

  sync(silent?: boolean) {
    const { modifiers } = this;
    const url = new Url(window.location.href);
    const hasChanged = modifiers.reduce(
      (hasChanged, modifier) => modifier.sync(url) || hasChanged,
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

  protected load() {
    const url = this.getUrl(this.staticParams as any);

    const request = (this._request = fetch(url)
      .then((response) => response.text())
      .then((html) => {
        if (this._request !== request) return;
        this._request = null;

        const parser = new DOMParser();
        const document = parser.parseFromString(html, 'text/html');
        this.setContent(document.body.firstElementChild as any);
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
