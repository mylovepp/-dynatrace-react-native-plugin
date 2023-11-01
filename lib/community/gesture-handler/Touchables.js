"use strict";
var _a, _b, _c, _d;
Object.defineProperty(exports, "__esModule", { value: true });
exports.RectButton = exports.TouchableWithoutFeedback = exports.TouchableNativeFeedback = exports.TouchableHighlight = exports.TouchableOpacity = void 0;
const Types_1 = require("../../instrumentor/model/Types");
const gestureHandler = require('react-native-gesture-handler');
if (gestureHandler !== undefined) {
    if (typeof gestureHandler.TouchableOpacity !== 'object') {
        exports.TouchableOpacity = (_a = class TouchableOpacity extends (gestureHandler.TouchableOpacity) {
            },
            _a._dtInfo = { type: Types_1.Types.TouchableOpacityGestureHandler },
            _a);
    }
    if (typeof gestureHandler.TouchableHighlight !== 'object') {
        exports.TouchableHighlight = (_b = class TouchableHighlight extends (gestureHandler.TouchableHighlight) {
            },
            _b._dtInfo = { type: Types_1.Types.TouchableHighlightGestureHandler },
            _b);
    }
    if (typeof gestureHandler.TouchableNativeFeedback !== 'object') {
        exports.TouchableNativeFeedback = (_c = class TouchableNativeFeedback extends (gestureHandler.TouchableNativeFeedback) {
            },
            _c._dtInfo = { type: Types_1.Types.TouchableNativeFeedbackGestureHandler },
            _c);
    }
    if (typeof gestureHandler.TouchableWithoutFeedback === 'object') {
        exports.TouchableWithoutFeedback = Object.assign({ _dtInfo: { type: Types_1.Types.TouchableWithoutFeedbackGestureHandler } }, gestureHandler.TouchableWithoutFeedback);
    }
    if (typeof gestureHandler.RectButton !== 'object') {
        exports.RectButton = (_d = class RectButton extends (gestureHandler.RectButton) {
            },
            _d._dtInfo = { type: Types_1.Types.RectButtonGestureHandler },
            _d);
    }
}
