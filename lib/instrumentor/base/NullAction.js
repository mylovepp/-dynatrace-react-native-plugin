"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NullAction = void 0;
class NullAction {
    reportError(errorName, errorCode, platform) {
        return;
    }
    reportEvent(eventName, platform) {
        return;
    }
    reportStringValue(valueName, value, platform) {
        return;
    }
    reportIntValue(valueName, value, platform) {
        return;
    }
    reportDoubleValue(valueName, value, platform) {
        return;
    }
    leaveAction(platform) {
        return;
    }
    cancel(platfrom) {
        return;
    }
    getRequestTag(url) {
        return new Promise((resolve) => {
            resolve('');
        });
    }
    getRequestTagHeader() {
        return '';
    }
}
exports.NullAction = NullAction;
