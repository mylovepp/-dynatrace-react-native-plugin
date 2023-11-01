"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CONTROLS_PROP_OPTIONS = exports.END_CONTROLS_PROP = exports.START_CONTROLS_PROP = exports.DEFAULT_CONTROLS_PROP = exports.FLAVOR_PROP = exports.AUTO_START_PROP = exports.END_PLIST = exports.START_PLIST = void 0;
exports.START_PLIST = '<plist><dict>';
exports.END_PLIST = '</dict></plist>';
exports.AUTO_START_PROP = '<key>DTXAutoStart</key>';
exports.FLAVOR_PROP = '<key>DTXFlavor</key>\n<string>react_native</string>';
exports.DEFAULT_CONTROLS_PROP = '<key>DTXExcludedControls</key>\n<array>\n\t<string>PickerView</string>\n</array>';
exports.START_CONTROLS_PROP = '<key>DTXExcludedControls</key>\n<array>';
exports.END_CONTROLS_PROP = '\n</array>';
exports.CONTROLS_PROP_OPTIONS = {
    Button: '\n\t<string>Button</string>',
    DatePicker: '\n\t<string>DatePicker</string>',
    Slider: '\n\t<string>Slider</string>',
    Stepper: '\n\t<string>Stepper</string>',
    Switch: '\n\t<string>Switch</string>',
    RefreshControl: '\n\t<string>RefreshControl</string>',
    ToolBar: '\n\t<string>ToolBar</string>',
    SegmentedControl: '\n\t<string>SegmentedControl</string>',
    TableView: '\n\t<string>TableView</string>',
    TabBar: '\n\t<string>TabBar</string>',
    AlertView: '\n\t<string>AlertView</string>',
    AlertAction: '\n\t<string>AlertAction</string>',
    PageView: '\n\t<string>PageView</string>',
    NavigationController: '\n\t<string>NavigationController</string>',
    CollectionView: '\n\t<string>CollectionView</string>',
    ActionSheet: '\n\t<string>ActionSheet</string>',
    PickerView: '\n\t<string>PickerView</string>',
};
