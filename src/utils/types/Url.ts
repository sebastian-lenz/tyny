export interface UrlParts {
  path: string;
  query: tyny.Map<string | null | undefined>;
}

export class Url {
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
    const [path, query = ''] = url.split('?', 2);
    const values = query.split('&');

    this.path = path;
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

  toString(): string {
    return Url.compose(this);
  }

  static compose({ path, query }: UrlParts) {
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

    return parts.join('?');
  }

  static create(value: string): Url {
    return new Url(value);
  }
}
