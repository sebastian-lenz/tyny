function isSafe(value: any): value is SafeParam {
  return (
    value &&
    typeof value === 'object' &&
    '__param' in value &&
    isParamValue(value.__param)
  );
}

function isParamValue(value: any): value is ParamValue {
  return (
    typeof value === 'boolean' ||
    typeof value === 'number' ||
    typeof value === 'string'
  );
}

export type Param = ParamValue | SafeParam;

export type ParamValue = string | number | boolean;

export interface SafeParam {
  __param: ParamValue;
}

export interface UrlParts {
  fragment?: string;
  path: string;
  query: tyny.Map<Param | null | undefined>;
}

export class Url {
  fragment!: string;
  path!: string;
  query!: tyny.Map<Param>;

  constructor(url: string) {
    this.parse(url);
  }

  clearParam(name: string): this {
    delete this.query[name];
    return this;
  }

  clearParams(): this {
    this.query = {};
    return this;
  }

  getParam(name: string, defaultValue: ParamValue): ParamValue;
  getParam(name: string, defaultValue?: ParamValue | null): ParamValue | null;
  getParam(
    name: string,
    defaultValue: ParamValue | null = null
  ): ParamValue | null {
    const value = name in this.query ? this.query[name] : defaultValue;
    return value && isSafe(value) ? value.__param : value;
  }

  getIntParam(name: string, defaultValue: number): number;
  getIntParam(name: string, defaultValue?: null): number | null;
  getIntParam(name: string, defaultValue: number | null = null): number | null {
    const value = this.getParam(name, defaultValue);
    if (typeof value === 'number') {
      return value;
    } else if (typeof value === 'string') {
      return parseInt(value);
    } else {
      return defaultValue;
    }
  }

  getStringParam(name: string, defaultValue: string): string;
  getStringParam(name: string, defaultValue?: null): string | null;
  getStringParam(
    name: string,
    defaultValue: string | null = null
  ): string | null {
    const value = this.getParam(name, defaultValue);
    return typeof value === 'string' ? value : defaultValue;
  }

  parse(url: string): this {
    const [pathQuery, fragment = ''] = url.split('#', 2);
    const [path, query = ''] = pathQuery.split('?', 2);
    const values = query.split('&');

    this.path = path;
    this.fragment = fragment;
    this.query = values.reduce((params, value) => {
      const parts = value.split('=', 2);
      if (parts.length == 2) {
        params[parts[0]] = decodeURIComponent(parts[1]);
      }

      return params;
    }, {} as any);

    return this;
  }

  setParam(name: string, value: Param | null | undefined = null): this {
    if (value === null || value === undefined) {
      this.clearParam(name);
    } else {
      this.query[name] = value;
    }

    return this;
  }

  setParams(params: tyny.Map<Param | null | undefined>): this {
    for (const name in params) {
      this.setParam(name, params[name]);
    }

    return this;
  }

  toString(): string {
    return Url.compose(this);
  }

  static compose({ fragment, path, query }: UrlParts) {
    const parts = [path];
    const search = [];

    for (const name in query) {
      const value = query[name];
      if (isParamValue(value)) {
        search.push(`${name}=${encodeURIComponent(value)}`);
      } else if (isSafe(value) && value.__param) {
        search.push(`${name}=${value.__param}`);
      }
    }

    if (search.length) {
      parts.push(search.join('&'));
    }

    let url = parts.join('?');
    if (fragment) url += '#' + fragment;
    return url;
  }

  static create(value: string): Url {
    return new Url(value);
  }

  static safeParam(value: ParamValue): SafeParam {
    return { __param: value };
  }
}
