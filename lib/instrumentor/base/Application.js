"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ApplicationHandler = void 0;
const ConfigurationBuilder_1 = require("./configuration/ConfigurationBuilder");
const ConfigurationHandler_1 = require("./configuration/ConfigurationHandler");
const Logger_1 = require("./Logger");
exports.ApplicationHandler = {
    startup: () => {
        if (!ConfigurationHandler_1.ConfigurationHandler.isConfigurationAvailable()) {
            Logger_1.Logger.logDebug('Configuration set: ' +
                JSON.stringify(ConfigurationHandler_1.ConfigurationHandler.setConfiguration(new ConfigurationBuilder_1.ConfigurationBuilder('', '').buildConfiguration())));
            Logger_1.Logger.logInfo('Dynatrace React Native Plugin started!');
        }
    },
};
