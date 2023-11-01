"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DataCollectionLevel = void 0;
const DynatraceBridge_1 = require("../DynatraceBridge");
var DataCollectionLevel;
(function (DataCollectionLevel) {
    DataCollectionLevel[DataCollectionLevel["Off"] = DynatraceBridge_1.DynatraceNative.DATA_COLLECTION_OFF] = "Off";
    DataCollectionLevel[DataCollectionLevel["Performance"] = DynatraceBridge_1.DynatraceNative.DATA_COLLECTION_PERFORMANCE] = "Performance";
    DataCollectionLevel[DataCollectionLevel["User"] = DynatraceBridge_1.DynatraceNative.DATA_COLLECTION_USERBEHAVIOR] = "User";
    DataCollectionLevel[DataCollectionLevel["UserBehavior"] = DynatraceBridge_1.DynatraceNative.DATA_COLLECTION_USERBEHAVIOR] = "UserBehavior";
})(DataCollectionLevel = exports.DataCollectionLevel || (exports.DataCollectionLevel = {}));
