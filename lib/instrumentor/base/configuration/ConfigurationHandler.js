"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ConfigurationHandler = void 0;
const LogLevel_1 = require("../model/LogLevel");
let _configuration;
exports.ConfigurationHandler = {
    setConfiguration(configuration) {
        _configuration = configuration;
    },
    isConfigurationAvailable: () => _configuration !== undefined,
    isDebugEnabled: () => _configuration.logLevel === LogLevel_1.LogLevel.Debug,
    isLifecycleUpdateEnabled: () => _configuration.lifecycleUpdate,
    isActionNamePrivacyEnabled: () => _configuration.actionNamePrivacy,
    getBundleName: () => _configuration.bundleName,
};
