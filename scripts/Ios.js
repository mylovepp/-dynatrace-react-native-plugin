#!/usr/bin/env node
'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
const nodePath = require("path");
const plist = require("plist");
const Logger_1 = require("./Logger");
const FileOperationHelper_1 = require("./FileOperationHelper");
const PathsConstants_1 = require("./PathsConstants");
const PlistConstants_1 = require("./util/PlistConstants");
const modifyPListFile = (pathToPList, iosConfig, removeOnly) => {
    if (pathToPList === undefined) {
        pathToPList = findPListFile();
    }
    else {
        if (!pathToPList.endsWith('.plist')) {
            throw new Error("Can't find .plist file. plist path must also include the plist file!");
        }
        try {
            FileOperationHelper_1.default.checkIfFileExistsSync(pathToPList);
        }
        catch (e) {
            throw new Error('Could not read plist file: ' + pathToPList);
        }
    }
    const parsedPList = parsePList(pathToPList);
    const configProps = iosConfig === null || iosConfig === void 0 ? void 0 : iosConfig.config;
    if (removeOnly) {
        removePListConfig(pathToPList);
    }
    else {
        if (iosConfig && (configProps != null)) {
            if (hasDuplicateProperties(configProps)) {
                throw new Error('Duplicate properties found! Please remove duplicates and try again.');
            }
            if (isAutoStartEnabled(configProps)) {
                if (checkForBeaconUrlAndAppId(configProps)) {
                    createNewPListIfRequired(parsedPList, configProps, pathToPList);
                }
                else {
                    throw new Error('The dynatrace.config.js file does not contain DTXBeaconURL or DTXApplicationID properties. ' +
                        'If you want to auto-start the iOS agent, please add these two properties at minimum as they are required. ' +
                        'If you are using a manual startup of the iOS agent, please add just the DTXAutoStart property ' +
                        '(no other properties are needed and none will be considered) with the value set to false.');
                }
            }
            else {
                if (checkForBeaconUrlAndAppId(configProps)) {
                    throw new Error('The dynatrace.config.js file contains DTXBeaconURL and or DTXApplicationID properties while ' +
                        'DTXAutoStart is set to false. Any properties that you add to the dynatrace.config.js file will not be used ' +
                        'if DTXAutoStart is set to false. If you want to manually start the iOS agent, please only add the ' +
                        'DTXAutoStart property and set the value to false.');
                }
                else {
                    createNewPListIfRequired(parsedPList, configProps, pathToPList);
                }
            }
        }
        else {
            throw new Error("Can't write configuration of iOS agent because it is missing!");
        }
    }
};
const removePListConfig = (file) => {
    const pListContent = FileOperationHelper_1.default.readTextFromFileSync(file);
    const pListObj = plist.parse(pListContent);
    const pListObjCopy = Object.assign({}, pListObj);
    for (const property in pListObj) {
        if (property.startsWith('DTX')) {
            delete pListObjCopy[property];
        }
    }
    FileOperationHelper_1.default.writeTextToFileSync(file, plist.build(pListObjCopy));
    Logger_1.default.logMessageSync('Removed old configuration in plist file: ' + file, Logger_1.default.INFO);
};
const addAgentConfigToPListFile = (file, config) => {
    const pListContent = FileOperationHelper_1.default.readTextFromFileSync(file);
    const newPListContent = PlistConstants_1.START_PLIST + config + PlistConstants_1.END_PLIST;
    FileOperationHelper_1.default.writeTextToFileSync(file, plist.build(Object.assign(Object.assign({}, plist.parse(pListContent)), plist.parse(newPListContent))));
    Logger_1.default.logMessageSync('Updated configuration in plist file: ' + file, Logger_1.default.INFO);
};
const findPListFile = () => {
    const appJson = FileOperationHelper_1.default.readTextFromFileSync(PathsConstants_1.default.getAppJsonFile());
    const appJsonObj = JSON.parse(appJson);
    let appName;
    if (appJsonObj.expo !== undefined) {
        appName = appJsonObj.expo.name;
    }
    else if (appJsonObj.name !== undefined) {
        appName = appJsonObj.name;
    }
    else {
        throw new Error('Name of the application is unknown. Check your app.json file!');
    }
    const pListPaths = [];
    pListPaths.push(nodePath.join(PathsConstants_1.default.getIOSFolder(), appName, 'Info.plist'));
    pListPaths.push(nodePath.join(PathsConstants_1.default.getIOSFolder(), appName, 'Supporting', 'Info.plist'));
    for (const pListPath of pListPaths) {
        try {
            FileOperationHelper_1.default.checkIfFileExistsSync(pListPath);
            return pListPath;
        }
        catch (e) {
        }
    }
    throw new Error("Can't find .plist file in iOS Folder! Try to use plist= custom argument. See documentation for help!");
};
const parsePList = (file) => {
    const pListContent = FileOperationHelper_1.default.readTextFromFileSync(file);
    let pListObj = plist.parse(pListContent);
    return pListObj = Object.assign({}, pListObj);
};
const isAutoStartEnabled = (config) => {
    if (config !== undefined && config.indexOf(PlistConstants_1.AUTO_START_PROP) >= 0) {
        const configObj = PlistConstants_1.START_PLIST + config + PlistConstants_1.END_PLIST;
        const configObjCopy = plist.parse(configObj);
        const configKeys = Object.keys(configObjCopy);
        const configValues = Object.values(configObjCopy);
        for (const key in configKeys) {
            if (configKeys[key] === 'DTXAutoStart' && typeof configValues[key] === 'boolean') {
                return configValues[key];
            }
        }
    }
    return true;
};
const checkForBeaconUrlAndAppId = (config) => config != null && config.indexOf('DTXApplicationID') >= 0 && config.indexOf('DTXBeaconURL') >= 0;
const checkForExcludedControls = (config) => config != null && config.indexOf('DTXExcludedControls') >= 0;
const updatedExcludedStr = (config) => {
    if (checkForExcludedControls(config)) {
        const controlsArr = Object.keys(PlistConstants_1.CONTROLS_PROP_OPTIONS);
        let updatedStr = `${PlistConstants_1.START_CONTROLS_PROP}${PlistConstants_1.CONTROLS_PROP_OPTIONS.PickerView}`;
        for (let index = 0; index < controlsArr.length; index++) {
            if (controlsArr[index] !== 'PickerView' && config.indexOf(PlistConstants_1.CONTROLS_PROP_OPTIONS[controlsArr[index]].trim()) >= 0) {
                updatedStr = updatedStr + PlistConstants_1.CONTROLS_PROP_OPTIONS[controlsArr[index]];
            }
        }
        return `${updatedStr}${PlistConstants_1.END_CONTROLS_PROP}`;
    }
    return PlistConstants_1.DEFAULT_CONTROLS_PROP;
};
const isPropertyCountEqual = (parsedPList, config) => {
    const configObj = PlistConstants_1.START_PLIST + config + PlistConstants_1.END_PLIST;
    const configObjCopy = plist.parse(configObj);
    return Object.keys(parsedPList)
        .filter((pListDtxKeys) => pListDtxKeys.startsWith('DTX')).length === Object.keys(configObjCopy)
        .filter((configDtxKeys) => configDtxKeys.startsWith('DTX')).length;
};
const areConfigsEqual = (parsedPList, configObj) => {
    const pListKeys = Object.keys(parsedPList);
    for (const property of pListKeys) {
        const plistProperty = parsedPList[property];
        const configProperty = configObj[property];
        const objectProperties = isPropertyAnObject(plistProperty) && isPropertyAnObject(configProperty);
        if (objectProperties && !areConfigsEqual(plistProperty, configProperty) ||
            !objectProperties && plistProperty !== configProperty) {
            return false;
        }
    }
    return true;
};
const comparePListAndConfig = (pListObj, config) => {
    const configObj = PlistConstants_1.START_PLIST + config + PlistConstants_1.END_PLIST;
    const configObjCopy = plist.parse(configObj);
    removeNonDTXProperties(pListObj);
    removeNonDTXProperties(configObjCopy);
    return areConfigsEqual(pListObj, configObjCopy);
};
const isPropertyAnObject = (propertyObject) => propertyObject != null && typeof propertyObject === 'object';
const removeNonDTXProperties = (propertiesObject) => {
    const updatedObject = propertiesObject;
    for (const property in propertiesObject) {
        if (!property.startsWith('DTX')) {
            delete updatedObject[property];
        }
    }
    return updatedObject;
};
const hasDuplicateProperties = (config) => {
    const configArr = config.split('\n');
    const newConfigArr = configArr.filter((configDtxKeys) => configDtxKeys.startsWith('<key>DTX'));
    return !newConfigArr.every((property) => newConfigArr.indexOf(property) === newConfigArr.lastIndexOf(property));
};
const createNewPListIfRequired = (parsedPList, configProps, pathToPList) => {
    const configIncludingFlavor = configProps + PlistConstants_1.FLAVOR_PROP + updatedExcludedStr(configProps);
    if (isPropertyCountEqual(parsedPList, configIncludingFlavor) && comparePListAndConfig(parsedPList, configIncludingFlavor)) {
        Logger_1.default.logMessageSync('Not generating a new plist as the current plist and ' +
            '   dynatrace.config.js iOS properties are identical!', Logger_1.default.INFO);
    }
    else {
        Logger_1.default.logMessageSync('Generating a new plist as the current plist ' +
            'and dynatrace.config.js iOS properties do not match!', Logger_1.default.INFO);
        removePListConfig(pathToPList);
        addAgentConfigToPListFile(pathToPList, configIncludingFlavor);
    }
};
exports.default = {
    modifyPListFile,
    findPListFile,
};
