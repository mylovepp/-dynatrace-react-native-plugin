"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DynatraceRootAction = void 0;
const StringUtils_1 = require("./util/StringUtils");
const DynatraceBridge_1 = require("./DynatraceBridge");
const Logger_1 = require("./Logger");
const DynatraceAction_1 = require("./DynatraceAction");
const NullAction_1 = require("./NullAction");
const DynatraceInternal_1 = require("./DynatraceInternal");
const ConfigurationHandler_1 = require("./configuration/ConfigurationHandler");
class DynatraceRootAction extends DynatraceAction_1.DynatraceAction {
    constructor(key, name) {
        super(key, name, true);
    }
    enterAction(name, platform) {
        if (this.closed) {
            Logger_1.Logger.logDebug(`DynatraceRootAction enterAction(${name}): Action was closed already!`);
            return new NullAction_1.NullAction();
        }
        let childKey;
        if (ConfigurationHandler_1.ConfigurationHandler.getBundleName() != null) {
            childKey = ConfigurationHandler_1.ConfigurationHandler.getBundleName() + '_' + DynatraceInternal_1.DynatraceInternal.getCounter();
        }
        else {
            childKey = 'DEFAULT_' + DynatraceInternal_1.DynatraceInternal.getCounter();
        }
        if (!StringUtils_1.StringUtils.isStringNullEmptyOrUndefined(name)) {
            Logger_1.Logger.logDebug(`DynatraceRootAction enterAction(${name})`);
            DynatraceBridge_1.DynatraceNative.enterManualActionWithParent(name, childKey, this.key, platform);
            return new DynatraceAction_1.DynatraceAction(childKey, name, true);
        }
        else {
            Logger_1.Logger.logDebug('Action Name was empty or null! Action will have no effect.');
            return new NullAction_1.NullAction();
        }
    }
}
exports.DynatraceRootAction = DynatraceRootAction;
