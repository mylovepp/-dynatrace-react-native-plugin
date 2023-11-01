"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isTypeTouchable = exports.isTypeGestureHandlerTouchable = exports.isTypeReactNativeTouchable = exports.Types = void 0;
var Types;
(function (Types) {
    Types[Types["FunctionalComponent"] = 0] = "FunctionalComponent";
    Types[Types["ClassComponent"] = 1] = "ClassComponent";
    Types[Types["Button"] = 2] = "Button";
    Types[Types["TouchableOpacity"] = 3] = "TouchableOpacity";
    Types[Types["TouchableHighlight"] = 4] = "TouchableHighlight";
    Types[Types["TouchableNativeFeedback"] = 5] = "TouchableNativeFeedback";
    Types[Types["TouchableWithoutFeedback"] = 6] = "TouchableWithoutFeedback";
    Types[Types["Text"] = 7] = "Text";
    Types[Types["Picker"] = 8] = "Picker";
    Types[Types["Pressable"] = 9] = "Pressable";
    Types[Types["TouchableOpacityGestureHandler"] = 10] = "TouchableOpacityGestureHandler";
    Types[Types["TouchableHighlightGestureHandler"] = 11] = "TouchableHighlightGestureHandler";
    Types[Types["TouchableNativeFeedbackGestureHandler"] = 12] = "TouchableNativeFeedbackGestureHandler";
    Types[Types["TouchableWithoutFeedbackGestureHandler"] = 13] = "TouchableWithoutFeedbackGestureHandler";
    Types[Types["RectButtonGestureHandler"] = 14] = "RectButtonGestureHandler";
    Types[Types["RefreshControl"] = 15] = "RefreshControl";
})(Types = exports.Types || (exports.Types = {}));
const isTypeReactNativeTouchable = (type) => type === Types.TouchableHighlight
    || type === Types.TouchableNativeFeedback
    || type === Types.TouchableOpacity
    || type === Types.TouchableWithoutFeedback;
exports.isTypeReactNativeTouchable = isTypeReactNativeTouchable;
const isTypeGestureHandlerTouchable = (type) => type === Types.TouchableHighlightGestureHandler
    || type === Types.TouchableNativeFeedbackGestureHandler
    || type === Types.TouchableOpacityGestureHandler
    || type === Types.TouchableWithoutFeedbackGestureHandler
    || type === Types.RectButtonGestureHandler;
exports.isTypeGestureHandlerTouchable = isTypeGestureHandlerTouchable;
const isTypeTouchable = (type) => (0, exports.isTypeGestureHandlerTouchable)(type)
    || (0, exports.isTypeReactNativeTouchable)(type);
exports.isTypeTouchable = isTypeTouchable;
