"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ElementHelper_1 = require("./instrumentor/base/ElementHelper");
const Types_1 = require("./instrumentor/model/Types");
const Component_1 = require("./react/Component");
try {
    let _jsxRuntime;
    try {
        _jsxRuntime = require('react/jsx-runtime.js');
    }
    catch (error) {
        try {
            _jsxRuntime = require('../../../react/jsx-runtime');
        }
        catch (error) {
            _jsxRuntime = null;
        }
    }
    if (_jsxRuntime != null) {
        const jsxProd = (type, config, maybeKey) => jsxHelper(_jsxRuntime.jsx, type, config, [maybeKey]);
        const jsxDev = (type, config, maybeKey, source, self) => jsxHelper(_jsxRuntime.jsx, type, config, [maybeKey, source, self]);
        const jsxsDev = (type, config, maybeKey, source, self) => jsxHelper(_jsxRuntime.jsxs, type, config, [maybeKey, source, self]);
        const jsxHelper = (jsxFn, type, config, args) => {
            if (type !== undefined && type._dtInfo !== undefined && !(0, ElementHelper_1.isDtActionIgnore)(config)) {
                if (type._dtInfo.type === Types_1.Types.FunctionalComponent) {
                    const wrapperProps = { children: [] };
                    wrapperProps.dtActionName = (config !== undefined &&
                        config.dtActionName !== undefined) ? config.dtActionName : type._dtInfo.name;
                    wrapperProps.children.push(jsxFn(type, config, ...args));
                    return _jsxRuntime.jsxs(Component_1.DynatraceFnWrapper, wrapperProps);
                }
                else if (type._dtInfo.type === Types_1.Types.ClassComponent &&
                    type.prototype !== undefined && type.prototype.isReactComponent !== undefined) {
                    const wrapperProps = { children: [] };
                    wrapperProps.children.push(jsxFn(type, config, ...args));
                    return _jsxRuntime.jsxs(Component_1.DynatraceClassWrapper, wrapperProps);
                }
                if (Array.isArray(config.children)) {
                    (0, ElementHelper_1.modifyElement)(type, config, ...config.children);
                }
                else {
                    (0, ElementHelper_1.modifyElement)(type, config, config.children);
                }
            }
            return jsxFn(type, config, ...args);
        };
        module.exports = Object.assign(Object.assign({}, _jsxRuntime), { jsx: __DEV__ ? jsxDev : jsxProd, jsxs: __DEV__ ? jsxsDev : jsxProd });
    }
    else {
        module.exports = {};
    }
}
catch (error) {
    module.exports = {};
}
