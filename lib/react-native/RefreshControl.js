"use strict";
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.RefreshControl = void 0;
const ReactNative = require("react-native");
const Types_1 = require("../instrumentor/model/Types");
if (typeof ReactNative.RefreshControl === 'object') {
    exports.RefreshControl = Object.assign({ _dtInfo: { type: Types_1.Types.RefreshControl } }, ReactNative.RefreshControl);
}
else {
    exports.RefreshControl = (_a = class RefreshControl extends ReactNative.RefreshControl {
        },
        _a._dtInfo = { type: Types_1.Types.RefreshControl },
        _a);
}
