"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ConfigurationBuilder = void 0;
const Configuration_1 = require("./Configuration");
const ConfigurationDefaults_1 = require("./ConfigurationDefaults");
const ConfigurationPreset_1 = require("./ConfigurationPreset");
class ConfigurationBuilder {
    constructor(beaconUrl, applicationId) {
        this.beaconUrl = '';
        this.applicationId = '';
        this.beaconUrl = beaconUrl;
        this.applicationId = applicationId;
        const preset = new ConfigurationPreset_1.ConfigurationPreset();
        this.reportCrash = ConfigurationDefaults_1.DEFAULT_REPORT_CRASH;
        this.logLevel = preset.getLogLevel();
        this.lifecycleUpdate = preset.getLifecycleUpdate();
        this.userOptIn = ConfigurationDefaults_1.DEFAULT_USER_OPT_IN;
        this.actionNamePrivacy = preset.getActionNamePrivacy();
        this.bundleName = preset.getBundleName();
        this.autoStartup = preset.isAutoStartupEnabled();
    }
    withCrashReporting(reportCrash) {
        this.reportCrash = reportCrash;
        return this;
    }
    withLogLevel(logLevel) {
        this.logLevel = logLevel;
        return this;
    }
    withLifecycleUpdate(lifecycleUpdate) {
        this.lifecycleUpdate = lifecycleUpdate;
        return this;
    }
    withUserOptIn(userOptIn) {
        this.userOptIn = userOptIn;
        return this;
    }
    withActionNamePrivacy(actionNamePrivacy) {
        this.actionNamePrivacy = actionNamePrivacy;
        return this;
    }
    withBundleName(bundleName) {
        this.bundleName = bundleName;
        return this;
    }
    buildConfiguration() {
        if (!this.autoStartup && this.beaconUrl.length === 0) {
            throw new Error('beaconUrl configuration property is empty. This configuration is not possible! Please use a proper beacon url.');
        }
        if (!this.autoStartup && this.applicationId.length === 0) {
            throw new Error('applicationId configuration property is empty. This configuration is not possible! Please use a proper application id.');
        }
        return new Configuration_1.Configuration(this.beaconUrl, this.applicationId, this.reportCrash, this.logLevel, this.lifecycleUpdate, this.userOptIn, this.actionNamePrivacy, this.bundleName);
    }
}
exports.ConfigurationBuilder = ConfigurationBuilder;
