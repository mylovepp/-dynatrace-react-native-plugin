"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isDtActionIgnore = exports.modifyElement = exports.instrumentCreateElement = void 0;
const Types_1 = require("../model/Types");
const Component_1 = require("../../react/Component");
const Logger_1 = require("./Logger");
const Picker_1 = require("./Picker");
const Touchable_1 = require("./Touchable");
const Dynatrace_1 = require("./Dynatrace");
const RefreshControl_1 = require("./RefreshControl");
const instrumentCreateElement = (reactModule) => {
    if (reactModule != null && reactModule.createElement != null) {
        const reactCreateElement = reactModule.createElement;
        reactModule.createElement = (type, props, ...children) => {
            if (type != null && type._dtInfo != null && !(0, exports.isDtActionIgnore)(props)) {
                if (type._dtInfo.type === Types_1.Types.FunctionalComponent) {
                    return reactCreateElement(Component_1.DynatraceFnWrapper, {}, reactCreateElement(type, props, ...children));
                }
                else if (type._dtInfo.type === Types_1.Types.ClassComponent &&
                    type.prototype !== undefined && type.prototype.isReactComponent !== undefined) {
                    return reactCreateElement(Component_1.DynatraceClassWrapper, {}, reactCreateElement(type, props, ...children));
                }
                else {
                    (0, exports.modifyElement)(type, props, ...children);
                }
            }
            return reactCreateElement(type, props, ...children);
        };
    }
};
exports.instrumentCreateElement = instrumentCreateElement;
const modifyElement = (type, props, ...children) => {
    if (props != null) {
        if (type._dtInfo.type === Types_1.Types.RefreshControl && props.onRefresh != null) {
            (0, RefreshControl_1.RefreshControlHelper)(Dynatrace_1.Dynatrace, Logger_1.Logger).attachOnRefresh(props);
        }
        else if (type._dtInfo.type === Types_1.Types.Button ||
            type._dtInfo.type === Types_1.Types.Text ||
            type._dtInfo.type === Types_1.Types.Pressable ||
            (0, Types_1.isTypeTouchable)(type._dtInfo.type)) {
            if (props.onPress != null) {
                props.onPress = (0, Touchable_1.TouchableHelper)(Dynatrace_1.Dynatrace, Logger_1.Logger).attachOnPress(false, props, children);
            }
            if (props.onLongPress != null) {
                props.onLongPress = (0, Touchable_1.TouchableHelper)(Dynatrace_1.Dynatrace, Logger_1.Logger).attachOnPress(true, props, children);
            }
        }
        else if (props.onValueChange != null && type._dtInfo.type === Types_1.Types.Picker) {
            props.onValueChange = (0, Picker_1.PickerHelper)(Dynatrace_1.Dynatrace, Logger_1.Logger)
                .attachToOnValueChange(props.onValueChange, props.children);
        }
    }
};
exports.modifyElement = modifyElement;
const isDtActionIgnore = (props) => props != null && String(props.dtActionIgnore).toLowerCase() === 'true';
exports.isDtActionIgnore = isDtActionIgnore;
