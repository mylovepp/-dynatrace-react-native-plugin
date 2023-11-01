"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.instrumentationInfo = void 0;
exports.instrumentationInfo = [];
exports.instrumentationInfo.push({
    old: { module: 'react-native-gesture-handler', reference: 'TouchableHighlight' },
    new: {
        module: '@dynatrace/react-native-plugin/lib/community/gesture-handler/',
        reference: 'TouchableHighlight',
        defaultImport: '@dynatrace/react-native-plugin/lib/gesture-handler',
    },
});
exports.instrumentationInfo.push({
    old: { module: 'react-native-gesture-handler', reference: 'TouchableOpacity' },
    new: {
        module: '@dynatrace/react-native-plugin/lib/community/gesture-handler/',
        reference: 'TouchableOpacity',
        defaultImport: '@dynatrace/react-native-plugin/lib/gesture-handler',
    },
});
exports.instrumentationInfo.push({
    old: { module: 'react-native-gesture-handler', reference: 'TouchableNativeFeedback' },
    new: {
        module: '@dynatrace/react-native-plugin/lib/community/gesture-handler/',
        reference: 'TouchableNativeFeedback',
        defaultImport: '@dynatrace/react-native-plugin/lib/gesture-handler',
    },
});
exports.instrumentationInfo.push({
    old: { module: 'react-native-gesture-handler', reference: 'TouchableWithoutFeedback' },
    new: {
        module: '@dynatrace/react-native-plugin/lib/community/gesture-handler/',
        reference: 'TouchableWithoutFeedback',
        defaultImport: '@dynatrace/react-native-plugin/lib/gesture-handler',
    },
});
exports.instrumentationInfo.push({
    old: { module: 'react-native-gesture-handler', reference: 'RectButton' },
    new: {
        module: '@dynatrace/react-native-plugin/lib/community/gesture-handler/',
        reference: 'RectButton',
        defaultImport: '@dynatrace/react-native-plugin/lib/gesture-handler',
    },
});
