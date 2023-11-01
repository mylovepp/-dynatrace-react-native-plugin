"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NullRootAction = void 0;
const NullAction_1 = require("./NullAction");
class NullRootAction extends NullAction_1.NullAction {
    enterAction(name, platform) {
        return new NullAction_1.NullAction();
    }
}
exports.NullRootAction = NullRootAction;
