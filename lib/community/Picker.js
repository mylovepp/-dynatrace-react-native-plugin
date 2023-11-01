"use strict";
var _a, _b;
Object.defineProperty(exports, "__esModule", { value: true });
require("proxy-polyfill");
const Types_1 = require("../instrumentor/model/Types");
const PickerRN = require('@react-native-picker/picker');
const dynatraceProxy = new Proxy(PickerRN, {
    get: (target, property) => {
        if (dynatraceInstrument[property] !== undefined) {
            return dynatraceInstrument[property];
        }
        return target[property];
    },
});
const PickerModified = (_a = class Picker extends PickerRN.Picker {
    },
    _a._dtInfo = { type: Types_1.Types.Picker },
    _a);
let PickerModifiedIOS;
if (typeof PickerRN.PickerIOS === 'object') {
    PickerModifiedIOS = Object.assign({ _dtInfo: { type: Types_1.Types.Picker } }, PickerRN.PickerIOS);
}
else {
    PickerModifiedIOS = (_b = class PickerIOS extends PickerRN.PickerIOS {
        },
        _b._dtInfo = { type: Types_1.Types.Picker },
        _b);
}
const dynatraceInstrument = {
    Picker: PickerModified,
    PickerIOS: PickerModifiedIOS,
};
module.exports = dynatraceProxy;
