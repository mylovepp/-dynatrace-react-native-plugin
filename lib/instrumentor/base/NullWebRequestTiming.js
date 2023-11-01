"use strict";
class NullWebRequestTiming {
    startWebRequestTiming() {
        return;
    }
    stopWebRequestTiming(responseCode, responseMessage) {
        return;
    }
    getRequestTag() {
        return '';
    }
    getRequestTagHeader() {
        return '';
    }
}
