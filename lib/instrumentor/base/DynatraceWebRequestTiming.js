"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DynatraceWebRequestTiming = void 0;
const DynatraceBridge_1 = require("./DynatraceBridge");
const Logger_1 = require("./Logger");
const StringUtils_1 = require("./util/StringUtils");
class DynatraceWebRequestTiming {
    constructor(requestTag, url) {
        this.requestTag = requestTag;
        this.url = url;
    }
    startWebRequestTiming() {
        if (this.requestTag != null && !StringUtils_1.StringUtils.isStringNullEmptyOrUndefined(this.url)) {
            DynatraceBridge_1.DynatraceNative.startWebRequestTiming(this.requestTag, this.url);
        }
        else {
            Logger_1.Logger.logDebug('Web Request Timing could not be created!');
        }
    }
    stopWebRequestTiming(responseCode, responseMessage) {
        if (this.requestTag != null && !StringUtils_1.StringUtils.isStringNullEmptyOrUndefined(this.url) &&
            responseCode != null && !(Boolean(StringUtils_1.StringUtils.isStringNullOrUndefined(responseMessage)))) {
            DynatraceBridge_1.DynatraceNative.stopWebRequestTiming(this.requestTag, this.url, responseCode, responseMessage);
        }
        else {
            Logger_1.Logger.logDebug(`Web Request Timing could not be stopped! - Request Tag: 
          ${this.requestTag} Url: ${this.url} responseCode: ${responseCode} responseMessage: ${responseMessage}`);
        }
    }
    getRequestTag() {
        return this.requestTag;
    }
    getRequestTagHeader() {
        return 'x-dynatrace';
    }
}
exports.DynatraceWebRequestTiming = DynatraceWebRequestTiming;
