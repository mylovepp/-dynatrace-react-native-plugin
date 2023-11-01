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
const nodePath = require("path");
const Logger_1 = require("./Logger");
const FileOperationHelper_1 = require("./FileOperationHelper");
const PathsConstants_1 = require("./PathsConstants");
const android = require("./Android");
const Ios_1 = require("./Ios");
const removePatchMetroSourceMap = () => __awaiter(void 0, void 0, void 0, function* () {
    Logger_1.default.logMessageSync('Undo Patching SourceMap generation of Metro .. ', Logger_1.default.INFO);
    try {
        const currentSourceMapPath = nodePath.join(PathsConstants_1.default.getMetroSouceMapPath(), 'getSourceMapInfo.js');
        const origSourceMapPath = nodePath.join(PathsConstants_1.default.getMetroSouceMapPath(), 'getSourceMapInfoOrig.js');
        yield FileOperationHelper_1.default.checkIfFileExists(origSourceMapPath);
        yield FileOperationHelper_1.default.deleteFile(currentSourceMapPath);
        yield FileOperationHelper_1.default.renameFile(origSourceMapPath, currentSourceMapPath);
        Logger_1.default.logMessageSync('Removed patch for SourceMap generation of Metro!', Logger_1.default.INFO);
    }
    catch (e) {
        Logger_1.default.logMessageSync('Removing of patch for SourceMap generation failed!', Logger_1.default.ERROR);
    }
});
const removeGradleModification = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const path = yield FileOperationHelper_1.default.checkIfFileExists(nodePath.join(PathsConstants_1.default.getAndroidFolder(), 'build.gradle'));
        android.instrumentAndroidPlatform(path, true);
    }
    catch (e) {
        Logger_1.default.logMessageSync('Removal of Gradle modification didnt work!', Logger_1.default.ERROR);
    }
});
const removePListModification = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        Ios_1.default.modifyPListFile(undefined, undefined, true);
    }
    catch (e) {
        Logger_1.default.logMessageSync('Removal of PList modification didnt work!', Logger_1.default.ERROR);
    }
});
module.exports = (() => __awaiter(void 0, void 0, void 0, function* () {
    yield removePatchMetroSourceMap();
    yield removeGradleModification();
    yield removePListModification();
}))();
