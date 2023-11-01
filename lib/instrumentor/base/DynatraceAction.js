"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DynatraceAction = void 0;
const StringUtils_1 = require("./util/StringUtils");
const DynatraceBridge_1 = require("./DynatraceBridge");
const Logger_1 = require("./Logger");
class DynatraceAction {
    constructor(key, name, manual) {
        this.key = key;
        this.name = name;
        this.manual = manual;
        this.closed = false;
    }
    reportError(errorName, errorCode, platform) {
        if (this.closed) {
            Logger_1.Logger.logDebug(`DynatraceAction reportError(${errorName}, ${errorCode}): Action was closed already!`);
            return;
        }
        if (!StringUtils_1.StringUtils.isStringNullEmptyOrUndefined(errorName)) {
            DynatraceBridge_1.DynatraceNative.reportErrorInAction(this.key, errorName, errorCode, platform);
            Logger_1.Logger.logDebug(`DynatraceAction reportError(${errorName}, ${errorCode}): in Action - ${this.name}`);
        }
        else {
            Logger_1.Logger.logDebug(`DynatraceAction reportError(errorName, errorCode): Error will not be reported because errorName is invalid! errorName: ${errorName}, errorCode: ${errorCode}`);
        }
    }
    reportEvent(eventName, platform) {
        if (this.closed) {
            Logger_1.Logger.logDebug(`DynatraceAction reportEvent(${eventName}): Action was closed already!`);
            return;
        }
        if (!StringUtils_1.StringUtils.isStringNullEmptyOrUndefined(eventName)) {
            DynatraceBridge_1.DynatraceNative.reportEventInAction(this.key, eventName, platform);
            Logger_1.Logger.logDebug(`DynatraceAction reportEvent(${eventName}): in Action - ${this.name}`);
        }
        else {
            Logger_1.Logger.logDebug(`DynatraceAction reportEvent(eventName): Event will not be reported because eventName is invalid! eventName: ${eventName} in Action - ${this.name}`);
        }
    }
    reportStringValue(valueName, value, platform) {
        if (this.closed) {
            Logger_1.Logger.logDebug(`DynatraceAction reportStringValue(${valueName}, ${value}): Action was closed already!`);
            return;
        }
        if (!StringUtils_1.StringUtils.isStringNullEmptyOrUndefined(valueName)) {
            DynatraceBridge_1.DynatraceNative.reportStringValueInAction(this.key, valueName, value, platform);
            Logger_1.Logger.logDebug(`DynatraceAction reportStringValue(${valueName}, ${value}): in Action - ${this.name}`);
        }
        else {
            Logger_1.Logger.logDebug(`DynatraceAction reportStringValue(valueName, value): String value will not be reported because valueName is invalid! valueName: ${valueName}, value: ${value} in Action - ${this.name}`);
        }
    }
    reportIntValue(valueName, value, platform) {
        if (this.closed) {
            Logger_1.Logger.logDebug(`DynatraceAction reportIntValue(${valueName}, ${value}): Action was closed already!`);
            return;
        }
        if (!StringUtils_1.StringUtils.isStringNullEmptyOrUndefined(valueName)) {
            DynatraceBridge_1.DynatraceNative.reportIntValueInAction(this.key, valueName, value, platform);
            Logger_1.Logger.logDebug(`DynatraceAction reportIntValue(${valueName}, ${value}): in Action - ${this.name}`);
        }
        else {
            Logger_1.Logger.logDebug(`DynatraceAction reportIntValue(valueName, value): Int value will not be reported because valueName is invalid! valueName: ${valueName}, value: ${value} in Action - ${this.name}`);
        }
    }
    reportDoubleValue(valueName, value, platform) {
        if (this.closed) {
            Logger_1.Logger.logDebug(`DynatraceAction reportDoubleValue(${valueName}, ${value}): Action was closed already!`);
            return;
        }
        if (!StringUtils_1.StringUtils.isStringNullEmptyOrUndefined(valueName)) {
            DynatraceBridge_1.DynatraceNative.reportDoubleValueInAction(this.key, valueName, value, platform);
            Logger_1.Logger.logDebug(`DynatraceAction reportDoubleValue(${valueName}, ${value}): in Action - ${this.name}`);
        }
        else {
            Logger_1.Logger.logDebug(`DynatraceAction reportDoubleValue(valueName, value): Double value will not be reported because valueName is invalid! valueName: ${valueName}, value: ${value} in Action - ${this.name}`);
        }
    }
    leaveAction(platform) {
        if (this.closed) {
            Logger_1.Logger.logDebug('DynatraceAction leaveAction(): Action was closed already!');
            return;
        }
        this.closed = true;
        Logger_1.Logger.logDebug(`DynatraceAction leaveAction(): ${this.name}`);
        DynatraceBridge_1.DynatraceNative.leaveAction(this.key, this.manual, platform);
    }
    cancel(platform) {
        if (this.closed) {
            Logger_1.Logger.logDebug('DynatraceAction cancelAction(): Action was closed already!');
            return;
        }
        this.closed = true;
        Logger_1.Logger.logDebug(`DynatraceAction cancelAction(): ${this.name}`);
        DynatraceBridge_1.DynatraceNative.cancelAction(this.key, platform);
    }
    getRequestTag(url) {
        if (this.closed) {
            Logger_1.Logger.logDebug(`DynatraceAction getRequestTag(${url}): Action was closed already!`);
            return new Promise((resolve) => {
                resolve('');
            });
        }
        Logger_1.Logger.logDebug(`DynatraceAction getRequest(${url}): in Action - ${this.name}`);
        return DynatraceBridge_1.DynatraceNative.getRequestTag(this.key, url);
    }
    getRequestTagHeader() {
        return 'x-dynatrace';
    }
}
exports.DynatraceAction = DynatraceAction;
