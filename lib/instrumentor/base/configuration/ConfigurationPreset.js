"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ConfigurationPreset = void 0;
const ConfigurationDefaults_1 = require("./ConfigurationDefaults");
class ConfigurationPreset {
    isAutoStartupEnabled() {
        return false;
    }
    getLifecycleUpdate() {
        return ConfigurationDefaults_1.DEFAULT_LIFECYCLE_UPDATE;
    }
    getLogLevel() {
        return ConfigurationDefaults_1.DEFAULT_LOGLEVEL;
    }
    getActionNamePrivacy() {
        return ConfigurationDefaults_1.DEFAULT_ACTION_NAME_PRIVACY;
    }
    getBundleName() {
        return undefined;
    }
}
exports.ConfigurationPreset = ConfigurationPreset;
;
