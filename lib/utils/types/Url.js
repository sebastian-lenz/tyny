var Url = /** @class */ (function () {
    function Url(url) {
        this.parse(url);
    }
    Url.prototype.clearParam = function (name) {
        delete this.query[name];
        return this;
    };
    Url.prototype.clearParams = function () {
        this.query = {};
        return this;
    };
    Url.prototype.getParam = function (name, defaultValue) {
        if (defaultValue === void 0) { defaultValue = null; }
        return name in this.query ? this.query[name] : defaultValue;
    };
    Url.prototype.parse = function (url) {
        var _a = url.split('#', 2), pathQuery = _a[0], _b = _a[1], fragment = _b === void 0 ? '' : _b;
        var _c = pathQuery.split('?', 2), path = _c[0], _d = _c[1], query = _d === void 0 ? '' : _d;
        var values = query.split('&');
        this.path = path;
        this.fragment = fragment;
        this.query = values.reduce(function (params, value) {
            var parts = value.split('=', 2);
            if (parts.length == 2) {
                params[parts[0]] = decodeURIComponent(parts[1]);
            }
            return params;
        }, {});
        return this;
    };
    Url.prototype.setParam = function (name, value) {
        if (value === void 0) { value = null; }
        if (value === null) {
            this.clearParam(name);
        }
        else {
            this.query[name] = value;
        }
        return this;
    };
    Url.prototype.setParams = function (value) {
        var _this = this;
        Object.keys(value).forEach(function (key) { return _this.setParam(key, value[key]); });
        return this;
    };
    Url.prototype.toString = function () {
        return Url.compose(this);
    };
    Url.compose = function (_a) {
        var fragment = _a.fragment, path = _a.path, query = _a.query;
        var parts = [path];
        var search = [];
        for (var name_1 in query) {
            var value = query[name_1];
            if (typeof value === 'string' && value) {
                search.push(name_1 + "=" + encodeURIComponent(value));
            }
        }
        if (search.length) {
            parts.push(search.join('&'));
        }
        var url = parts.join('?');
        if (fragment)
            url += '#' + fragment;
        return url;
    };
    Url.create = function (value) {
        return new Url(value);
    };
    return Url;
}());
export { Url };
