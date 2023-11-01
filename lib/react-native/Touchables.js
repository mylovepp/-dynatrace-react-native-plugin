"use strict";
var _a, _b, _c, _d, _e, _f;
Object.defineProperty(exports, "__esModule", { value: true });
exports.Pressable = exports.Text = exports.TouchableWithoutFeedback = exports.TouchableNativeFeedback = exports.TouchableHighlight = exports.TouchableOpacity = exports.Button = void 0;
const ReactNative = require("react-native");
const Types_1 = require("../instrumentor/model/Types");
if (typeof ReactNative.Button === 'object') {
    exports.Button = Object.assign({ _dtInfo: { type: Types_1.Types.Button } }, ReactNative.Button);
}
else {
    exports.Button = (_a = class Button extends ReactNative.Button {
        },
        _a._dtInfo = { type: Types_1.Types.Button },
        _a);
}
if (typeof ReactNative.TouchableOpacity === 'object') {
    exports.TouchableOpacity = Object.assign({ _dtInfo: { type: Types_1.Types.TouchableOpacity } }, ReactNative.TouchableOpacity);
}
else {
    exports.TouchableOpacity = (_b = class TouchableOpacity extends (ReactNative.TouchableOpacity) {
        },
        _b._dtInfo = { type: Types_1.Types.TouchableOpacity },
        _b);
}
if (typeof ReactNative.TouchableHighlight === 'object') {
    exports.TouchableHighlight = Object.assign({ _dtInfo: { type: Types_1.Types.TouchableHighlight } }, ReactNative.TouchableHighlight);
}
else {
    exports.TouchableHighlight = (_c = class TouchableHighlight extends (ReactNative.TouchableHighlight) {
        },
        _c._dtInfo = { type: Types_1.Types.TouchableHighlight },
        _c);
}
if (typeof ReactNative.TouchableNativeFeedback === 'object') {
    exports.TouchableNativeFeedback = Object.assign({ _dtInfo: { type: Types_1.Types.TouchableNativeFeedback } }, ReactNative.TouchableNativeFeedback);
}
else {
    exports.TouchableNativeFeedback = (_d = class TouchableNativeFeedback extends (ReactNative.TouchableNativeFeedback) {
        },
        _d._dtInfo = { type: Types_1.Types.TouchableNativeFeedback },
        _d);
}
if (typeof ReactNative.TouchableWithoutFeedback === 'object') {
    exports.TouchableWithoutFeedback = Object.assign({ _dtInfo: { type: Types_1.Types.TouchableWithoutFeedback } }, ReactNative.TouchableWithoutFeedback);
}
else {
    exports.TouchableWithoutFeedback = (_e = class TouchableWithoutFeedback extends (ReactNative.TouchableWithoutFeedback) {
        },
        _e._dtInfo = { type: Types_1.Types.TouchableWithoutFeedback },
        _e);
}
if (typeof ReactNative.Text === 'object') {
    exports.Text = Object.assign({ _dtInfo: { type: Types_1.Types.Text } }, ReactNative.Text);
}
else {
    exports.Text = (_f = class Text extends ReactNative.Text {
        },
        _f._dtInfo = { type: Types_1.Types.Text },
        _f);
}
if (typeof ReactNative.Pressable === 'object') {
    exports.Pressable = Object.assign({ _dtInfo: { type: Types_1.Types.Pressable } }, ReactNative.Pressable);
}
