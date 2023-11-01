"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Configuration = void 0;
class Configuration {
    constructor(beaconUrl, applicationId, reportCrash, logLevel, lifecycleUpdate, userOptIn, actionNamePrivacy, bundleName) {
        this.beaconUrl = beaconUrl;
        this.applicationId = applicationId;
        this.reportCrash = reportCrash;
        this.logLevel = logLevel;
        this.lifecycleUpdate = lifecycleUpdate;
        this.userOptIn = userOptIn;
        this.actionNamePrivacy = actionNamePrivacy;
        this.bundleName = bundleName;
    }
}
exports.Configuration = Configuration;
