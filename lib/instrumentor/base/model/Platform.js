"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Platform = void 0;
const DynatraceBridge_1 = require("../DynatraceBridge");
var Platform;
(function (Platform) {
    Platform[Platform["Android"] = DynatraceBridge_1.DynatraceNative.PLATFORM_ANDROID] = "Android";
    Platform[Platform["Ios"] = DynatraceBridge_1.DynatraceNative.PLATFORM_IOS] = "Ios";
})(Platform = exports.Platform || (exports.Platform = {}));
