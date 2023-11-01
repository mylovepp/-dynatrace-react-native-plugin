'use strict';
const pathNode = require('path');
const pathsConstants = require('@dynatrace/react-native-plugin/scripts/PathsConstants').default;
const fileOperation = require('@dynatrace/react-native-plugin/scripts/FileOperationHelper').default;
const originalSourceMapInfo = require('./getSourceMapInfoOrig');
const getSourceMapInfo = (module, options) => {
    const dataOrig = originalSourceMapInfo(module, options);
    try {
        if (!Boolean(options.excludeSource)) {
            const correctPath = module.path.replace(pathsConstants.getApplicationPath(), '') + '.dtx';
            dataOrig.source = fileOperation.readTextFromFileSync(pathNode.join(pathsConstants.getBuildPath(), correctPath));
        }
    }
    catch (e) {
    }
    return dataOrig;
};
module.exports = getSourceMapInfo;
