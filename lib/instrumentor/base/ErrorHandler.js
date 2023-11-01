"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports._reportErrorToDynatrace = exports.isCustomErrorHandlerSet = exports.registerErrorHandler = void 0;
const DynatraceInternal_1 = require("./DynatraceInternal");
const Dynatrace_1 = require("./Dynatrace");
const StringUtils_1 = require("./util/StringUtils");
const Logger_1 = require("./Logger");
let _isCustomErrorHandlerSet = false;
const _isReactNativeGlobal = (globalScope) => globalScope.ErrorUtils !== undefined;
const registerErrorHandler = () => {
    if (global !== undefined && _isReactNativeGlobal(global)) {
        const oldHandler = global.ErrorUtils.getGlobalHandler();
        global.ErrorUtils.setGlobalHandler((error, isFatal) => {
            (0, exports._reportErrorToDynatrace)(error, isFatal, oldHandler);
        });
        const setter = global.ErrorUtils.setGlobalHandler;
        global.ErrorUtils.setGlobalHandler = (errorHandler) => {
            _isCustomErrorHandlerSet = true;
            setter((error, isFatal) => {
                (0, exports._reportErrorToDynatrace)(error, isFatal, errorHandler);
            });
        };
    }
};
exports.registerErrorHandler = registerErrorHandler;
const isCustomErrorHandlerSet = () => _isCustomErrorHandlerSet;
exports.isCustomErrorHandlerSet = isCustomErrorHandlerSet;
const _reportErrorToDynatrace = (exception, isFatal, oldHandler) => {
    if (exception != null && isExceptionAnError(exception)) {
        if (!StringUtils_1.StringUtils.isStringNullEmptyOrUndefined(exception.name)) {
            if (isFatal === undefined) {
                isFatal = false;
            }
            if (exception.stack != null) {
                DynatraceInternal_1.DynatraceInternal.reportErrorFromHandler(isFatal, String(exception.name), exception.message, exception.stack, _isCustomErrorHandlerSet);
                Logger_1.Logger.logDebug(`ErrorHandler _reportErrorToDynatrace(${exception}, ${isFatal})`);
            }
            else {
                Dynatrace_1.Dynatrace.reportError(String(exception.name) + ': ' + exception.message, -1);
                Logger_1.Logger.logDebug(`ErrorHandler _reportErrorToDynatrace(${exception})`);
            }
        }
    }
    else {
        Dynatrace_1.Dynatrace.reportError(String(exception), -1);
        Logger_1.Logger.logDebug(`ErrorHandler _reportErrorToDynatrace(${exception})`);
    }
    if (oldHandler !== undefined) {
        oldHandler(exception, isFatal);
    }
};
exports._reportErrorToDynatrace = _reportErrorToDynatrace;
const isExceptionAnError = (exception) => exception.message !== undefined;
