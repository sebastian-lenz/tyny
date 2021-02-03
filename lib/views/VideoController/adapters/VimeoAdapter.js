import { __extends } from "tslib";
import { IFrameAdapter } from './IFrameAdapter';
var VimeoAdapter = /** @class */ (function (_super) {
    __extends(VimeoAdapter, _super);
    function VimeoAdapter(el) {
        var _this = _super.call(this, el) || this;
        var uid = _this.url.getParam('player_id');
        if (uid) {
            _this.uid = parseInt(uid);
        }
        return _this;
    }
    VimeoAdapter.prototype.play = function () {
        this.post({ method: 'play' });
    };
    VimeoAdapter.prototype.pause = function () {
        this.post({ method: 'pause' });
    };
    VimeoAdapter.prototype.mute = function () {
        this.post({ method: 'setVolume', value: 0 });
    };
    VimeoAdapter.prototype.createApi = function () {
        var _this = this;
        var _a = this, uid = _a.uid, url = _a.url;
        if (!url.getParam('api') || !url.getParam('player_id')) {
            this.url = url.setParam('api', '1').setParam('player_id', "" + uid);
        }
        return new Promise(function (resolve) {
            _this.awaitMessage(function (_a) {
                var player_id = _a.player_id;
                return parseInt(player_id) === uid;
            }).then(function () {
                resolve();
            });
        });
    };
    return VimeoAdapter;
}(IFrameAdapter));
export { VimeoAdapter };
