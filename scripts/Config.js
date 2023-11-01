#!/usr/bin/env node
'use strict';
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkConfiguration = exports.addDefaultConfigs = exports.readConfig = exports.defaultConfig = exports.ERROR_CONFIG_NOT_AVAILABLE = void 0;
const FileOperationHelper_1 = require("./FileOperationHelper");
const Logger_1 = require("./Logger");
const PathsConstants_1 = require("./PathsConstants");
exports.ERROR_CONFIG_NOT_AVAILABLE = '-1';
exports.defaultConfig = {
    react: {
        autoStart: true,
        debug: false,
        lifecycle: {
            includeUpdate: false,
            instrument: (filename) => false,
        },
        input: {
            instrument: (filename) => true,
            actionNamePrivacy: false,
        },
        custom: {
            reactnavigation: false,
        },
    },
};
const readConfig = (pathToConfig) => {
    patchMalformedConfiguration(pathToConfig);
    const readConfig = require(pathToConfig);
    if (readConfig === undefined) {
        throw new Error(exports.ERROR_CONFIG_NOT_AVAILABLE);
    }
    return (0, exports.addDefaultConfigs)(readConfig);
};
exports.readConfig = readConfig;
const addDefaultConfigs = (config) => {
    let duplicateDefaultConfigReact = Object.assign({}, exports.defaultConfig.react);
    duplicateDefaultConfigReact = mergeObjects(duplicateDefaultConfigReact, config.react);
    config.react = duplicateDefaultConfigReact;
    return config;
};
exports.addDefaultConfigs = addDefaultConfigs;
const checkConfiguration = (customPath) => __awaiter(void 0, void 0, void 0, function* () {
    const pathToDynatraceConfig = customPath !== undefined ? customPath : PathsConstants_1.default.getConfigFilePath();
    try {
        yield FileOperationHelper_1.default.checkIfFileExists(pathToDynatraceConfig);
    }
    catch (e) {
        yield createNewConfiguration(pathToDynatraceConfig);
    }
});
exports.checkConfiguration = checkConfiguration;
const createNewConfiguration = (pathToDynatraceConfig) => __awaiter(void 0, void 0, void 0, function* () {
    const defaultConfigContent = yield FileOperationHelper_1.default.readTextFromFile(PathsConstants_1.default.getDefaultConfig());
    yield FileOperationHelper_1.default.writeTextToFile(pathToDynatraceConfig, defaultConfigContent);
    Logger_1.default.logMessageSync('Created dynatrace.config.js - Please insert your configuration and update the file!', Logger_1.default.INFO);
});
const patchMalformedConfiguration = (pathToDynatraceConfig) => {
    const configContent = FileOperationHelper_1.default.readTextFromFileSync(pathToDynatraceConfig);
    if (configContent.indexOf('\u200B') !== -1) {
        FileOperationHelper_1.default.writeTextToFileSync(pathToDynatraceConfig, configContent.split('\u200B').join(''));
    }
};
const mergeObjects = (target, source) => {
    Object.keys(source).forEach((key) => {
        const s_val = source[key];
        const t_val = target[key];
        if ((Boolean(t_val)) && (Boolean(s_val)) && typeof t_val === 'object' && typeof s_val === 'object') {
            target[key] = mergeObjects(t_val, s_val);
        }
        else {
            target[key] = s_val;
        }
    });
    return target;
};
