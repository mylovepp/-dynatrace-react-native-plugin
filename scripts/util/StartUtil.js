"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.startArgumentsCheck = void 0;
const CustomArgumentUtil_1 = require("../util/CustomArgumentUtil");
const startArgumentsCheck = () => {
    const customArguments = (0, CustomArgumentUtil_1.parseCommandLine)(process.argv.slice(2));
    (0, CustomArgumentUtil_1.writeCustomArguments)(customArguments);
};
exports.startArgumentsCheck = startArgumentsCheck;
