"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.configCommand = void 0;
const Config_1 = require("../Config");
const Logger_1 = require("../Logger");
const CustomArgumentUtil_1 = require("../util/CustomArgumentUtil");
const configCommand = () => {
    Logger_1.default.logMessageSync('Creation of default configuration ..', Logger_1.default.INFO);
    const argv = (0, CustomArgumentUtil_1.parseCommandLine)(process.argv.slice(2));
    if (argv.isCustomConfigurationPathSet()) {
        (0, Config_1.checkConfiguration)(argv.getCustomConfigurationPath());
    }
    else {
        (0, Config_1.checkConfiguration)();
    }
};
exports.configCommand = configCommand;
