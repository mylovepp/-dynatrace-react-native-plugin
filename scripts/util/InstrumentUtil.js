"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.showVersionOfPlugin = exports.isPlatformAvailable = void 0;
const Logger_1 = require("../Logger");
const FileOperationHelper_1 = require("../FileOperationHelper");
const PathsConstants_1 = require("../PathsConstants");
const isPlatformAvailable = (path, platform) => {
    try {
        FileOperationHelper_1.default.checkIfFileExistsSync(path);
        return true;
    }
    catch (e) {
        Logger_1.default.logMessageSync(`${platform} Location doesn't exist - Skip ${platform} instrumentation and configuration.`, Logger_1.default.WARNING);
        return false;
    }
};
exports.isPlatformAvailable = isPlatformAvailable;
const showVersionOfPlugin = () => {
    try {
        const packageJsonContent = FileOperationHelper_1.default.readTextFromFileSync(PathsConstants_1.default.getInternalPackageJsonFile());
        const packageJsonContentObj = JSON.parse(packageJsonContent);
        Logger_1.default.logMessageSync('Dynatrace React Native Plugin - Version ' + packageJsonContentObj.version, Logger_1.default.INFO);
    }
    catch (e) {
        Logger_1.default.logMessageSync('Dynatrace React Native Plugin - Version NOT READABLE', Logger_1.default.WARNING);
    }
};
exports.showVersionOfPlugin = showVersionOfPlugin;
