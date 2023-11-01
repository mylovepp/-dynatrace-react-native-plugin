"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserPrivacyOptions = void 0;
class UserPrivacyOptions {
    constructor(dataCollectionLevel, crashReportingOptedIn) {
        this._dataCollectionLevel = dataCollectionLevel;
        this._crashReportingOptedIn = crashReportingOptedIn;
    }
    get dataCollectionLevel() {
        return this._dataCollectionLevel;
    }
    get crashReportingOptedIn() {
        return this._crashReportingOptedIn;
    }
    set crashReportingOptedIn(crashReportingOptedIn) {
        this._crashReportingOptedIn = crashReportingOptedIn;
    }
    set dataCollectionLevel(dataCollectionLevel) {
        this._dataCollectionLevel = dataCollectionLevel;
    }
}
exports.UserPrivacyOptions = UserPrivacyOptions;
