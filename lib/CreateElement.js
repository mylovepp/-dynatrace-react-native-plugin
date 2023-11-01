"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ElementHelper_1 = require("./instrumentor/base/ElementHelper");
const Types_1 = require("./instrumentor/model/Types");
const Component_1 = require("./react/Component");
const _createElement = require('react').createElement;
const createElement = (type, props, ...children) => {
    if (type != null && type._dtInfo != null && !(0, ElementHelper_1.isDtActionIgnore)(props)) {
        if (type._dtInfo.type === Types_1.Types.FunctionalComponent) {
            return _createElement(Component_1.DynatraceFnWrapper, {}, _createElement(type, props, ...children));
        }
        else if (type._dtInfo.type === Types_1.Types.ClassComponent &&
            type.prototype !== undefined && type.prototype.isReactComponent !== undefined) {
            return _createElement(Component_1.DynatraceClassWrapper, {}, _createElement(type, props, ...children));
        }
        else {
            (0, ElementHelper_1.modifyElement)(type, props, ...children);
        }
    }
    return _createElement(type, props, ...children);
};
module.exports = {
    createElement,
};
