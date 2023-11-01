"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DynatraceNative = void 0;
const react_native_1 = require("react-native");
exports.DynatraceNative = react_native_1.NativeModules.DynatraceBridge !== undefined ? react_native_1.NativeModules.DynatraceBridge : {};
