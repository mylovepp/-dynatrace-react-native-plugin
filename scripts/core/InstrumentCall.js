"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.instrumentCommand = void 0;
const path_1 = require("path");
const Logger_1 = require("../Logger");
const Config_1 = require("../Config");
const android = require("../Android");
const PathsConstants_1 = require("../PathsConstants");
const Ios_1 = require("../Ios");
const InstrumentUtil_1 = require("../util/InstrumentUtil");
const CustomArgumentUtil_1 = require("../util/CustomArgumentUtil");
const Platform_1 = require("../api/model/Platform");
const SourceMapUtil_1 = require("../util/SourceMapUtil");
const instrumentCommand = () => {
    Logger_1.default.logMessageSync('Starting instrumentation of React Native application ..', Logger_1.default.INFO);
    (0, InstrumentUtil_1.showVersionOfPlugin)();
    let pathToConfig = PathsConstants_1.default.getConfigFilePath();
    let pathToGradle = PathsConstants_1.default.getAndroidGradleFile(PathsConstants_1.default.getAndroidFolder());
    let androidAvailable = true;
    let pathToPList;
    let iosAvailable = true;
    const argv = (0, CustomArgumentUtil_1.parseCommandLine)(process.argv.slice(2));
    if (argv.isEmpty()) {
        (0, CustomArgumentUtil_1.clearCustomArguments)();
    }
    else {
        (0, CustomArgumentUtil_1.writeCustomArguments)(argv);
    }
    if (argv.isCustomConfigurationPathSet()) {
        pathToConfig = argv.getCustomConfigurationPath();
    }
    if (argv.isCustomGradlePathSet()) {
        pathToGradle = argv.getCustomGradlePath();
        androidAvailable = (0, InstrumentUtil_1.isPlatformAvailable)(pathToGradle, Platform_1.Platform.Android);
    }
    else {
        androidAvailable = (0, InstrumentUtil_1.isPlatformAvailable)(PathsConstants_1.default.getAndroidFolder(), Platform_1.Platform.Android);
    }
    if (argv.isCustomPlistPathSet()) {
        pathToPList = (0, path_1.resolve)(argv.getCustomPlistPath());
        iosAvailable = (0, InstrumentUtil_1.isPlatformAvailable)(pathToPList, Platform_1.Platform.IOS);
    }
    else {
        iosAvailable = (0, InstrumentUtil_1.isPlatformAvailable)(PathsConstants_1.default.getIOSFolder(), Platform_1.Platform.IOS);
    }
    pathToConfig = (0, path_1.resolve)(pathToConfig);
    pathToGradle = (0, path_1.resolve)(pathToGradle);
    if (iosAvailable || androidAvailable) {
        try {
            Logger_1.default.logMessageSync('Trying to read configuration file: ' + pathToConfig, Logger_1.default.INFO);
            const configAgent = (0, Config_1.readConfig)(pathToConfig);
            if (androidAvailable) {
                try {
                    Logger_1.default.logMessageSync('Starting Android Instrumentation with Dynatrace!', Logger_1.default.INFO);
                    android.instrumentAndroidPlatform(pathToGradle, false);
                    android.writeGradleConfig(configAgent.android);
                }
                catch (e) {
                    if (e instanceof Error) {
                        Logger_1.default.logMessageSync(e.message, Logger_1.default.ERROR);
                    }
                }
                finally {
                    Logger_1.default.logMessageSync('Finished Android Instrumentation with Dynatrace!', Logger_1.default.INFO);
                }
            }
            if (iosAvailable) {
                try {
                    Logger_1.default.logMessageSync('Starting iOS Instrumentation with Dynatrace!', Logger_1.default.INFO);
                    Ios_1.default.modifyPListFile(pathToPList, configAgent.ios, false);
                }
                catch (e) {
                    if (e instanceof Error) {
                        Logger_1.default.logMessageSync(e.message, Logger_1.default.ERROR);
                    }
                }
                finally {
                    Logger_1.default.logMessageSync('Finished iOS Instrumentation with Dynatrace!', Logger_1.default.INFO);
                }
            }
            (0, SourceMapUtil_1.patchMetroSourceMap)();
        }
        catch (e) {
            if (e instanceof Error) {
                Logger_1.default.logMessageSync(e.message, Logger_1.default.ERROR);
            }
        }
    }
    else {
        Logger_1.default.logMessageSync('Both Android and iOS Folder are not available - Skip instrumentation.', Logger_1.default.WARNING);
    }
    Logger_1.default.logMessageSync('Finished instrumentation of React Native application ..', Logger_1.default.INFO);
    Logger_1.default.closeLogFile();
};
exports.instrumentCommand = instrumentCommand;
