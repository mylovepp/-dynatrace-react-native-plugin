"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ManualStartupConfiguration = void 0;
const ConfigurationDefaults_1 = require("./ConfigurationDefaults");
const ConfigurationPreset_1 = require("./ConfigurationPreset");
class ManualStartupConfiguration {
    constructor(beaconUrl, applicationId, reportCrash, logLevel, lifecycleUpdate, userOptIn, actionNamePrivacy, bundleName) {
        this.reportCrash = ConfigurationDefaults_1.DEFAULT_REPORT_CRASH;
        this.userOptIn = ConfigurationDefaults_1.DEFAULT_USER_OPT_IN;
        if (!applicationId || !beaconUrl) {
            throw new Error('Dynatrace Startup Configuration is not correct! Missing applicationId and beaconUrl!');
        }
        this.applicationId = applicationId;
        this.beaconUrl = beaconUrl;
        const preset = new ConfigurationPreset_1.ConfigurationPreset();
        this.logLevel = preset.getLogLevel();
        this.lifecycleUpdate = preset.getLifecycleUpdate();
        this.actionNamePrivacy = preset.getActionNamePrivacy();
        this.bundleName = preset.getBundleName();
        if (reportCrash != null) {
            this.reportCrash = reportCrash;
        }
        if (userOptIn != null) {
            this.userOptIn = userOptIn;
        }
        if (logLevel != null) {
            this.logLevel = logLevel;
        }
        if (lifecycleUpdate != null) {
            this.lifecycleUpdate = lifecycleUpdate;
        }
        if (actionNamePrivacy != null) {
            this.actionNamePrivacy = actionNamePrivacy;
        }
        if (bundleName != null) {
            this.bundleName = bundleName;
        }
    }
}
exports.ManualStartupConfiguration = ManualStartupConfiguration;
