#!/usr/bin/env node
'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
exports.writeGradleConfig = exports.instrumentAndroidPlatform = exports.GRADLE_APPLY_BUILDSCRIPT = exports.GRADLE_DYNATRACE_FILE = void 0;
const Logger_1 = require("./Logger");
const FileOperationHelper_1 = require("./FileOperationHelper");
const PathsConstants_1 = require("./PathsConstants");
const GRADLE_CONFIG_IDENTIFIER = '// AUTO - INSERTED';
exports.GRADLE_DYNATRACE_FILE = 'apply from: "../node_modules/@dynatrace/react-native-plugin/files/dynatrace.gradle"';
const GRADLE_BUILDSCRIPT_IDENTIFIER = 'buildscript';
exports.GRADLE_APPLY_BUILDSCRIPT = 'apply from: "../node_modules/@dynatrace/react-native-plugin/files/plugin.gradle", to: buildscript';
const instrumentAndroidPlatform = (pathToGradle, remove) => {
    const path = FileOperationHelper_1.default.checkIfFileExistsSync(pathToGradle);
    if (!path.endsWith('.gradle')) {
        throw new Error("Can't find .gradle file. gradle path must also include the gradle file!");
    }
    changeReactNativeBuildGradleFile(path, remove);
};
exports.instrumentAndroidPlatform = instrumentAndroidPlatform;
const removeOldDynatraceClasspath = (gradleFileContent) => {
    const gradleFileContentLines = gradleFileContent.split('\n');
    for (let i = 0; i < gradleFileContentLines.length; i++) {
        if (gradleFileContentLines[i].indexOf('com.dynatrace.tools') > -1) {
            gradleFileContentLines.splice(i, 1);
            Logger_1.default.logMessageSync('Removed old Dynatrace classpath from build.gradle', Logger_1.default.INFO);
            break;
        }
    }
    return gradleFileContentLines.join('\n');
};
const changeReactNativeBuildGradleFile = (pathToGradle, remove) => {
    const gradleFileContent = FileOperationHelper_1.default.readTextFromFileSync(pathToGradle);
    const modifiedFileContent = removeOldDynatraceClasspath(gradleFileContent);
    const gradleFileContentLines = modifiedFileContent.split('\n');
    let gradlePluginFileIndex = -1;
    let gradleDynatraceFileIndex = -1;
    for (let i = 0; i < gradleFileContentLines.length && (gradleDynatraceFileIndex === -1 || gradlePluginFileIndex === -1); i++) {
        if (gradleFileContentLines[i].indexOf('plugin.gradle') > -1) {
            gradlePluginFileIndex = i;
        }
        else if (gradleFileContentLines[i].indexOf('dynatrace.gradle') > -1) {
            gradleDynatraceFileIndex = i;
        }
    }
    let modified = false;
    if (remove) {
        if (gradlePluginFileIndex !== -1) {
            gradleFileContentLines.splice(gradlePluginFileIndex, 1);
            modified = true;
        }
        if (gradleDynatraceFileIndex !== -1) {
            gradleFileContentLines.splice(gradleDynatraceFileIndex - (modified ? 1 : 0), 1);
            modified = true;
        }
        if (modified) {
            Logger_1.default.logMessageSync('Removed Dynatrace modifications from build.gradle: ' + pathToGradle, Logger_1.default.INFO);
        }
    }
    else {
        if (gradlePluginFileIndex === -1) {
            let gradleFileReactIndex = -1;
            for (let i = 0; i < gradleFileContentLines.length; i++) {
                if (gradleFileContentLines[i].startsWith(GRADLE_BUILDSCRIPT_IDENTIFIER)) {
                    gradleFileReactIndex = i;
                    break;
                }
            }
            if (gradleFileReactIndex === -1) {
                throw new Error('Could not find Buildscript block in build.gradle.');
            }
            gradleFileContentLines.splice(gradleFileReactIndex + 1, 0, exports.GRADLE_APPLY_BUILDSCRIPT);
            modified = true;
        }
        if (gradleDynatraceFileIndex === -1) {
            gradleFileContentLines.splice(gradleFileContentLines.length, 0, exports.GRADLE_DYNATRACE_FILE);
            modified = true;
        }
        if (modified) {
            Logger_1.default.logMessageSync('Added Dynatrace plugin.gradle to the build.gradle: ' + pathToGradle, Logger_1.default.INFO);
        }
        else {
            Logger_1.default.logMessageSync('Dynatrace plugin & agent already added to build.gradle', Logger_1.default.INFO);
        }
    }
    if (modified) {
        const fullGradleFile = gradleFileContentLines.join('\n');
        FileOperationHelper_1.default.writeTextToFileSync(pathToGradle, fullGradleFile);
    }
};
const writeGradleConfig = (androidConfig) => {
    if (androidConfig === undefined || androidConfig.config === undefined) {
        Logger_1.default.logMessageSync("Can't write configuration of Android agent because it is missing!", Logger_1.default.WARNING);
        return;
    }
    const gradleFileContent = FileOperationHelper_1.default.readTextFromFileSync(PathsConstants_1.default.getDynatraceGradleFile());
    const gradleFileContentLines = removeOldGradleConfig(gradleFileContent);
    let gradleFileIndex = -1;
    for (let i = 0; i < gradleFileContentLines.length; i++) {
        if (gradleFileContentLines[i].indexOf(GRADLE_CONFIG_IDENTIFIER) > -1) {
            gradleFileIndex = i;
            break;
        }
    }
    gradleFileContentLines.splice(gradleFileIndex + 1, 0, androidConfig.config);
    const fullGradleFile = gradleFileContentLines.join('\n');
    FileOperationHelper_1.default.writeTextToFileSync(PathsConstants_1.default.getDynatraceGradleFile(), fullGradleFile);
    Logger_1.default.logMessageSync('Replaced old configuration with current configuration in dynatrace.gradle', Logger_1.default.INFO);
};
exports.writeGradleConfig = writeGradleConfig;
const removeOldGradleConfig = (gradleFileContent) => {
    const gradleFileContentLines = gradleFileContent.split('\n');
    const gradleConfigIndex = [];
    for (let i = 0; i < gradleFileContentLines.length && gradleConfigIndex.length < 2; i++) {
        if (gradleFileContentLines[i].indexOf(GRADLE_CONFIG_IDENTIFIER) > -1) {
            gradleConfigIndex.push(i);
        }
    }
    if (gradleConfigIndex.length !== 2) {
        throw new Error('Could not find identfier in internal gradle file. Please re-install.');
    }
    gradleFileContentLines.splice(gradleConfigIndex[0] + 1, gradleConfigIndex[1] - (gradleConfigIndex[0] + 1));
    return gradleFileContentLines;
};
