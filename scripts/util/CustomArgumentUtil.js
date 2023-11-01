"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.clearCustomArguments = exports.readCustomArguments = exports.writeCustomArguments = exports.parseCommandLine = exports.PROCESS_CUSTOM_ARGUMENT_NAME = void 0;
const path_1 = require("path");
const CustomArgumentsBuilderImpl_1 = require("../core/CustomArgumentsBuilderImpl");
const CustomArgumentsImpl_1 = require("../core/CustomArgumentsImpl");
const FileOperationHelper_1 = require("../FileOperationHelper");
const PathsConstants_1 = require("../PathsConstants");
exports.PROCESS_CUSTOM_ARGUMENT_NAME = 'dtCustomArguments';
const parseCommandLine = (inputArgs) => {
    const parsedArgs = new CustomArgumentsBuilderImpl_1.CustomArgumentsBuilderImpl();
    inputArgs.forEach((entry) => {
        const parts = entry.split('=');
        if (parts.length === 2) {
            switch (parts[0]) {
                case "gradle":
                    parsedArgs.withGradleArgument(parts[1]);
                    break;
                case "config":
                    parsedArgs.withConfigurationArgument(parts[1]);
                    break;
                case "plist":
                    parsedArgs.withPlistArgument(parts[1]);
                    break;
            }
        }
    });
    return parsedArgs.build();
};
exports.parseCommandLine = parseCommandLine;
const writeCustomArguments = (customArguments) => {
    if (!customArguments.isEmpty()) {
        const customArgumentsJson = JSON.stringify(customArguments);
        process.env[exports.PROCESS_CUSTOM_ARGUMENT_NAME] = customArgumentsJson;
        FileOperationHelper_1.default.createDirectorySync(PathsConstants_1.default.getBuildPath());
        FileOperationHelper_1.default.writeTextToFileSync((0, path_1.join)(PathsConstants_1.default.getBuildPath(), 'dtCustomArguments.json'), customArgumentsJson);
    }
};
exports.writeCustomArguments = writeCustomArguments;
const readCustomArguments = () => {
    try {
        if (process.env[exports.PROCESS_CUSTOM_ARGUMENT_NAME] !== undefined) {
            const parseCustomArguments = JSON.parse(process.env[exports.PROCESS_CUSTOM_ARGUMENT_NAME]);
            return new CustomArgumentsImpl_1.CustomArgumentsImpl(parseCustomArguments.configurationPath, parseCustomArguments.gradlePath, parseCustomArguments.plistPath);
        }
        else if (FileOperationHelper_1.default.checkIfFileExistsSync((0, path_1.join)(PathsConstants_1.default.getBuildPath(), 'dtCustomArguments.json')) !== undefined) {
            const parseCustomArguments = JSON.parse(FileOperationHelper_1.default.readTextFromFileSync((0, path_1.join)(PathsConstants_1.default.getBuildPath(), 'dtCustomArguments.json')));
            return new CustomArgumentsImpl_1.CustomArgumentsImpl(parseCustomArguments.configurationPath, parseCustomArguments.gradlePath, parseCustomArguments.plistPath);
        }
        else {
            return new CustomArgumentsImpl_1.CustomArgumentsImpl();
        }
    }
    catch (error) {
        return new CustomArgumentsImpl_1.CustomArgumentsImpl();
    }
};
exports.readCustomArguments = readCustomArguments;
const clearCustomArguments = () => {
    try {
        delete process.env[exports.PROCESS_CUSTOM_ARGUMENT_NAME];
        FileOperationHelper_1.default.deleteFileSync((0, path_1.join)(PathsConstants_1.default.getBuildPath(), 'dtCustomArguments.json'));
    }
    catch (error) {
    }
};
exports.clearCustomArguments = clearCustomArguments;
