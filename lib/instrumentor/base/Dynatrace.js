"use strict";
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
exports.Dynatrace = void 0;
const Types_1 = require("../model/Types");
const StringUtils_1 = require("./util/StringUtils");
const DynatraceBridge_1 = require("./DynatraceBridge");
const DataCollectionLevel_1 = require("./model/DataCollectionLevel");
const UserPrivacyOptions_1 = require("./UserPrivacyOptions");
const Logger_1 = require("./Logger");
const ConfigurationHandler_1 = require("./configuration/ConfigurationHandler");
const DynatraceRootAction_1 = require("./DynatraceRootAction");
const NullRootAction_1 = require("./NullRootAction");
const DynatraceInternal_1 = require("./DynatraceInternal");
const DynatraceAction_1 = require("./DynatraceAction");
const NullAction_1 = require("./NullAction");
exports.Dynatrace = {
    start: (configuration) => __awaiter(void 0, void 0, void 0, function* () {
        if (!ConfigurationHandler_1.ConfigurationHandler.isConfigurationAvailable()) {
            if (configuration !== undefined) {
                yield DynatraceBridge_1.DynatraceNative.start(configuration);
                ConfigurationHandler_1.ConfigurationHandler.setConfiguration(configuration);
                Logger_1.Logger.logDebug('Manual Configuration set: ' + JSON.stringify(configuration));
            }
            else {
                throw new Error('Configuration is empty! Not allowed for Manual Startup!');
            }
            Logger_1.Logger.logInfo('Dynatrace React Native Plugin started!');
        }
    }),
    withMonitoring: (Component, name) => {
        if (Component !== undefined) {
            if (Component.prototype !== undefined && Component.prototype.isReactComponent !== undefined) {
                Component._dtInfo = {
                    type: Types_1.Types.ClassComponent,
                    name,
                };
            }
            else {
                Component._dtInfo = {
                    type: Types_1.Types.FunctionalComponent,
                    name,
                };
            }
        }
        return Component;
    },
    enterAction: (name, platform) => exports.Dynatrace.enterAutoAction(name, platform),
    enterManualAction: (name, platform) => {
        if (ConfigurationHandler_1.ConfigurationHandler.isConfigurationAvailable()) {
            let key;
            if (ConfigurationHandler_1.ConfigurationHandler.getBundleName() != null) {
                key = ConfigurationHandler_1.ConfigurationHandler.getBundleName() + '_' + DynatraceInternal_1.DynatraceInternal.getCounter();
            }
            else {
                key = 'DEFAULT_' + DynatraceInternal_1.DynatraceInternal.getCounter();
            }
            if (!StringUtils_1.StringUtils.isStringNullEmptyOrUndefined(name)) {
                Logger_1.Logger.logDebug(`Dynatrace enterManualAction(${name})`);
                DynatraceBridge_1.DynatraceNative.enterManualAction(name, key, platform);
                return new DynatraceRootAction_1.DynatraceRootAction(key, name);
            }
            else {
                Logger_1.Logger.logDebug('Action Name was empty or null! Action will have no effect.');
                return new NullRootAction_1.NullRootAction();
            }
        }
        else {
            Logger_1.Logger.logInfo(`Dynatrace enterManualAction(${name}): React Native plugin has not been started yet! Action can't be created!`);
            return new NullRootAction_1.NullRootAction();
        }
    },
    enterAutoAction: (name, platform) => {
        if (ConfigurationHandler_1.ConfigurationHandler.isConfigurationAvailable()) {
            let key;
            if (ConfigurationHandler_1.ConfigurationHandler.getBundleName() != null) {
                key = ConfigurationHandler_1.ConfigurationHandler.getBundleName() + '_' + DynatraceInternal_1.DynatraceInternal.getCounter();
            }
            else {
                key = 'DEFAULT_' + DynatraceInternal_1.DynatraceInternal.getCounter();
            }
            if (!StringUtils_1.StringUtils.isStringNullEmptyOrUndefined(name)) {
                Logger_1.Logger.logDebug(`Dynatrace enterAutoAction(${name})`);
                DynatraceBridge_1.DynatraceNative.enterAction(name, key, platform);
                return new DynatraceAction_1.DynatraceAction(key, name, false);
            }
            else {
                Logger_1.Logger.logDebug('Action Name was empty or null! Action will have no effect.');
                return new NullAction_1.NullAction();
            }
        }
        else {
            Logger_1.Logger.logInfo(`Dynatrace enterAutoAction(${name}): React Native plugin has not been started yet! Action can't be created!`);
            return new NullAction_1.NullAction();
        }
    },
    reportError: (errorName, errorCode, platform) => {
        if (ConfigurationHandler_1.ConfigurationHandler.isConfigurationAvailable()) {
            Logger_1.Logger.logDebug(`Dynatrace reportError(${errorName}, ${errorCode})`);
            DynatraceBridge_1.DynatraceNative.reportErrorWithoutStacktrace(errorName, errorCode, platform);
        }
        else {
            Logger_1.Logger.logInfo(`Dynatrace reportError(${errorName}, ${errorCode}): React Native plugin has not been started yet! Error will not be reported!`);
        }
    },
    reportErrorWithStacktrace: (errorName, reason, stacktrace, platform) => {
        if (ConfigurationHandler_1.ConfigurationHandler.isConfigurationAvailable()) {
            if (!StringUtils_1.StringUtils.isStringNullEmptyOrUndefined(reason)) {
                const reasonNewLineIndex = reason.indexOf('\n');
                if (reasonNewLineIndex !== -1) {
                    reason = reason.substring(0, reasonNewLineIndex);
                }
            }
            Logger_1.Logger.logDebug(`Dynatrace reportErrorStacktrace(${errorName}, ${reason}, ${stacktrace})`);
            DynatraceBridge_1.DynatraceNative.reportError(errorName, '-', reason, stacktrace, platform);
        }
        else {
            Logger_1.Logger.logInfo(`Dynatrace reportErrorStacktrace(${errorName}, ${reason}, ${stacktrace}): React Native plugin has not been started yet! Error will not be reported!`);
        }
    },
    reportErrorStacktrace: (errorName, errorValue, reason, stacktrace, platform) => {
        if (ConfigurationHandler_1.ConfigurationHandler.isConfigurationAvailable()) {
            if (!StringUtils_1.StringUtils.isStringNullEmptyOrUndefined(reason)) {
                const reasonNewLineIndex = reason.indexOf('\n');
                if (reasonNewLineIndex !== -1) {
                    reason = reason.substring(0, reasonNewLineIndex);
                }
            }
            Logger_1.Logger.logDebug(`Dynatrace reportErrorStacktrace(${errorName}, ${errorValue}, ${reason}, ${stacktrace})`);
            DynatraceBridge_1.DynatraceNative.reportError(errorName, errorValue, reason, stacktrace, platform);
        }
        else {
            Logger_1.Logger.logInfo(`Dynatrace reportErrorStacktrace(${errorName}, ${errorValue}, ${reason}, ${stacktrace}): React Native plugin has not been started yet! Error will not be reported!`);
        }
    },
    reportCrash: (crashName, reason, stacktrace, platform) => {
        if (ConfigurationHandler_1.ConfigurationHandler.isConfigurationAvailable()) {
            if (!StringUtils_1.StringUtils.isStringNullEmptyOrUndefined(crashName)) {
                if (!StringUtils_1.StringUtils.isStringNullEmptyOrUndefined(reason)) {
                    const reasonNewLineIndex = reason.indexOf('\n');
                    if (reasonNewLineIndex !== -1) {
                        reason = reason.substring(0, reasonNewLineIndex);
                    }
                }
                Logger_1.Logger.logDebug(`Dynatrace reportCrash(${crashName}, ${reason}, ${stacktrace})`);
                DynatraceBridge_1.DynatraceNative.reportCrash(crashName, reason, stacktrace, false, true, platform);
            }
        }
        else {
            Logger_1.Logger.logInfo(`Dynatrace reportCrash(${crashName}, ${reason}, ${stacktrace}): React Native plugin has not been started yet! Crash will not be reported!`);
        }
    },
    reportCrashWithException: (crashName, crash, platform) => {
        if (ConfigurationHandler_1.ConfigurationHandler.isConfigurationAvailable()) {
            if (!StringUtils_1.StringUtils.isStringNullEmptyOrUndefined(crashName) &&
                !StringUtils_1.StringUtils.isStringNullEmptyOrUndefined(crash.stack)) {
                let crashReason = crash.message;
                if (!StringUtils_1.StringUtils.isStringNullEmptyOrUndefined(crashReason)) {
                    const reasonNewLineIndex = crashReason.indexOf('\n');
                    if (reasonNewLineIndex !== -1) {
                        crashReason = crashReason.substring(0, reasonNewLineIndex);
                    }
                }
                Logger_1.Logger.logDebug(`Dynatrace reportCrashWithException(${crashName}, ${crash.stack})`);
                DynatraceBridge_1.DynatraceNative.reportCrash(crashName, crashReason, crash.stack, true, true, platform);
            }
        }
        else {
            Logger_1.Logger.logInfo(`Dynatrace reportCrashWithException(${crashName}, ${crash}): React Native plugin has not been started yet! Crash will not be reported!`);
        }
    },
    sendEvent: (name, attributes = {}, platform) => {
        if (ConfigurationHandler_1.ConfigurationHandler.isConfigurationAvailable()) {
            if (StringUtils_1.StringUtils.isStringNullEmptyOrUndefined(name)) {
                Logger_1.Logger.logDebug(`Dynatrace sendEvent(${name}, ${attributes}): Name must be a non empty string`);
                return;
            }
            if (typeof attributes !== 'object' ||
                attributes === null ||
                Array.isArray(attributes)) {
                Logger_1.Logger.logDebug(`Dynatrace sendEvent(${name}, ${attributes}): Payload toplevel must be an object`);
                return;
            }
            const internalAttributes = Object.assign({}, attributes);
            Logger_1.Logger.logDebug(`Dynatrace sendEvent(${name}, ${internalAttributes})`);
            DynatraceBridge_1.DynatraceNative.sendEvent(name, internalAttributes, platform);
        }
        else {
            Logger_1.Logger.logInfo(`Dynatrace sendEvent(${name}, ${attributes}): React Native plugin has not been started yet! Event will not be reported!`);
        }
    },
    sendBizEvent: (type, attributes = {}, platform) => {
        if (ConfigurationHandler_1.ConfigurationHandler.isConfigurationAvailable()) {
            if (StringUtils_1.StringUtils.isStringNullEmptyOrUndefined(type)) {
                Logger_1.Logger.logDebug(`Dynatrace sendBizEvent(${type}, ${attributes})): Type must be a non empty string`);
                return;
            }
            if (typeof attributes !== 'object' ||
                attributes === null ||
                Array.isArray(attributes)) {
                Logger_1.Logger.logDebug(`Dynatrace sendBizEvent(${type}, ${attributes})): Payload toplevel must be an object`);
                return;
            }
            const internalAttributes = Object.assign({}, attributes);
            Logger_1.Logger.logDebug(`Dynatrace sendBizEvent(${type}, ${internalAttributes})`);
            DynatraceBridge_1.DynatraceNative.sendBizEvent(type, internalAttributes, platform);
        }
        else {
            Logger_1.Logger.logInfo(`Dynatrace sendBizEvent(${type}, ${attributes}): React Native plugin has not been started yet! Biz Event will not be reported!`);
        }
    },
    endSession: (platform) => {
        if (ConfigurationHandler_1.ConfigurationHandler.isConfigurationAvailable()) {
            Logger_1.Logger.logDebug('Dynatrace endSession()');
            DynatraceBridge_1.DynatraceNative.endVisit(platform);
        }
        else {
            Logger_1.Logger.logInfo('Dynatrace endSession(): React Native plugin has not been started yet! Session will not be ended!');
        }
    },
    identifyUser: (user, platform) => {
        if (ConfigurationHandler_1.ConfigurationHandler.isConfigurationAvailable()) {
            Logger_1.Logger.logDebug(`Dynatrace identifyUser(${user})`);
            DynatraceBridge_1.DynatraceNative.identifyUser(user, platform);
        }
        else {
            Logger_1.Logger.logInfo(`Dynatrace identifyUser(${user}): React Native plugin has not been started yet! Session will not be tagged!`);
        }
    },
    setGPSLocation: (latitude, longitude, platform) => {
        if (ConfigurationHandler_1.ConfigurationHandler.isConfigurationAvailable()) {
            Logger_1.Logger.logDebug(`Dynatrace setGPSLocation(${latitude}, ${longitude})`);
            DynatraceBridge_1.DynatraceNative.setGPSLocation(latitude, longitude, platform);
        }
        else {
            Logger_1.Logger.logInfo(`Dynatrace setGPSLocation(${latitude}, ${longitude}): React Native plugin has not been started yet! GPS Position will not be set!`);
        }
    },
    isCrashReportingOptedIn: (platform) => __awaiter(void 0, void 0, void 0, function* () {
        if (ConfigurationHandler_1.ConfigurationHandler.isConfigurationAvailable()) {
            Logger_1.Logger.logDebug('Dynatrace isCrashReportingOptedIn()');
            return DynatraceBridge_1.DynatraceNative.isCrashReportingOptedIn(platform);
        }
        else {
            Logger_1.Logger.logInfo('Dynatrace isCrashReportingOptedIn(): React Native plugin has not been started yet! Crash reporting value not available!');
            return false;
        }
    }),
    setCrashReportingOptedIn: (crashReporting, platform) => {
        if (ConfigurationHandler_1.ConfigurationHandler.isConfigurationAvailable()) {
            Logger_1.Logger.logDebug(`Dynatrace setCrashReportingOptedIn(${crashReporting})`);
            DynatraceBridge_1.DynatraceNative.setCrashReportingOptedIn(crashReporting, platform);
        }
        else {
            Logger_1.Logger.logInfo(`Dynatrace setCrashReportingOptedIn(${crashReporting}): React Native plugin has not been started yet! Crash reporting value will not be set!`);
        }
    },
    getDataCollectionLevel: (platform) => __awaiter(void 0, void 0, void 0, function* () {
        if (ConfigurationHandler_1.ConfigurationHandler.isConfigurationAvailable()) {
            Logger_1.Logger.logDebug('Dynatrace getDataCollectionLevel()');
            return DynatraceBridge_1.DynatraceNative.getDataCollectionLevel(platform);
        }
        else {
            Logger_1.Logger.logInfo('Dynatrace getDataCollectionLevel(): React Native plugin has not been started yet! Data Collection level not available!');
            return DataCollectionLevel_1.DataCollectionLevel.Off;
        }
    }),
    setDataCollectionLevel: (dataCollectionLevel, platform) => {
        if (ConfigurationHandler_1.ConfigurationHandler.isConfigurationAvailable()) {
            Logger_1.Logger.logDebug(`Dynatrace setDataCollectionLevel(${dataCollectionLevel})`);
            DynatraceBridge_1.DynatraceNative.setDataCollectionLevel(dataCollectionLevel, platform);
        }
        else {
            Logger_1.Logger.logInfo(`Dynatrace setDataCollectionLevel(${dataCollectionLevel}): React Native plugin has not been started yet! Data Collection level will not be set!`);
        }
    },
    getUserPrivacyOptions: (platform) => __awaiter(void 0, void 0, void 0, function* () {
        if (ConfigurationHandler_1.ConfigurationHandler.isConfigurationAvailable()) {
            Logger_1.Logger.logDebug('Dynatrace getUserPrivacyOptions()');
            const options = yield DynatraceBridge_1.DynatraceNative.getUserPrivacyOptions(platform);
            const currentOptions = new UserPrivacyOptions_1.UserPrivacyOptions(options.dataCollectionLevel, options.crashReportingOptedIn);
            return currentOptions;
        }
        else {
            Logger_1.Logger.logInfo('Dynatrace getUserPrivacyOptions(): React Native plugin has not been started yet! User Privacy Options are not available!');
            return new UserPrivacyOptions_1.UserPrivacyOptions(DataCollectionLevel_1.DataCollectionLevel.Off, false);
        }
    }),
    applyUserPrivacyOptions: (userPrivacyOptions, platform) => {
        if (ConfigurationHandler_1.ConfigurationHandler.isConfigurationAvailable()) {
            if ((userPrivacyOptions.crashReportingOptedIn === true ||
                userPrivacyOptions.crashReportingOptedIn === false) &&
                userPrivacyOptions.dataCollectionLevel in DataCollectionLevel_1.DataCollectionLevel) {
                Logger_1.Logger.logDebug(`Dynatrace applyUserPrivacyOptions(${JSON.stringify(userPrivacyOptions)})`);
                DynatraceBridge_1.DynatraceNative.applyUserPrivacyOptions(userPrivacyOptions, platform);
            }
        }
        else {
            Logger_1.Logger.logInfo(`Dynatrace applyUserPrivacyOptions(${JSON.stringify(userPrivacyOptions)}): React Native plugin has not been started yet! User Privacy Options can't be applied!`);
        }
    },
    flushEvents: (platform) => {
        if (ConfigurationHandler_1.ConfigurationHandler.isConfigurationAvailable()) {
            Logger_1.Logger.logDebug('Dynatrace flushEvents()');
            DynatraceBridge_1.DynatraceNative.flushEvents(platform);
        }
        else {
            Logger_1.Logger.logInfo('Dynatrace flushEvents(): React Native plugin has not been started yet! Flushing Event not possible!');
        }
    },
    setBeaconHeaders: (headers, platform) => {
        if (ConfigurationHandler_1.ConfigurationHandler.isConfigurationAvailable()) {
            Logger_1.Logger.logDebug('Dynatrace setBeaconHeaders(headers)');
            if (headers && headers.size > 0) {
                const obj = {};
                headers.forEach((value, key) => (obj[key] = value));
                DynatraceBridge_1.DynatraceNative.setBeaconHeaders(obj, platform);
            }
            else if (!headers || typeof headers !== 'undefined') {
                DynatraceBridge_1.DynatraceNative.setBeaconHeaders(null, platform);
            }
        }
        else {
            Logger_1.Logger.logInfo('Dynatrace setBeaconHeaders(headers): React Native plugin has not been started yet! Setting Beacon Headers is not possible!');
        }
    },
};
