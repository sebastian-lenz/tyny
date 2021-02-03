export function fetch(url, options) {
    if (options === void 0) { options = {}; }
    return new Promise(function (resolve, reject) {
        var request = new XMLHttpRequest();
        var keys = [];
        var all = [];
        var headers = {};
        var response = function () {
            return ({
                ok: ((request.status / 100) | 0) == 2,
                statusText: request.statusText,
                status: request.status,
                url: request.responseURL,
                text: function () { return Promise.resolve(request.responseText); },
                json: function () { return Promise.resolve(request.responseText).then(JSON.parse); },
                blob: function () { return Promise.resolve(new Blob([request.response])); },
                clone: response,
                headers: {
                    keys: function () { return keys; },
                    entries: function () { return all; },
                    get: function (n) { return headers[n.toLowerCase()]; },
                    has: function (n) { return n.toLowerCase() in headers; },
                },
            });
        };
        request.open(options.method || 'get', url, true);
        request.onerror = reject;
        request.withCredentials = options.credentials == 'include';
        for (var i in options.headers) {
            request.setRequestHeader(i, options.headers[i]);
        }
        request.onload = function () {
            request
                .getAllResponseHeaders()
                .replace(/^(.*?):[^\S\n]*([\s\S]*?)$/gm, function (match, key, value) {
                keys.push((key = key.toLowerCase()));
                all.push([key, value]);
                headers[key] = headers[key] ? headers[key] + "," + value : value;
                return match;
            });
            resolve(response());
        };
        request.send(options.body || null);
    });
}
