#!/usr/bin/env node
'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
const fs = require("fs");
const nodePath = require("path");
const FileOperationHelper_1 = require("./FileOperationHelper");
const PathsConstants_1 = require("./PathsConstants");
const Config_1 = require("./Config");
const ERROR = 0;
const INFO = 1;
const WARNING = 2;
const closeLogFile = () => {
    if (process.env.SILENT === 'true') {
        return;
    }
    return FileOperationHelper_1.default.checkIfFileExists(PathsConstants_1.default.getCurrentLogPath())
        .then((_file) => new Promise((resolve, reject) => {
        const logFileName = currentDate().split(':').join('-') + '.txt';
        fs.rename(_file, nodePath.join(PathsConstants_1.default.getLogPath(), logFileName), (err) => {
            if (err) {
                reject('Renaming of the log file failed!');
            }
            resolve(nodePath.join(PathsConstants_1.default.getLogPath(), logFileName));
        });
    }))
        .catch(errorHandling);
};
const logErrorSync = (_message) => {
    const config = (0, Config_1.readConfig)(PathsConstants_1.default.getConfigFilePath());
    if (config.react !== undefined && config.react.debug) {
        logMessageSync(_message, ERROR, true);
    }
};
const logMessageSync = (_message, _logLevel, _onlyConsole = false) => {
    if (process.env.SILENT === 'true') {
        return;
    }
    try {
        fs.mkdirSync(PathsConstants_1.default.getLogPath());
    }
    catch (e) {
    }
    let logString;
    if (_logLevel === INFO) {
        logString = '#INFO  ';
    }
    else if (_logLevel === WARNING) {
        logString = '#WARN  ';
    }
    else if (_logLevel === ERROR) {
        logString = '#ERROR ';
    }
    else {
        logString = '#NONE  ';
    }
    const outputString = logString + '[' + currentDate() + ']: ' + _message;
    console.log(outputString);
    if (!_onlyConsole) {
        fs.appendFileSync(PathsConstants_1.default.getCurrentLogPath(), outputString + '\r\n');
    }
};
const errorHandling = (_message) => {
    console.log(_message);
};
const currentDate = () => {
    const tzoffset = (new Date()).getTimezoneOffset() * 60000;
    const localISOTime = (new Date(Date.now() - tzoffset)).toISOString().slice(0, -5);
    return localISOTime.replace('T', ' ');
};
exports.default = {
    ERROR,
    INFO,
    WARNING,
    closeLogFile,
    logMessageSync,
    logErrorSync,
};
