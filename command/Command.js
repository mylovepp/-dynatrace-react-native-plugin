"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const semver_1 = require("semver");
const CommandConstants_1 = require("./util/CommandConstants");
const REACT_0_60_1 = '0.60.1';
const REACT_0_70_0 = '0.70.0';
let reactNativeVersionString;
var CommandType;
(function (CommandType) {
    CommandType[CommandType["RunIos"] = 0] = "RunIos";
    CommandType[CommandType["RunAndroid"] = 1] = "RunAndroid";
    CommandType[CommandType["Instrument"] = 2] = "Instrument";
    CommandType[CommandType["Start"] = 3] = "Start";
})(CommandType || (CommandType = {}));
const patchCommand = (name, description, command) => {
    const ex = [];
    const cm = [];
    let functionCall;
    if (command === CommandType.Start) {
        functionCall = () => {
            require('../scripts/Start');
        };
    }
    else {
        functionCall = () => {
            require('../scripts/Instrument');
        };
    }
    const returnCommands = {
        name,
        description,
        options: cm,
        examples: ex,
        func: functionCall,
    };
    returnCommands.options.push(...CommandConstants_1.INTERNAL_OPTIONS);
    returnCommands.examples.push(...getInternalExample(name));
    if (command === CommandType.RunAndroid) {
        returnCommands.options.push(...getAndroidOptions());
    }
    else if (command === CommandType.RunIos) {
        returnCommands.options.push(...getIosOptions());
        returnCommands.examples.push(...getIosExamples());
    }
    else if (command === CommandType.Start) {
        returnCommands.options.push(...buildCommandOptions(CommandConstants_1.START_COMMANDS));
    }
    return returnCommands;
};
const getExtendedCommands = () => [patchCommand('instrument-dynatrace', 'Applies the Dynatrace configuration.', CommandType.Instrument)];
const getOverriddenCommands = () => [
    patchCommand('run-android', 'Extends the original run-android. Applies the Dynatrace configuration.', CommandType.RunAndroid),
    patchCommand('run-ios', 'Extends the original run-ios. Applies the Dynatrace configuration.', CommandType.RunIos),
    patchCommand('start', 'Extends the original start. Applies the Dynatrace configuration.', CommandType.Start),
];
const getInternalExample = (name) => [
    {
        desc: `${name} with custom dynatrace.config.js path and custom port`,
        cmd: `react-native ${name} --verbose gradle=C:\\MyCustomPath\\dynatrace.config.js --port=2000`,
    },
];
const getIosExamples = () => [{
        desc: 'Run on a different simulator, e.g. iPhone 5',
        cmd: 'react-native run-ios --simulator "iPhone 5"',
    }, {
        desc: 'Pass a non-standard location of iOS directory',
        cmd: 'react-native run-ios --project-path "./app/ios"',
    }, {
        desc: "Run on a connected device, e.g. Max's iPhone",
        cmd: 'react-native run-ios --device "Max\'s iPhone"',
    }, {
        desc: 'Run on the AppleTV simulator',
        cmd: 'react-native run-ios --simulator "Apple TV"  --scheme "helloworld-tvOS"',
    }];
const getIosOptions = () => [
    {
        command: '--simulator [string]',
        description: 'Explicitly set simulator to use. Optionally include iOS version between' +
            'parenthesis at the end to match an exact version: "iPhone 6 (10.0)"',
    }, {
        command: '--configuration [string]',
        description: 'Explicitly set the scheme configuration to use',
    }, {
        command: '--scheme [string]',
        description: 'Explicitly set Xcode scheme to use',
    }, {
        command: '--project-path [string]',
        description: 'Path relative to project root where the Xcode project ' + '(.xcodeproj) lives.',
    }, {
        command: '--device [string]',
        description: 'Explicitly set device to use by name.  The value is not required if you have a single device connected.',
    }, {
        command: '--udid [string]',
        description: 'Explicitly set device to use by udid',
    }, {
        command: '--no-packager',
        description: 'Do not launch packager while building',
    }, {
        command: '--verbose',
        description: 'Do not use xcpretty even if installed',
    }, {
        command: '--port [number]',
        description: 'Port of the webserver',
    }, {
        command: '--terminal [string]',
        description: 'Launches the Metro Bundler in a new window using the specified terminal path.',
    },
];
const getAndroidOptions = () => [
    {
        command: '--root [string]',
        description: 'Override the root directory for the android build (which contains the android directory)',
    }, {
        command: '--variant [string]',
        description: "Specify your app's build variant",
    }, {
        command: '--appFolder [string]',
        description: 'Specify a different application folder name for the android source. If not, we assume is "app"',
    }, {
        command: '--appId [string]',
        description: 'Specify an applicationId to launch after build.',
    }, {
        command: '--appIdSuffix [string]',
        description: 'Specify an applicationIdSuffix to launch after build.',
    }, {
        command: '--main-activity [string]',
        description: 'Name of the activity to start',
    }, {
        command: '--deviceId [string]',
        description: 'builds your app and starts it on a specific device/simulator with the ' +
            'given device id (listed by running "adb devices" on the command line).',
    }, {
        command: '--no-packager',
        description: 'Do not launch packager while building',
    }, {
        command: '--port [number]',
        description: 'Port of the webserver',
    }, {
        command: '--terminal [string]',
        description: 'Launches the Metro Bundler in a new window using the specified terminal path.',
    }, {
        command: '--tasks [list]',
        description: 'Run custom Gradle tasks. By default it\'s "installDebug"',
    }, {
        command: '--no-jetifier',
        description: 'Do not run "jetifier" – the AndroidX transition tool. By default it runs before Gradle' +
            ' to ease working with libraries that don\'t support AndroidX yet. See more at: https://www.npmjs.com/package/jetifier.',
    },
];
const buildCommandOptions = (commands) => {
    const options = [];
    commands.forEach((command) => {
        options.push({ command, description: 'EMPTY' });
    });
    return options;
};
try {
    reactNativeVersionString = require('react-native/package.json').version;
}
catch (e) {
    reactNativeVersionString = null;
}
if (reactNativeVersionString === null) {
    module.exports = [];
}
else if ((0, semver_1.gte)(reactNativeVersionString, REACT_0_70_0)) {
    module.exports = getExtendedCommands();
}
else if ((0, semver_1.gte)(reactNativeVersionString, REACT_0_60_1)) {
    module.exports = getOverriddenCommands();
}
else {
    module.exports = getExtendedCommands();
}
