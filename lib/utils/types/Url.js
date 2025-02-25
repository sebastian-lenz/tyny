function isSafe(value) {
    return (value &&
        typeof value === 'object' &&
        '__param' in value &&
        isParamValue(value.__param));
}
function isParamValue(value) {
    return (typeof value === 'boolean' ||
        typeof value === 'number' ||
        typeof value === 'string');
}
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
        const value = name in this.query ? this.query[name] : defaultValue;
        return value && isSafe(value) ? value.__param : value;
    }
    getStringParam(name, defaultValue = null) {
        const value = this.getParam(name, defaultValue);
        return typeof value === 'string' ? value : defaultValue;
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
        if (value === null || value === undefined) {
            this.clearParam(name);
        }
        else {
            this.query[name] = value;
        }
        return this;
    }
    setParams(params) {
        for (const name in params) {
            this.setParam(name, params[name]);
        }
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
            if (isParamValue(value)) {
                search.push(`${name}=${encodeURIComponent(value)}`);
            }
            else if (isSafe(value) && value.__param) {
                search.push(`${name}=${value.__param}`);
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
    static safeParam(value) {
        return { __param: value };
    }
}
