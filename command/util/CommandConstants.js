"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.INTERNAL_OPTIONS = exports.START_COMMANDS = void 0;
exports.START_COMMANDS = ['--port [number]', '--host [string]', '--projectRoot [path]', '--watchFolders [list]',
    '--assetPlugins [list]', '--sourceExts [list]', '--max-workers [number]', '--transformer [string]', '--reset-cache',
    '--resetCache', '--custom-log-reporter-path, --customLogReporterPath [string]', '--verbose', '--https', '--key [path]',
    '--config [string]', '--cert [path]', '--no-interactive', '-h, --help'];
exports.INTERNAL_OPTIONS = [
    {
        command: 'gradle [string]',
        description: 'The location of the root build.gradle file. We will assume that the other gradle file resides in' +
            ' /app/build.gradle. This will add the whole agent dependencies automatically for you and will update the configuration.',
    },
    {
        command: 'plist [string]',
        description: 'Tell the script where your info.plist file is. The plist file is used for updating' +
            'the configuration for the agent.',
    },
    {
        command: 'config [string]',
        description: 'If you have not got your config file in the root folder of the React Native project but somewhere else.',
    },
];
