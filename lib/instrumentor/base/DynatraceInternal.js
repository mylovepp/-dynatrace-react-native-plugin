"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DynatraceInternal = void 0;
const StringUtils_1 = require("./util/StringUtils");
const DynatraceBridge_1 = require("./DynatraceBridge");
const Logger_1 = require("./Logger");
let counter = 0;
exports.DynatraceInternal = {
    reportErrorFromHandler: (isFatal, errorName, reason, stacktrace, isCustomErrorHandlerSet, platform) => {
        if (!StringUtils_1.StringUtils.isStringNullEmptyOrUndefined(reason)) {
            const reasonNewLineIndex = reason.indexOf('\n');
            if (reasonNewLineIndex !== -1) {
                reason = reason.substring(0, reasonNewLineIndex);
            }
        }
        Logger_1.Logger.logDebug(`Dynatrace reportErrorStacktrace(${isFatal}, ${errorName}, ${reason}, ${stacktrace})`);
        if (isFatal) {
            DynatraceBridge_1.DynatraceNative.reportCrash(errorName, reason, stacktrace, true, __DEV__ || isCustomErrorHandlerSet, platform);
        }
        else {
            DynatraceBridge_1.DynatraceNative.reportError(errorName, '-', reason, stacktrace, platform);
        }
    },
    getCounter: () => counter++,
};
