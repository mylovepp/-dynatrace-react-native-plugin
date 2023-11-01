"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Logger = void 0;
const ConfigurationHandler_1 = require("./configuration/ConfigurationHandler");
const LOG_PREFIX = 'DYNATRACE: ';
exports.Logger = {
    logDebug: (message) => {
        if (ConfigurationHandler_1.ConfigurationHandler.isConfigurationAvailable() && ConfigurationHandler_1.ConfigurationHandler.isDebugEnabled()) {
            console.log(LOG_PREFIX + message);
        }
    },
    logInfo: (message) => {
        console.log(LOG_PREFIX + message);
    },
};
