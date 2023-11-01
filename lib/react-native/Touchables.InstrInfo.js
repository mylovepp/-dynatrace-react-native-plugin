"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.instrumentationInfo = void 0;
exports.instrumentationInfo = [];
exports.instrumentationInfo.push({
    old: { module: 'react-native', reference: 'TouchableHighlight' },
    new: {
        module: '@dynatrace/react-native-plugin/lib/react-native/',
        reference: 'TouchableHighlight',
        defaultImport: '@dynatrace/react-native-plugin/lib/react-native',
    },
});
exports.instrumentationInfo.push({
    old: { module: 'react-native', reference: 'TouchableOpacity' },
    new: {
        module: '@dynatrace/react-native-plugin/lib/react-native/',
        reference: 'TouchableOpacity',
        defaultImport: '@dynatrace/react-native-plugin/lib/react-native',
    },
});
exports.instrumentationInfo.push({
    old: { module: 'react-native', reference: 'TouchableNativeFeedback' },
    new: {
        module: '@dynatrace/react-native-plugin/lib/react-native/',
        reference: 'TouchableNativeFeedback',
        defaultImport: '@dynatrace/react-native-plugin/lib/react-native',
    },
});
exports.instrumentationInfo.push({
    old: { module: 'react-native', reference: 'TouchableWithoutFeedback' },
    new: {
        module: '@dynatrace/react-native-plugin/lib/react-native/',
        reference: 'TouchableWithoutFeedback',
        defaultImport: '@dynatrace/react-native-plugin/lib/react-native',
    },
});
exports.instrumentationInfo.push({
    old: { module: 'react-native', reference: 'Button' },
    new: {
        module: '@dynatrace/react-native-plugin/lib/react-native/',
        reference: 'Button',
        defaultImport: '@dynatrace/react-native-plugin/lib/react-native',
    },
});
exports.instrumentationInfo.push({
    old: { module: 'react-native', reference: 'Text' },
    new: {
        module: '@dynatrace/react-native-plugin/lib/react-native/',
        reference: 'Text',
        defaultImport: '@dynatrace/react-native-plugin/lib/react-native',
    },
});
exports.instrumentationInfo.push({
    old: { module: 'react-native', reference: 'Pressable' },
    new: {
        module: '@dynatrace/react-native-plugin/lib/react-native/',
        reference: 'Pressable',
        defaultImport: '@dynatrace/react-native-plugin/lib/react-native',
    },
});
