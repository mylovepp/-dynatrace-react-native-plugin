"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.instrumentationInfo = void 0;
exports.instrumentationInfo = [];
exports.instrumentationInfo.push({
    old: { module: '@react-native-picker/picker', reference: 'Picker' },
    new: {
        module: '@dynatrace/react-native-plugin/lib/community/Picker',
        reference: 'Picker',
        defaultImport: '@dynatrace/react-native-plugin/lib/community/Picker',
    },
});
exports.instrumentationInfo.push({
    old: { module: '@react-native-picker/picker', reference: 'PickerIOS' },
    new: {
        module: '@dynatrace/react-native-plugin/lib/community/Picker',
        reference: 'PickerIOS',
        defaultImport: '@dynatrace/react-native-plugin/lib/community/Picker',
    },
});
