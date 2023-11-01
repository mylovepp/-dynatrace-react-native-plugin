"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUpstreamTransformer = exports.transform = void 0;
const nodePath = require("path");
const PathsConstants_1 = require("../scripts/PathsConstants");
const config = require("../scripts/Config");
const Logger_1 = require("../scripts/Logger");
const CustomArgumentUtil_1 = require("../scripts/util/CustomArgumentUtil");
const instrumentor = require("./instrumentor/DynatraceInstrumentation");
const customArguments = (0, CustomArgumentUtil_1.readCustomArguments)();
const transform = (src, filename, options) => {
    if (typeof src === 'object') {
        ({ src, filename, options } = src);
    }
    let reactOptions;
    try {
        if (customArguments.isCustomConfigurationPathSet()) {
            reactOptions = config.readConfig(nodePath.join(PathsConstants_1.default.getApplicationPath(), customArguments.getCustomConfigurationPath()));
        }
        else {
            reactOptions = config.readConfig(nodePath.join(PathsConstants_1.default.getConfigFilePath()));
        }
        src = instrumentor.instrument(src, filename, reactOptions.react);
    }
    catch (e) {
        if (e instanceof Error) {
            if (e.message === config.ERROR_CONFIG_NOT_AVAILABLE) {
                console.log('dynatrace.config.js not found!');
            }
            else {
                console.log("Couldn't instrument file: " + filename);
                Logger_1.default.logErrorSync(e.message);
            }
        }
    }
    return (0, exports.getUpstreamTransformer)(reactOptions === null || reactOptions === void 0 ? void 0 : reactOptions.react).transform({
        src,
        filename,
        options,
    });
};
exports.transform = transform;
const getUpstreamTransformer = (reactOptions) => {
    if (reactOptions !== undefined &&
        reactOptions.upstreamTransformer !== undefined) {
        return require(reactOptions.upstreamTransformer);
    }
    else {
        return require('metro-react-native-babel-transformer/src/index');
    }
};
exports.getUpstreamTransformer = getUpstreamTransformer;
