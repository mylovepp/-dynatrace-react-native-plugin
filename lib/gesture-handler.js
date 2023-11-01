"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("proxy-polyfill");
const gesture_handler_1 = require("./community/gesture-handler");
const gestureHandler = require('react-native-gesture-handler');
const dynatraceInstrument = {
    TouchableHighlight: gesture_handler_1.TouchableHighlight,
    TouchableNativeFeedback: gesture_handler_1.TouchableNativeFeedback,
    TouchableOpacity: gesture_handler_1.TouchableOpacity,
    TouchableWithoutFeedback: gesture_handler_1.TouchableWithoutFeedback,
    RectButton: gesture_handler_1.RectButton,
};
if (gestureHandler !== undefined) {
    const dynatraceProxy = new Proxy(gestureHandler, {
        get: (target, property) => {
            if (dynatraceInstrument[property] !== undefined) {
                return dynatraceInstrument[property];
            }
            return target[property];
        },
    });
    module.exports = dynatraceProxy;
}
