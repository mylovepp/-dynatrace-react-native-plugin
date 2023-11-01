"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("proxy-polyfill");
const reactNative = require("react-native");
const Touchables_1 = require("./react-native/Touchables");
const RefreshControl_1 = require("./react-native/RefreshControl");
const dynatraceInstrument = {
    TouchableHighlight: Touchables_1.TouchableHighlight,
    TouchableNativeFeedback: Touchables_1.TouchableNativeFeedback,
    TouchableOpacity: Touchables_1.TouchableOpacity,
    TouchableWithoutFeedback: Touchables_1.TouchableWithoutFeedback,
    Button: Touchables_1.Button,
    RefreshControl: RefreshControl_1.RefreshControl,
    Text: Touchables_1.Text,
    Pressable: Touchables_1.Pressable,
};
const dynatraceProxy = new Proxy(reactNative, {
    get: (target, property) => {
        if (dynatraceInstrument[property] !== undefined) {
            return dynatraceInstrument[property];
        }
        return target[property];
    },
});
module.exports = dynatraceProxy;
