export interface UrlParts {
  fragment?: string;
  path: string;
  query: tyny.Map<string | null | undefined>;
}

export class Url {
  fragment!: string;
  path!: string;
  query!: tyny.Map<string>;

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

  getParam(name: string, defaultValue: string): string;
  getParam(name: string, defaultValue?: string | null): string | null;
  getParam(name: string, defaultValue: string | null = null): string | null {
    return name in this.query ? this.query[name] : defaultValue;
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

  setParam(name: string, value: string | null = null): this {
    if (value === null) {
      this.clearParam(name);
    } else {
      this.query[name] = value;
    }

    return this;
  }

  setParams(value: tyny.Map<string>): this {
    Object.keys(value).forEach((key) => this.setParam(key, value[key]));
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
      if (typeof value === 'string' && value) {
        search.push(`${name}=${encodeURIComponent(value)}`);
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
}
