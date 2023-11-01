"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.instrumentationInfo = void 0;
exports.instrumentationInfo = [];
exports.instrumentationInfo.push({
    old: { module: 'react-native', reference: 'RefreshControl' },
    new: {
        module: '@dynatrace/react-native-plugin/lib/react-native/',
        reference: 'RefreshControl',
        defaultImport: '@dynatrace/react-native-plugin/lib/react-native',
    },
});
