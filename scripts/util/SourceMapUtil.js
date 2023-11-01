"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.patchMetroSourceMap = exports.SOURCE_MAP_FILE = exports.SOURCE_MAP_BACKUP_FILE = void 0;
const path_1 = require("path");
const Logger_1 = require("../Logger");
const PathsConstants_1 = require("../PathsConstants");
const FileOperationHelper_1 = require("../FileOperationHelper");
exports.SOURCE_MAP_BACKUP_FILE = 'getSourceMapInfoOrig.js';
exports.SOURCE_MAP_FILE = 'getSourceMapInfo.js';
const patchMetroSourceMap = () => {
    Logger_1.default.logMessageSync('Patching SourceMap generation of Metro .. ', Logger_1.default.INFO);
    const origSourceMapPath = (0, path_1.join)(PathsConstants_1.default.getMetroSouceMapPath(), exports.SOURCE_MAP_BACKUP_FILE);
    try {
        FileOperationHelper_1.default.checkIfFileExistsSync(origSourceMapPath);
        Logger_1.default.logMessageSync('Patching of SourceMap already happened!', Logger_1.default.INFO);
    }
    catch (e) {
        try {
            const currentSourceMapPath = (0, path_1.join)(PathsConstants_1.default.getMetroSouceMapPath(), exports.SOURCE_MAP_FILE);
            FileOperationHelper_1.default.checkIfFileExistsSync(currentSourceMapPath);
            FileOperationHelper_1.default.renameFileSync(currentSourceMapPath, origSourceMapPath);
            FileOperationHelper_1.default.copyFileSync(PathsConstants_1.default.getOurSourceMapFile(), currentSourceMapPath);
            Logger_1.default.logMessageSync('Patching of SourceMap successful!', Logger_1.default.INFO);
        }
        catch (e) {
            Logger_1.default.logMessageSync('Patching of SourceMap generation failed!', Logger_1.default.ERROR);
        }
    }
};
exports.patchMetroSourceMap = patchMetroSourceMap;
