"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CustomArgumentsImpl = void 0;
class CustomArgumentsImpl {
    constructor(configurationPath, gradlePath, plistPath) {
        this.configurationPath = configurationPath;
        this.gradlePath = gradlePath;
        this.plistPath = plistPath;
    }
    getCustomGradlePath() {
        return this.gradlePath;
    }
    isCustomGradlePathSet() {
        return this.gradlePath !== undefined;
    }
    getCustomPlistPath() {
        return this.plistPath;
    }
    isCustomPlistPathSet() {
        return this.plistPath !== undefined;
    }
    getCustomConfigurationPath() {
        return this.configurationPath;
    }
    isCustomConfigurationPathSet() {
        return this.configurationPath !== undefined;
    }
    isEmpty() {
        return !(this.isCustomConfigurationPathSet() || this.isCustomGradlePathSet()
            || this.isCustomPlistPathSet());
    }
}
exports.CustomArgumentsImpl = CustomArgumentsImpl;
