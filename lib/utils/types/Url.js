export class Url {
    constructor(url) {
        this.parse(url);
    }
    clearParam(name) {
        delete this.query[name];
        return this;
    }
    clearParams() {
        this.query = {};
        return this;
    }
    getParam(name, defaultValue = null) {
        return name in this.query ? this.query[name] : defaultValue;
    }
    parse(url) {
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
        }, {});
        return this;
    }
    setParam(name, value = null) {
        if (value === null) {
            this.clearParam(name);
        }
        else {
            this.query[name] = value;
        }
        return this;
    }
    setParams(value) {
        Object.keys(value).forEach((key) => this.setParam(key, value[key]));
        return this;
    }
    toString() {
        return Url.compose(this);
    }
    static compose({ fragment, path, query }) {
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
        if (fragment)
            url += '#' + fragment;
        return url;
    }
    static create(value) {
        return new Url(value);
    }
}
