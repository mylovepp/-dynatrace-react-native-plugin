#!/usr/bin/env node
'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
const path_1 = require("path");
const PATH_FILES = 'files';
const PATH_LOGS = 'logs';
let rootPath = __dirname;
exports.default = {
    setRoot: (newRoot) => {
        rootPath = (0, path_1.resolve)(newRoot);
    },
    getApplicationPath: () => (0, path_1.join)(getPluginPath(), '..', '..', '..'),
    getAppJsonFile: () => (0, path_1.join)(getApplicationPath(), 'app.json'),
    getPackageJsonFile() {
        return (0, path_1.join)(this.getApplicationPath(), 'package.json');
    },
    getMetroSouceMapPath() {
        return (0, path_1.join)(this.getApplicationPath(), 'node_modules', 'metro', 'src', 'DeltaBundler', 'Serializers', 'helpers');
    },
    getOurSourceMapFile: () => (0, path_1.join)(getPluginPath(), 'lib', 'metro', 'getSourceMapInfo.js'),
    getInternalPackageJsonFile: () => (0, path_1.join)(getPluginPath(), 'package.json'),
    getDefaultConfig: () => (0, path_1.join)(getPluginPath(), PATH_FILES, 'default.config.js'),
    getBuildPath: () => (0, path_1.join)(getPluginPath(), 'build'),
    getConfigFilePath: () => (0, path_1.join)(getApplicationPath(), 'dynatrace.config.js'),
    getAndroidFolder: () => (0, path_1.join)(getApplicationPath(), 'android'),
    getAndroidGradleFile: (androidFolder) => (0, path_1.join)(androidFolder, 'build.gradle'),
    getIOSFolder: () => (0, path_1.join)(getApplicationPath(), 'ios'),
    getDynatraceGradleFile: () => (0, path_1.join)(getPluginPath(), PATH_FILES, 'dynatrace.gradle'),
    getCurrentLogPath: () => (0, path_1.join)(getPluginPath(), PATH_LOGS, 'currentLog.txt'),
    getLogPath: () => (0, path_1.join)(getPluginPath(), PATH_LOGS),
};
const getPluginPath = () => (0, path_1.join)(rootPath, '..');
const getApplicationPath = () => (0, path_1.join)(getPluginPath(), '..', '..', '..');
