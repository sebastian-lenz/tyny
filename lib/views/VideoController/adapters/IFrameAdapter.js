import { __assign, __extends } from "tslib";
import { once } from '../../../utils/dom/event';
import { Url } from '../../../utils/types/Url';
import { Adapter } from './Adapter';
var IFrameAdapter = /** @class */ (function (_super) {
    __extends(IFrameAdapter, _super);
    function IFrameAdapter() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.apiPromise = null;
        return _this;
    }
    Object.defineProperty(IFrameAdapter.prototype, "url", {
        get: function () {
            return new Url(this.el.src);
        },
        set: function (value) {
            this.el.src = value.toString();
        },
        enumerable: false,
        configurable: true
    });
    IFrameAdapter.prototype.enableApi = function () {
        if (this.apiPromise) {
            return this.apiPromise;
        }
        return (this.apiPromise = this.createApi());
    };
    // Protected methods
    // -----------------
    IFrameAdapter.prototype.awaitMessage = function (callback) {
        return new Promise(function (resolve) {
            return once(window, 'message', function (event) { return resolve(event.data); }, {
                condition: function (_a) {
                    var data = _a.data;
                    try {
                        data = JSON.parse(data);
                        return data && callback(data);
                    }
                    catch (e) {
                        // Unreadable message
                    }
                },
            });
        });
    };
    IFrameAdapter.prototype.post = function (cmd) {
        var _this = this;
        this.enableApi().then(function () {
            _this.postNative(cmd);
        });
    };
    IFrameAdapter.prototype.postNative = function (cmd) {
        var contentWindow = this.el.contentWindow;
        if (!contentWindow) {
            return;
        }
        try {
            contentWindow.postMessage(JSON.stringify(__assign({ event: 'command' }, cmd)), '*');
        }
        catch (e) { }
    };
    return IFrameAdapter;
}(Adapter));
export { IFrameAdapter };
