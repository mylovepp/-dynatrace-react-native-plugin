[![N|Solid](https://assets.dynatrace.com/content/dam/dynatrace/misc/dynatrace_web.png)](https://dynatrace.com)
# Dynatrace React Native Plugin
The Dynatrace React Native plugin helps auto-instrument your React Native app with Dynatrace OneAgent for Android and iOS and also provides an API to add manual instrumentation.

If you want to start using this plugin and are not a Dynatrace customer yet, head to [dynatrace.com](https://dynatrace.com) and sign up for a free trial. For an intro you can also check out [our announcement blog post](https://www.dynatrace.com/news/blog/enhance-user-experience-with-full-insight-into-your-react-native-apps/).

## Supported features
* Auto-instrumentation using OneAgent for Android and iOS
  * User actions for application start and native controls
  * Web requests
  * Crashes
* React-native Auto-instrumentation
  * User actions for onPress and onLongPress (Touchables, Buttons, Pickers, RefreshControl, Pressable)
  * User actions for class and functional components (lifecycle events such as render(), didMount() and didUpdate())
  * Reporting React Native errors
* Manual instrumentation
  * Typescript bindings to add manual instrumentation

## Requirements
* React v16.8 or newer
* React Native v0.59 or newer
* For Android users:
  * SDK version 21+
  * Gradle version 6.1.1+ ([How to update?](#updating-to-gradle-6))
  * Android Gradle plugin version 4.0+
  * Java 11
* For iOS users: Minimum iOS 11

## Agent Versions
This agent versions are configured in this plugin:

* Android Agent: 8.277.1.1003
* iOS Agent: 8.277.1.1004

## Quick Setup

1. [Install plugin](#1-install-the-plugin)
2. [Register Dynatrace transformer](#2-register-the-dynatrace-transformer)
3. [Setup configuration](#3-setup-dynatraceconfigjs)
4. [Update Babel Configuration](#4-update-babel-configuration)
5. [Build and run your app](#4-build-and-run-your-app)

## Advanced topics
* [Manual OneAgent Startup](#manual-oneagent-startup)
* [Manual instrumentation](#manual-instrumentation)
  * [Plugin Startup](#plugin-startup)
  * [Monitor a Component](#monitor-a-component)
  * [Create Custom Action](#create-custom-actions)
  * [Cancel Actions](#cancel-actions)
  * [Manual Web Request Tagging](#manual-web-request-tagging)
  * [Report Values](#report-values)
  * [Report Stacktrace](#report-an-error-stacktrace)
  * [Identify User](#identify-a-user)
  * [End Session](#end-the-current-user-session)
  * [Crash Reporting](#manually-report-a-crash)
  * [User Privacy Options](#user-privacy-options)
  * [Report GPS Position](#report-gps-location)
  * [Business events capturing](#business-event-capturing)
  * [Platform independent reporting](#platform-independent-reporting)
  * [Set beacon headers](#setting-beacon-headers)
  * [Exclude Individual JSX Elements](#exclude-individual-jsx-elements)
* [NPX Commands](#npx-commands)
  * [npx instrumentDynatrace](#npx-instrumentdynatrace)
  * [npx configDynatrace](#npx-configdynatrace)
* [Customizing paths for configuration](#customizing-paths-for-configuration)
* [Manual adding iOS Agent to project](#manually-adding-ios-oneagent-to-a-project)
* [Setup for tvOS](#setup-for-tvos)
* [Configuration structure](#structure-of-the-dynatracejs-file)
  * [Manual Startup Counterparts](#manual-startup-counterparts)
  * [Lifecycle modes](#lifecycle)
  * [Define build stages](#define-build-stages-in-dynatraceconfigjs)
  * [User Opt In Mode](#user-opt-in-mode)
  * [Agent debug logs](#native-oneagent-debug-logs)
* [How does Dynatrace determine the user action name?](#how-does-dynatrace-determine-the-user-action-name)
  * [Using dtActionName](#using-dtactionname-to-change-the-name-of-the-action)
* [React Automatic Runtime](#react-automatic-runtime)
* [Using a second transformer besides the dynatrace transformer](#using-a-second-transformer-besides-the-dynatrace-transformer)
* [Upgrading project to Gradle 6](#updating-to-gradle-6)
* [Maven Central in top-level gradle file](#maven-central-in-top-level-gradle-file)
* [Configuration of standalone React Native project](#configuration-of-standalone-react-native-project)

## Troubleshooting
* [Documentation](#dynatrace-documentation)
* [Known issues](#troubleshooting-and-applicable-restrictions)
* [Report bug / Get support](#report-a-bug-or-open-a-support-case)
* [Changelog](#changelog)
<br/><br/>

# Quick Setup

> **Note**: If you are upgrading to React Native v0.70 (or newer) or using the @react-native-community/cli 9.x+ version, be aware that our automated script running before every start/run-android/run-ios command is no longer working. When your *dynatrace.config.js* changed be sure to execute `npx instrumentDynatrace` beforehand. 

## 1. Install the plugin
1. Install the plugin by calling:
    -  React Native v0.60 or newer : `npm install @dynatrace/react-native-plugin` 
    -  React Native v0.59.x : `react-native install @dynatrace/react-native-plugin`. 
2. **iOS only :** If you use pods, you need to go into your `ios` directory and execute `pod install` to install the new Dynatrace dependency to your xCode project. 
  
### Troubleshooting
- Expo: Make sure you actually have platform folders like `android/` and/or `ios/` so the plugin can do the configuration correctly. Furthermore you need to trigger the configuration manually as the plugin is only automatically working with the React Native CLI. This means every time the configuration changes you need to call [`npx instrumentDynatrace`](#npx-instrumentdynatrace).
- Standalone Project: If you are using React Native standalone and embed it in your native project have a look [here](#configuration-of-standalone-react-native-project).
- If for some reason (e.g. seperate native projects) `react-native link` doesn't work as expected, [manually add the iOS agent to your project](#manually-adding-ios-oneagent-to-a-project).

## 2. Register the Dynatrace transformer

Depending on your React Native version, you will need to use a different way to register the transformer. If you don't know the version, enter `react-native --version` in your terminal.

The following configuration must be added. If you already have a babel transformer (babelTransformerPath) in place, you need to [use the upstreamTransformer property in dynatrace.config.js](#using-a-second-transformer-besides-the-dynatrace-transformer) to use a transformer besides our dynatrace transformer. 

In your project's root directory, create or extend `metro.config.js` so that it contains the following configuration properties `transformer.babelTransformerPath` and `reporter`:

#### For React Native v0.72.1 or newer

```js
const {getDefaultConfig, mergeConfig} = require('@react-native/metro-config');
const defaultConfig = getDefaultConfig(__dirname);

/**
 * Metro configuration
 * https://facebook.github.io/metro/docs/configuration
 *
 * @type {import('metro-config').MetroConfig}
 */
const config = {
  transformer: {
    babelTransformerPath: require.resolve(
      '@dynatrace/react-native-plugin/lib/dynatrace-transformer',
    ),
  },
  reporter: require('@dynatrace/react-native-plugin/lib/dynatrace-reporter'),
};

module.exports = mergeConfig(defaultConfig, config);
```

#### For React Native v0.59 or newer

```js
module.exports = {
    transformer: {
      babelTransformerPath: require.resolve(
        '@dynatrace/react-native-plugin/lib/dynatrace-transformer'
      )
    },
    reporter: require('@dynatrace/react-native-plugin/lib/dynatrace-reporter'),
};
```

## 3. Setup dynatrace.config.js

> **Note**: If you are upgrading from a previous version of this plugin, you'll notice that the file format has changed. Your old configuration is still available in `dynatrace.config` and you have to copy your values to the new `dynatrace.config.js`.

Define a mobile app in Dynatrace and open the Mobile app instrumentation settings. In the settings you will see a `dynatrace.config.js` file which can be downloaded for React Native. Download and copy this file into the root folder of your application. If you are not sure you can always use `npx configDynatrace` to create a default configuration file. 

> **Note**: Define the components that you want to see lifecycle instrumented ([example](#lifecycle)). This is important as you will only see Application startup and Touches out of the box.

For more details about the configuration, see [Advanced topics](#structure-of-the-dynatracejs-file).

## 4. Update Babel Configuration

Depending on your version of Metro or Expo (if used), your babel configuration `babel.config.js` will need to be updated.

The changes have to be done in the following cases:

- metro v0.72.0 or newer: https://github.com/facebook/metro/releases/tag/v0.72.0
- expo v44.0.0 or newer or babel-preset-expo v9.0.0 or newer: https://github.com/expo/expo/blob/main/packages/babel-preset-expo/CHANGELOG.md#900--2021-12-03

The required changes for the versions above can be found [here](#react-automatic-runtime).

## 5. Build and run your app

1. Execute [`npx instrumentDynatrace`](#npx-instrumentdynatrace) or `react-native instrument-dynatrace` in the root of your React Native project. This will configure both Android and iOS projects with the settings from `dynatrace.config.js`. You can use the same [custom arguments](#customizing-paths-for-configuration) as mentioned above.

2. Use `react-native run-android` or `react-native run-ios` to rebuild and run your app. Specify custom paths via [custom arguments.](#customizing-paths-for-configuration).

3. **Attention:** Whenever you change your configuration in dynatrace.config.js please use `react-native start --reset-cache` option. Metro caches all files and a configuration change might lead to a different situation. Not resetting the cache might result in an mixture of old and new configuration.

# Advanced topics

### Manual OneAgent startup

If you can't do a automated startup through the `dynatrace.config.js`, you can always perform a manual startup and decide values such as `beaconUrl` and `applicationId` at runtime. 

**Note**: An automated startup usually provides you with a lifecycle application start-up event. A manual startup on the other hand occurs later, thereby causing you to miss everything, including this application startup event, until the startup occurs.

A manual startup requires the following two steps:

1. Deactivate the automated startup in `dynatrace.config.js`: 

```js
module.exports = {
    react: {
        autoStart: false,
        ...
    },
    android: {
        config: `
        dynatrace {
            configurations {
                defaultConfig {
                    autoStart.enabled false
                }
            }
        }
        `
    },
    ios: {
        config: `
        <key>DTXAutoStart</key>
        <false/>
        `
    }
}
```

2. Make the start-up call with at least `beaconUrl` and `applicationId`:

Example of a startup call:

```js
import { Dynatrace, ConfigurationBuilder } from '@dynatrace/react-native-plugin';

Dynatrace.start(new ConfigurationBuilder("beaconUrl", "applicationId").buildConfiguration());
```

For more details see the section about [startup API](#plugin-startup).

**Note**: If you don't deactivate the automated startup with the `dynatrace.config.js` file, the `beaconUrl` and `applicationId` values have no impact and are thrown away.

## Manual instrumentation

To use the API of the React Native plugin, import the API:

```js
import { Dynatrace, Platform } from '@dynatrace/react-native-plugin';
```

### Plugin startup

The manual startup of the plugin is triggered via the `start(configuration: IConfiguration)` method. If you configured `dynatrace.config.js` for manual startup then the plugin doesn't send any data when not calling this function. Besides the application id and the beacon URL, there are several optional configuration parameters, which are shown in the table below. 

```js
const configurationBuilder = new ConfigurationBuilder("beaconUrl", "applicationId");

configurationBuilder.withCrashReporting(true)
  .withLogLevel(LogLevel.Info)
  .withLifecycleUpdate(false)
  .withUserOptIn(false)
  .withActionNamePrivacy(false)
  .withBundleName(undefined);

configurationBuilder.buildConfiguration();
```

**Info**: The values used in the function calls for the parameters are also their default value.

| Property name    | Type   | Default     | Description                                       |
|------------------|--------|-------------|---------------------------------------------------|
|beaconUrl         |string  |undefined         |Identifies your environment within Dynatrace. This property is mandatory for [manual startup](#manual-oneagent-startup). OneAgent issues an error when the key isn't present.|
|applicationId     |string  |undefined         |Identifies your mobile app. This property is mandatory for [manual startup](#manual-oneagent-startup). OneAgent issues an error when the key isn't present.|
|reportCrash       |boolean |true         |Reports crashes.                  |
|logLevel          |LogLevel|LogLevel.Info|Allows you to choose between `LogLevel.Info` and `LogLevel.Debug`. Debug returns more logs. This is especially important when something is not functioning correctly.|
|lifecycleUpdate   |boolean |false        |Decide if you want to see update cycles on lifecycle actions as well. This is per default false as it creates a lot more actions.|
|userOptIn        |boolean  |false        |Activates the privacy mode when set to `true`. User consent must be queried and set. The privacy settings for [data collection](#data-collection) and [crash reporting](#crash-reporting) can be changed via  OneAgent SDK for Mobile as described under Data privacy. The default value is `false`.|
|actionNamePrivacy|boolean|false|Activates a privacy mode especially for Touchables and Buttons. Setting this option to true means that a name for the control will no longer be shown, e.g. "Touch on Button". When setting a dtActionName onto the component this setting will be ignored. 
|bundleName|string|undefined|Should be used only if you have a multiple bundle setup where you load several .bundle files within your React Native application. Enter the name of your bundle. This should be unique in comparison to your other bundle names. This will ensure that actions coming from different bundles will not interfere with each other.

**Attention:** 
* Keep in mind that configuration within the `dynatrace.config.js` file is the basis, even for manual startup. When we look at the lifecycleUpdate property: Per default if not used, it is false. If enabled (set to true) in `dynatrace.config.js` file, this will be also true if manual startup is used. You can still override this behavior by calling `ConfigurationBuilder.withLifecycleUpdate(false)`.
* Please use those parameters only when doing a manual startup. If you want to do an automated startup, please configure the properties via the [auto startup configuration](#manual-startup-counterparts). You will find a list which explains all the counterparts for the available options here.

### Monitor a Component

A component can be either monitored automatically or manually. The auto instrumentation is handled via the dynatrace.config.js file. If you want to manually instrument a component you can use the API call `withMonitoring`.

* Example with Functional Component:

```js
export function MyFunctionalComponent(){
  ...
}

Dynatrace.withMonitoring(MyFunctionalComponent, "MyFunctionalComponent");
```

The String "MyFunctionalComponent" is optional as the name of the component can be retrieved through [different properties](#how-does-dynatrace-determine-the-user-action-name).

Combining manual and auto instrumentation is not creating a problem as both are executing the same thing. Manual instrumentation would only override the content of auto instrumentation happening through the transformer.

### Create custom actions

There are two options to create an action. Either using `enterAutoAction` (the previous `enterAction`) or `enterManualAction`:

* `enterAutoAction` - Creates an Action which will be automatically handled by the plugin (This is the type of action which is internally used by the plugin when monitoring components and touchables). This means that the plugin decides about the hierachy of this action. If there is no open action, the following action will be a root action. All other actions created by this method, while a root action is open, will be automatically inserted as a child action. Furthermore the plugin will automatically link webrequest (if they are not tagged manually) to the open root action.

```js
let myAction = Dynatrace.enterAutoAction("MyButton tapped");
//Perform the action and whatever else is needed.
myAction.leaveAction();
```

* `enterManualAction` - Creates an Action which will NOT be handled by the plugin. This means that you have full control about the hierachy of your actions. This function will create a root action for you, which has the ability to create child actions via `enterAction`. Be aware, because of the full manual approach the plugin will not link webrequest automatically. Webrequest have to be manually tagged by using the tag provided by the action via `getRequestTag`.

```js
let myAction = Dynatrace.enterManualAction("MyButton tapped");
//Perform the action and whatever else is needed.
myAction.leaveAction();
```

To create a custom action named `"MyButton tapped"`, use the following code. The *leaveAction* closes the action again. To report values for this action before closing, see [Report Values](#report-values).

```js
let myAction = Dynatrace.enterAutoAction("MyButton tapped");
//Perform the action and whatever else is needed.
myAction.leaveAction();
```

### Create custom sub actions

You can create a single custom action as well as sub actions. The `MyButton Sub Action` is automatically put under the `MyButton tapped`. As long as `MyButton tapped` is open, it gathers all the web requests.

```js
let myAction = Dynatrace.enterManualAction("MyButton tapped");
let mySubAction = myAction.enterAction("MyButton Sub Action");
//Perform the action and whatever else is needed.
mySubAction.leaveAction();
myAction.leaveAction();
```

### Cancel actions

Actions can be canceled. That means they will not be sent and discarded fully. This also means that any values and sub actions attached to the action will be removed. 

```js
let myAction = Dynatrace.enterAutoAction("MyButton tapped");
// Action will be canceled
myAction.cancel();

// Has no impact as the action is already canceled
myAction.leaveAction();
```

### Manual Web Request Tagging

You can manually tag and time your web requests. With the API shown below, you are able to manually capture the web requests of an http framework/library. 

**Note:** 
Using this API will force the request to be added to the action that is manually created. 

```js
let url = 'https://www.dynatrace.com';
// You can also use enterAutoAction if desired
let action = Dynatrace.enterManualAction("Manual Web Request");
let tag = await action.getRequestTag(url);
let timing = new DynatraceWebRequestTiming(url, tag);

try {      
  timing.startWebRequestTiming();
  let axiosResponse = await axios.get(url);
  timing.stopWebRequestTiming(axiosResponse.status, axiosResponse.data);
} catch (error) {
  timing.stopWebRequestTiming(-1, error);
} finally {
  action.leaveAction();
}
```

### Report values

For any open action you can report certain values. The following API is available for action:

```ts
reportDoubleValue(valueName: string, value: number, platform?: Platform): void
reportError(errorName: string, errorCode: number, platform?: Platform): void
reportEvent(eventName: string, platform?: Platform): void
reportIntValue(valueName: string, value: number, platform?: Platform): void
reportStringValue(valueName: string, value: string, platform?: Platform): void
```

To report a string value, use the following:

```js
let myAction = Dynatrace.enterAutoAction("MyButton tapped");
myAction.reportStringValue("ValueName", "ImportantValue");
myAction.leaveAction();
```

If you look at the API calls, you will see the optional parameter `platform?: Platform`. This parameter offers the possibility to report values only for a specific platform. to know more, see [Platform independent reporting](#platform-independent-reporting).


### Report an error stacktrace

To manually report an error stacktrace, use the following API call:

```ts
reportErrorStacktrace(errorName: string, errorValue: string, reason: string, stacktrace: string, platform?: Platform): void;
```

**Note:**
The previous API without *errorValue* is deprecated and will be removed in the future. Please use the new API with errorValue if possible.

### Identify a user

You can identify a user and tag the current session with a name by making the following call:

```js
Dynatrace.identifyUser("User XY");
```

### End the current user session

To end the current user session, use the following API call:

```js
Dynatrace.endSession();
```

**Note:** The user tagging will not carry over to the new user session that is started after using this API. If user tagging is desired in the new user session, please ensure that you call the [user tagging](#identify-a-user) API.

### Manually report a crash

You can manually report a crash via the following API call:

```ts
reportCrash(crashName: string, reason: string, stacktrace: string, platform?: Platform): void;
reportCrashWithException(crashName: string, crash: Error, platform?: Platform): void;
```

> **Note**: If you use this API call to report a crash manually, it will force the session to be completed. Any new actions that are captured afterwards will be added into a new session.

*reportCrashWithException* will use the crashName as name for the crash. It will only report the crash if there is also a stacktrace available. 

### User Privacy Options

The privacy API methods allow you to dynamically change the data-collection level based on the individual preferences of your end users. Each end user can select from three data-privacy levels:

```ts
export enum DataCollectionLevel {
    Off, Performance, UserBehavior
}
```

1. Off: Native Agent doesn't capture any monitoring data.
2. Performance: Native Agent captures only anonymous performance data. Monitoring data that can be used to identify individual users, such as user tags and custom values, aren't captured.
3. UserBehavior: Native Agent captures both performance and user data. In this mode, Native Agent recognizes and reports users who re-visit in future sessions.

Crash reporting is enabled by default. The Mobile agent captures all unhandled exceptions/errors and immediately sends the crash report to the server. With this API you can activate or deactivate crash reporting. To change this behaviour via the API, enable/activate [`userOptIn`](#user-opt-in-mode) and set the User Privacy Options.

The API to get and set the current privacy level looks like this:

```ts
async getUserPrivacyOptions(platform?: Platform): Promise<UserPrivacyOptions>;
applyUserPrivacyOptions(userPrivacyOptions: UserPrivacyOptions, platform?: Platform): void;
```

To check the current privacy options that are set:

```ts
let privacyOptions = await Dynatrace.getUserPrivacyOptions();
```

If you want to create a new `UserPrivacyOptions` object:

```ts
let privacyConfig = new UserPrivacyOptions(DataCollectionLevel.UserBehavior, true);
```

To set new values to this object:

```ts
privacyConfig.crashReportingOptedIn = false;
privacyConfig.dataCollectionLevel = DataCollectionLevel.Performance;
```

The properties that are used to set the privacy options can also be used to fetch the options:

```ts
let level = privacyConfig.dataCollectionLevel;
let crashReporting = privacyConfig.crashReportingOptedIn;
```

To apply the values that were set on the object:

```ts
Dynatrace.applyUserPrivacyOptions(privacyConfig);
```

### Report GPS Location

You can report latitude and longitude and specify an optional platform. 

```ts
setGPSLocation(latitude: number, longitude: number, platform?: Platform): void
```

### Platform independent reporting

You probably noticed that each method has an additional *optional* parameter named `platform` of type `Platform`. You can use this to only trigger manual instrumentation for a specific OS. The available values are: `Platform.Ios` and `Platform.Android`. Default is that it will work on any platform. Otherwise it is passed *only* to the relevant OS. For example:
 * Passing to **iOS** only:
```js
let myAction = Dynatrace.enterAutoAction("MyButton tapped", Platform.Ios);
//Perform the action and whatever else is needed.
myAction.leaveAction("ios"); 
```
 
 * Passing to **Android** only:
```js
let myAction = Dynatrace.enterAutoAction("MyButton tapped", Platform.Android);
//Perform the action and whatever else is needed.
myAction.leaveAction("android"); 
```
 
 * Passing to **both**:
```js
let myAction = Dynatrace.enterAutoAction("MyButton tapped");
//Perform the action and whatever else is needed.
myAction.leaveAction(); 
```

### Business events capturing

With `sendBizEvent`, you can report business events. These events are standalone events, as OneAgent sends them detached from user actions or user sessions.

For more information on business events, see [dynatrace documentation](https://www.dynatrace.com/support/help/how-to-use-dynatrace/business-analytics/ba-events-capturing#expand--example-configuration-files-for-rum--2).

```dart
Dynatrace.sendBizEvent("com.easytravel.funnel.booking-finished", {
  "event.name" : "Confirmed Booking",
  "screen": "booking-confirmation",
  "product": "Danube Anna Hotel",
  "amount": 358.35,
  "currency": "USD",
  "reviewScore": 4.8,
  "arrivalDate": "2022-11-05",
  "departureDate": "2022-11-15",
  "journeyDuration": 10,
  "adultTravelers": 2,
  "childrenTravelers": 0
});
```

### Setting beacon headers

This allows you to put a set of http headers on every agent http request (i.e. Authorization header etc.). It will also triggers the agent to reconnect to the beacon endpoint with the new headers. 

**Note:** To clear the previously set headers, call the method without the headers parameter or with a null value for the headers parameter.

```js
setBeaconHeaders(headers?: Map<string, string> | null, platform?: Platform): void;
```

### Exclude Individual JSX Elements

If you want to instrument a functional component or class component but want to exclude a certain button or element, you can do this via the `dtActionIgnore` property. Example:

```js
function TouchableHighlightScreen() {
    return (
        <View>
            <TouchableHighlight onPress={onPress}>
                <Text>TouchableHighlight that will be monitored</Text>
            </TouchableHighlight>
            <TouchableHighlight onPress={onPress} dtActionIgnore="true">
                <Text>TouchableHighlight that will be ignored</Text>
            </TouchableHighlight>
        </View>
    );
}

function onPress() {
    Logger.logDebug("TouchableHighlight Pressed!");
}

export default TouchableHighlightScreen;
```

This example shows two *TouchableHighlight*, which will fire the *onPress()* function when pressed. The property `dtActionIgnore="true"` will prevent the monitoring of one of them. This means that the onPress will still be executed but we will no longer create a user action which is wrapping the button click. 

If you want to set this property and use typescript you can use the following workaround: 

```ts
<TouchableHighlight {...{ "dtActionIgnore": "true" }}><Text>TouchableHighlight that will be ignored</Text></TouchableHighlight>
```
## NPX Commands

The following npx commands are available for the plugin:

* npx instrumentDynatrace - Is triggering the configuration process and will insert the configuration into the Android and iOS application. This is mandatory and should usually happen automatically when doing `react-native run-android` or `react-native run-ios` command.
* npx configDynatrace - Is checking the current configuration and is creating a default configuration if there is none.

### npx instrumentDynatrace

```
npx instrumentDynatrace [optional: config=... gradle=... plist=...]
```

* `gradle=C:\MyReactAndroidProject\build.gradle`: The location of the root build.gradle file. We will assume that the other gradle file resides in `/app/build.gradle`. This will add the whole agent dependencies automatically for you and will update the configuration.
* `plist=C:\MyReactIOSProject\projectName\info.plist`: Tell the script where your info.plist file is. The plist file is used for updating the configuration for the agent. 
* `config=C:\SpecialFolderForDynatrace\dynatrace.config.js`: If you have not got your config file in the root folder of the React Native project but somewhere else.

### npx configDynatrace

```
npx configDynatrace [optional: config=...]
```

* `config=C:\SpecialFolderForDynatrace\dynatrace.config.js`: If you have not got your config file in the root folder of the React Native project but somewhere else.


## Customizing paths for configuration

> **Note:** This feature works directly on run-android, run-ios or start command only for React Native v0.60.1 or newer until v0.69.x.

> **MacOS Users:** This feature is not working correctly on MacOS. Arguments are not passed between run-ios and starting the webserver. If you still want to use custom arguments you need to start the webserver first with custom arguments and later on executing run-ios, which will then no longer create a webserver as it is already running in background. 

Our scripts assumes that the usual React Native project structure is given. The following arguments can be specified for our instrumentation script if the project structure is different.

* `gradle=C:\MyReactAndroidProject\build.gradle`: The location of the root build.gradle file. We will assume that the other gradle file resides in `/app/build.gradle`. This will add the whole agent dependencies automatically for you and will update the configuration.
* `plist=C:\MyReactIOSProject\projectName\info.plist`: Tell the script where your info.plist file is. The plist file is used for updating the configuration for the agent. 
* `config=C:\SpecialFolderForDynatrace\dynatrace.config.js`: If you have not got your config file in the root folder of the React Native project but somewhere else.

Examples:

 * React Native v0.60.1 or newer:
```
npx react-native run-android config=C:\SpecialFolderForDynatrace\dynatrace.config.js --port=2000
```

* React Native v0.70.0 or newer:
```
npx instrumentDynatrace config=C:\SpecialFolderForDynatrace\dynatrace.config.js
npx react-native run-android --port=2000
```

> **Note:** that custom arguments must not be prefixed with -- !

## Manually adding iOS OneAgent to a project

Adding the iOS agent manually depends on the availabilty of support for CocoaPods. 

### With CocoaPods support
Insert the following in your Podfile:

```
pod 'react-native-dynatrace', :path => '../node_modules/@dynatrace/react-native-plugin'
```

### Without CocoaPods support
1. Open your project in Xcode.
2. Run open `node_modules/@dynatrace/react-native-plugin/ios`.
3. Drag `DynatraceRNBridge.xcodeproj` into your Libraries group.
4. Select your main project in the navigator to bring up settings.
5. Under Build Phases expand the Link Binary With Libraries header.
6. Scroll down and click + to add a library.
7. Find and add `libRNDynatrace.a` under the Workspace group.
8. ⌘+B

## Setup for tvOS

> **Note**: Testing has only been done using the [react-native-tvos](https://www.npmjs.com/package/react-native-tvos) package and currently is the only package supported with our plugin.

To allow our plugin to work with tvOS, please follow the below steps:

Before installing the plugin, add the following to your `package.json`:

```js
"overrides": {
	"@react-native-picker/picker": {
		"react-native": "<insert-version-here>"
	},
	"@dynatrace/react-native-plugin": {
		"react-native": "<insert-version-here>"
	}
},
```

If you are using the following `"react-native": "npm:react-native-tvos@0.69.8-2"`, use the below snippet:

```js
"overrides": {
	"@react-native-picker/picker": {
		"react-native": "0.69.8-2"
	},
	"@dynatrace/react-native-plugin": {
		"react-native": "0.69.8-2"
	}
},
```

Once the above is completed, follow the steps from the [install plugin](#1-install-the-plugin) section.

When you are ready to build, make sure that you use the `plist=` parameter when running the `npx instrumentDynatrace` or `npx react-native run-ios` commands for the tvOS scheme.
Examples:

Using React Native v0.69.x or lower and  @react-native-community/cli v8.x or lower:

```js
npx react-native run-ios --simulator "Apple TV" --scheme "ApplicationName-tvOS" plist=/path/to/application/ios/ApplicationName-tvOS/Info.plist
```

Using React Native v0.70 or higher or @react-native-community/cli v9.x or higher:

```js
// Update the Info.plist with the properties from the dynatrace.config.js file
npx instrumentDynatrace plist=/path/to/application/ios/ApplicationName-tvOS/Info.plist

// Build your tvOS application
npx react-native run-ios --simulator "Apple TV" --scheme "ApplicationName-tvOS"
```

For more information regarding the differences in the react native versions, please see the `Note` from the [quick setup](#quick-setup-1) section.



## Structure of the `dynatrace.js` file
The configuration is structured in the following way:

```js
module.exports = {
    react : {
      // Configuration for React Native instrumentation
    },
    android : {
      // Configuration for Android auto instrumentation
    },
    ios : {
      // Configuration for iOS auto instrumentation
    }
}
```

### Manual Startup Counterparts

Here is a list of all the counterparts for the options that can be used with a manual startup. Below the counterparts table you will find an example configuration block for both Android and iOS.

| Property Name | Default | Android | iOS | React |
|---------------|------|---------|-------------|-------------|
|beaconUrl|undefined|autoStart.beaconUrl|DTXBeaconURL| - |
|applicationId|undefined|autoStart.applicationId|DTXApplicationId| - |
|reportCrash|true|crashReporting|DTXCrashReporting| - |
|logLevel|LogLevel.Info|debug.agentLogging|DTXLogLevel| debug |
|lifecycleUpdate|false| - | - | lifecycle.includeUpdate |
|userOptIn|false|userOptIn|DTXUserOptIn| - |
|actionNamePrivacy|false|-|-|input.actionNamePrivacy
|bundleName|undefined|-|-|bundleName

### React block

The `react` configuration block contains all settings regarding the react instrumentation. The following options are available:

#### Input

```js
react : {
  input : {
    instrument(filename) => {
      return true;
    },

    actionNamePrivacy: false,
  }
}
```

This instrument function expects you to return `true` or `false`. In this case, all files are instrumented to capture user input. 

#### Lifecycle

```js
react : {
  lifecycle : {
    includeUpdate : false,
    instrument(filename) => {
      // This will only capture inputs in files in the path src/screens/
      return filename.startsWith(require('path').join('src', 'screens'));
    }
  }
}
```

The instrument function expects you to return `true` or `false`. In this case, all files in the `src/screens/` folder are instrumented to capture lifecycle changes.

**Note:** it is important that you input all files here where you wish lifecycle instrumentation. Probably this should contain all your "real" screens. If you return `true` for this function, all lifecycle events will be reported, which can be a lot in React Native.

#### Debug mode

```js
react: {
  debug: true
}
```

This activates the debug mode. You will get more console output during instrumentation and at runtime.

#### Autostart

```js
react: {
  autoStart: true
}
```

This activates the AutoStart mode, which will insert an auto start call in your React Native application. This is per default true. If you want to use a manual startup call, please have a look into the [manual startup section](#manual-oneagent-startup).

#### Bundle Name

Should be used only if you have a multiple bundle setup where you load several .bundle files within your React Native application. Enter the name of your bundle. This should be unique in comparison to your other bundle names. This will ensure that actions coming from different bundles will not interfere with each other.

```js
react: {
  bundleName: "MyCustomBundle"
}
```

### Android block

The Android block is a wrapper for the Android configuration you find in the WebUI (in the Mobile Application Settings). Copy the content into the following block:

```js
android : {
  config : `CONTENT_OF_ANDROID_CONFIG`
}
```

The content of the `config` block is directly copied to the Gradle file. To know more about the possible configuration options, see the [DSL documentation](https://www.dynatrace.com/support/doc/javadoc/oneagent/android/gradle-plugin/dsl/) of our Gradle plugin.

### iOS block

The iOS block is a wrapper for the iOS configuration you find in the WebUI (in the Mobile Application Settings). Copy the content into the following block:

```js
ios : {
  config : `CONTENT_OF_IOS_CONFIG`
}
```

The content of the `config` block is directly copied to the `plist` file. Therefore, you can use every setting that is possible and you find in the official Mobile Agent documentation.

## Define build stages in dynatrace.config.js

If you have several stages such as debug, QA, and production, you probably want to seperate them and let them report in different applications. This can be done with two different approaches:

1. Create several dynatrace.config.js (e.g. dynatrace.config.prod.js) and pass those configuration files via [arguments](#customizing-paths-for-configuration) in the CLI.
2. Use the configuration options which are available through Gradle and XCode. (Described below)

> **Note:** Option 1 has the drawback that you always need to perform the configuration step before a build as you are basically replacing the configuration all the time. So if you made a debug build and want to do a production build, which is reporting to a different environment or has different options, you need to perform [`npx instrumentDynatrace`](#npx-instrumentdynatrace) (Or if you use RN 0.60+ this happens automatically with `react-native run-android` or `react-native run-ios`).

### Android

In Android, you can enter all the information in the config file. The following *dynatrace {}* block must be inserted into the android *config* variable in your dynatrace.config.js file.

```js
android : {
  config : `
    dynatrace {
      configurations {
        dev {
            variantFilter "Debug" // build type name is upper case because a product flavor is used
            // other variant-specific properties
        }
        demo {
            variantFilter "demo" // the first product flavor name is always lower case
            // other variant-specific properties
        }
        prod {
            variantFilter "Release" // build type name is upper case because a product flavor is used
            // other variant-specific properties
        }
      }
    }
  `
}
```

This will result in the following:

```
> Task :app:printVariantAffiliation
Variant 'demoDebug' will use configuration 'dev'
Variant 'demoRelease' will use configuration 'demo'
Variant 'paidDebug' will use configuration 'dev'
Variant 'paidRelease' will use configuration 'prod'
```

In all these blocks, you can define different application IDs and even use a different environment.

### iOS

In iOS, you can define some variables in the dynatrace.config.js file. These variables must then be inserted in a prebuild script. The following properties must be inserted into the iOS *config* variable in your dynatrace.config.js file.

```js
ios: {
  config: `
  <key>DTXApplicationID</key>
  <string>\${APPLICATION_ID}</string>
  <key>DTXBeaconURL</key>
  <string>Your Beacon URL</string>
  `
}
```

The variable ${APPLICATION_ID} must then be inserted with a prebuild script. Make sure to use \ in front of the ${...}, because if not JavaScript thinks you are trying to insert a variable into the String. For more information, see https://medium.com/@andersongusmao/xcode-targets-with-multiples-build-configuration-90a575ddc687.

## User opt-in mode

Specifies if the user has to opt-in for being monitored. When enabled, you must specify the privacy setting. For more information, see the [API section](#data-collection).

### Android

```js
android: {
  config: `
    dynatrace {
      configurations {
        defaultConfig {
          autoStart{
            ...
          }
          userOptIn true
        }
      }
    }
  `
}
```

### iOS

```js
ios: {
  config: `
  <key>DTXUserOptIn</key>
  </true>
  `
}
```

## Native OneAgent debug logs

If the instrumentation runs through and your application starts but you see no data, you probably need to dig deeper to find out why the OneAgents aren't sending any data. Opening up a support ticket is a great idea, but gathering logs first is even better. 

### Android

Add the following configuration snippet to your other configuration in dynatrace.config.js right under the autoStart block (the whole structure is visible, so you know where the config belongs) and run [`npx instrumentDynatrace`](#npx-instrumentdynatrace):

```js
android: {
  config: `
    dynatrace {
      configurations {
        defaultConfig {
          autoStart{
            ...
          }
          debug.agentLogging true
        }
      }
    }
  `
}
```

### iOS

Add the following configuration snippet to your other configuration in dynatrace.config.js (the whole structure is visible, so you know where the config belongs) and run [`npx instrumentDynatrace`](#npx-instrumentdynatrace):

```js
ios: {
  config: `
  <key>DTXLogLevel</key>
  <string>ALL</string>
  `
}
```

## How does Dynatrace determine the user action name?
* React views
  * dtActionName: Use a custom property called dtActionName 
  * displayName: Use the displayName property to check if React views have a display name set (Not available for functional component)
  * instrumentation string: Auto instrumentation or manual instrumentation is passing a string. This will be used if available.
  * class name: If the display name is not available, the class name is used by taking the property name from the constructor
* Touchables
  * dtActionName: Use a custom property called dtActionName 
  * If [actionNamePrivacy](#plugin-startup) is activated anything below will not be detected
  * Accessibility label
  * If both are not set, it will search for an inner text
  * If it is an Image Button, it will search for a source
* Buttons
  * dtActionName: Use a custom property called dtActionName
  * If [actionNamePrivacy](#plugin-startup) is activated any below will not be detected
  * Button Title
  * Accessibility label
  * If it is an Image Button, it will search for a source
  * If it finds nothing, it will search for an inner text


>*Attention:* Minification can cause a loss of information.


## Using dtActionName to change the name of the action

We check for a property named `dtActionName` when creating an action. If `dtActionName` exists, this will be used for the action name above every other option listed in the previous section. Examples: 

Typescript:
```ts
<TouchableHighlight {...{ "dtActionName": "CustomActionName" }}><Text>Custom Action Name</Text></TouchableHighlight>
```

JavaScript:
```js
<TouchableHighlight dtActionName="CustomActionName"><Text>Custom Action Name</Text></TouchableHighlight>
```

*Note:* [actionNamePrivacy](#plugin-startup) has no impact on using dtActionName. dtActionName will always be used.

## React Automatic Runtime

React introduced with React v17.x, React v16.14.0, React v15.7.0, and React v14.10 the automatic runtime which changes the JSX transformation (https://reactjs.org/blog/2020/09/22/introducing-the-new-jsx-transform.html). 

This impacts our instrumentation as well. To keep the instrumentation in place you need to change your babel configuration. 

For our instrumentation to work properly, you will need to add the importSource property:

```js
module.exports = {
  plugins: [
    [
      "@babel/plugin-transform-react-jsx",
      {
        runtime: "automatic", 
        importSource: "@dynatrace/react-native-plugin"
      }
    ]
  ]
}
``` 

Using `babel-preset-expo`:

```js
module.exports = {
  presets: [
    ['babel-preset-expo',
      {
        jsxRuntime: 'automatic',
        jsxImportSource: '@dynatrace/react-native-plugin',
      },
    ],
  ],
};
```

Using `metro-react-native-babel-preset`:

```js
module.exports = {
  presets: [
    ['module:metro-react-native-babel-preset'],
  ],
  plugins: [
      [
          '@babel/plugin-transform-react-jsx',
          {
              runtime: 'automatic',
              importSource: "@dynatrace/react-native-plugin"
          },
      ],
  ],
};
```

## Using a second transformer besides the dynatrace transformer

If you want to register the Dynatrace transformer in your configuration and you already have a transformer in place, change the upstreaming transformer for the Dynatrace transformer.

This can be done via a configuration value in the `dynatrace.config.js`. The following example shows how the configuration might look like for the popular `react-native-svg-transformer`. Be aware that the following example is targeting *React Native v0.72.1* or newer.

#### dynatrace.config.js

```js
// The `...` only indicates that there are other values as well, but we've omitted them in this example.
module.exports = {
    react : {
        upstreamTransformer: require.resolve('customTransformerLib/myTransformer'),
        ...
    },
    ...       
}
```

#### metro.config.js for React Native v0.72.1 or newer
```js
const {getDefaultConfig, mergeConfig} = require('@react-native/metro-config');
const defaultConfig = getDefaultConfig(__dirname);
const {assetExts, sourceExts} = defaultConfig.resolver;

/**
 * Metro configuration
 * https://facebook.github.io/metro/docs/configuration
 *
 * @type {import('metro-config').MetroConfig}
 */
const config = {
  transformer: {
    babelTransformerPath: require.resolve(
      '@dynatrace/react-native-plugin/lib/dynatrace-transformer',
    ),
  },
  reporter: require('@dynatrace/react-native-plugin/lib/dynatrace-reporter'),
  resolver: {
    assetExts: assetExts.filter(ext => ext !== 'svg'),
    sourceExts: [...sourceExts, 'cjs', 'svg'],
  },
};

module.exports = mergeConfig(defaultConfig, config);
```

#### metro.config.js for React Native v0.59 or newer

```js
const { getDefaultConfig } = require("metro-config");

module.exports = (async () => {
  const {
    resolver: { sourceExts, assetExts }
  } = await getDefaultConfig();
  return {
    transformer: {
      babelTransformerPath: require.resolve('@dynatrace/react-native-plugin/lib/dynatrace-transformer')
    },
    reporter: require('@dynatrace/react-native-plugin/lib/dynatrace-reporter'),
    resolver: {
      assetExts: assetExts.filter((ext) => ext !== "svg"),
      sourceExts: [...sourceExts, "cjs", "svg"]
    }
  };
})();
```

## Maven Central in top-level gradle file

Because the Dynatrace Android agent now requires the MavenCentral repository, if either `jcenter()` or `mavenCentral()` is not added inside of **ALL** the repositories blocks via the [top-level build.gradle](https://dt-url.net/jm610pso), the build will fail. 
Below is an example of what a basic [top-level build.gradle](https://dt-url.net/jm610pso) file should look like after adding `mavenCentral()` to all repository blocks:

![mavenCentralRN](https://dt-cdn.net/images/mavencentralrn-728-7557147f26.png)

The location of the [top-level build.gradle](https://dt-url.net/jm610pso) should be:
* `<rootOfProject>\android\build.gradle`

**Note:**
JCenter has noted its [sunset](https://jfrog.com/blog/into-the-sunset-bintray-jcenter-gocenter-and-chartcenter/) on May 1st. Though, JCenter is still syncing with Maven Central so having`jcenter()` in your **build.gradle** file without the use of `mavenCentral()` will retrieve the Dynatrace Android Gradle Plugin no problem.

## Updating to Gradle 6

Updating Gradle only affects your Android build. To update your project to Gradle 6, modify the following 3 files in your Android folder. 

- `ProjectFolder\android\gradle\wrapper\gradle-wrapper.properties` Update the distributionUrl to get a newer gradle version.

```
distributionUrl=https\://services.gradle.org/distributions/gradle-6.1.1-all.zip
```

- `ProjectFolder\android\build.gradle` Update the version of your Android gradle plugin (minimum 4.x) as Gradle 6 needs a newer one. To get the newer versions, add `google()` in your repositories. Example of a build.gradle file:

```
buildscript {
    repositories {
        google()
    }
    dependencies {
        classpath 'com.android.tools.build:gradle:3.4.0'
    }
}

allprojects {
    repositories {
        google()
        mavenLocal()
        jcenter()
        maven {
            url "$rootDir/../node_modules/react-native/android"
        }
    }
}
```

- `ProjectFolder\android\app\build.gradle` This depends on how old your React Native project really is. You must change your used buildTools, compileSdkVersion, targetSdkVersion and support libaries. Older build.gradle files might look similar to this with unimportant parts removed to make the snippet smaller:

```
...

apply from: "../../node_modules/react-native/react.gradle"

...

android {
    compileSdkVersion 28
    buildToolsVersion "28.0.3"

    defaultConfig {
        minSdkVersion 16
        targetSdkVersion 28

        ...
    }

    ...
}

dependencies {
    compile "com.android.support:appcompat-v7:28.0.0"
    compile "com.facebook.react:react-native:+" 
}

...

```

## Configuration of standalone React Native project

This section explains the configuration of a standalone React Native project. This means you have a React Native project, but don't use the typicial `iOS` and `android` folders. Instead you have a seperate native `iOS` or `android` project which is embedding your React Native project.

To get the same experience as somebody who has a combined project, you roughly need to do the following things:

* Apply Auto Instrumentation to your Native Project
* Add this plugin to your React Native project

### Auto Instrumentation of your Native Project

The mobile application in the web UI offers you a configuration wizard (see settings page) for your native project (Android/iOS). Use it and apply it to your seperated native project according to this documentation:

  - Android: https://www.dynatrace.com/support/help/technology-support/operating-systems/android/instrumentation-via-plugin/instrumentation-via-plugin/
  - iOS: https://www.dynatrace.com/support/help/technology-support/operating-systems/ios/instrumentation/dynatrace-auto-instrumentation-for-ios/

### Add this plugin to your React Native project

After you have added the auto instrumentation to your native project, you need to add this plugin to your standalone react native project. 

You can simply follow the [setup](#1-install-the-plugin) shown in the beginning of this documentation. There is no special handling needed, except skipping step 4, as it is of course not needed as you usually create a bundle when building a standalone project.

* **Optional:** You can remove the android and ios block from your dynatrace.config.js. It has no impact on the plugin as the configuration of the native platforms is skipped because of the missing iOS and android folder. 

## Dynatrace documentation
The OneAgent for Android and iOS documentation is available at the following locations:
  - Android: https://www.dynatrace.com/support/help/setup-and-configuration/oneagent/android/
  - iOS: https://www.dynatrace.com/support/help/setup-and-configuration/oneagent/ios/

**Note:**
The Dynatrace Android Gradle plugin is hosted on [Maven Central](https://search.maven.org/#search%7Cgav%7C1%7Cg%3A%22com.dynatrace.tools.android%22%20AND%20a%3A%22gradle-plugin%22). JCenter has noted it's [sunset](https://jfrog.com/blog/into-the-sunset-bintray-jcenter-gocenter-and-chartcenter/) on May 1st so Maven Central is the primary source of the Dynatrace Android Gradle plugin.

## Troubleshooting and applicable restrictions

>**Attention:** If you think something is not working the way it should, ALWAYS try to reset the cache of metro first before starting a support case. You can do this via the CLI *react-native start --reset-cache*. If it still does not work feel free to open a support case.

To resolve problems with the plugin, first look at creating logs and identify what went wrong. The logs can be found in the plugins folder of your React Native project (usually `node_modules/@dynatrace/react-native-plugin/logs`). 

* An error such as `DynatraceNative.PLATFORM_ANDROID is null` indicates that the linking of the native library didn't work correctly. Often, React Native is unable to link correctly. Simply unlink (`react-native unlink`) and link (`react-native link`) again and the error should be gone.
* `Missing property DTXApplicationID` indicates that there is no configuration available. Ensure that you've called `npm run updateConfiguration` at least once.
* If you change your project to pods when you have already installed the plugin, duplicate symbols are generated because of the already linked library. Remove the module reference manually from your project. 
* Build failes with the error of "No configuration for the Dynatrace Android Gradle plugin found! Please copy the configuration block from the instrumentation wizard to the proper location."
** The android configuration was not added to your project. Please refer to the [install the plugin](#install-the-plugin) section.
* For Android, if you see an error like "Gradle sync failed: Could not find com.dynatrace.tools.android:gradle-plugin:8.223.1.1003.", please see the [MavenCentral](#mavenCentral) section for an example and more information.
* When using NodeJS version `15+` and version `2.231.1` of our plugin you could encounter the following error: `npm ERR! Could not resolve dependency: npm ERR! peer react@"^16.0" from @react-native-community/picker@1.8.1`. Using the old deprecrated [Picker dependency](https://www.npmjs.com/package/@react-native-community/picker) was causing peer dependency issues so we updated the auto-instrumentation to use the [new Picker dependency.](https://www.npmjs.com/package/@react-native-picker/picker) If you are still using this `@react-native-community/picker`, you can manually instrument the picker without issue ([create custom actions](#create-custom-actions)).

## Report a bug or open a support case

>**Attention:** If you think something is not working the way it should, ALWAYS try to reset the cache of metro first before starting a support case. You can do this via the CLI *react-native start --reset-cache*. If it still does not work feel free to open a support case.

If you are struggling with a problem, submit a support ticket to Dynatrace (support.dynatrace.com) and provide the following details:
* Logs from the [native agent](#native-oneagent-debug-logs)
* Logs from `node_modules/@dynatrace/react-native-plugin/logs`
* Your dynatrace.config.js file
<br/><br/>
## Changelog

2.277.1
* Update Android (8.277.1.1003) & iOS Agent (8.277.1.1004)
* Introduced `ConfigurationBuilder` for Manual Startup
* Deprecating `ManualStartupConfiguration` for Manual Startup

2.275.1
* Update iOS Agent (8.275.1.1006)
* Add documentation for manually tagging web requests

2.273.1
* Update Android (8.273.1.1003) & iOS Agent (8.273.1.1006)
* Crash handler initialization happens earlier in the application
* Ignoring duplicated crashes through native crash handler

2.271.3
* Update Android (8.271.1.1003) & iOS Agent (8.271.2.1007)
* Fixed createElement logic for older React Native versions
* Fixed asynchronous handler for Touchables
* Updated instrumentation of RefreshControl

2.269.1
* Update Android (8.269.1.1009) & iOS Agent (8.269.1.1007)
* Updated instrumentation for iOS Picker to match Android

2.267.1
* Updated Android (8.267.1.1005) & iOS Agent (8.267.1.1006)
* Added support for [tvOS](#setup-for-tvos)

2.265.2
* Updated Android (8.265.1.1002) & iOS Agent (8.265.1.1003)
* Fixed Metro problem because of dynamic require
* Fixed enterManualAction/enterAutoAction API

2.263.2
* Updated Android (8.263.1.1002) & iOS Agent (8.263.2.1005)
* Fixed execution of tests via Jest 28.x

2.261.1
* RectButton of react-native-gesture-handler instrumented
* Updated Android (8.261.2.1013) & iOS Agent (8.261.1.1006)
* Minimum Java Version was raised to 11

2.259.2
* Updated Android (8.259.1.1008) & iOS Agent (8.259.1.1009)
* Fixed issue with jsx-runtime and changed [importSource](#react-automatic-runtime)
* Fixed wrong naming for components via jsx-runtime

2.257.1
* Added API for creating a [manual custom action](#create-custom-actions)
* Removed option to disable certificate validation
* Updated Android (8.257.1.1007) & iOS Agent (8.257.1.1007)
* Minimum Support iOS version raised to 11

2.255.1
* Enhanced debug logging
* Adding instrumentation for touchables of react-native-gesture-handler
* Fixed Auto instrumentation in case of missing start of plugin
* Fixed JSX Runtime
* Updated Android (8.255.1.1005) & iOS Agent (8.255.1.1006)

2.253.2
* Added Business events capturing [API](#business-events-capturing)
* Updated Android (8.253.1.1003) & iOS Agent (8.253.1.1006)
* Fixed plist configuration/handling for iOS DTXAutoStart

2.249.1
* Configuration commands fixed for React Native 0.70.0+
* Updated Android Agent (8.249.1.1004) & iOS Agent (8.249.1.1007)
* Added Business events capturing [API](#business-events-capturing)

2.247.1
* Updated Android Agent (8.247.1.1003) & iOS Agent (8.247.1.1007)
* Minimum supported Android SDK version raised to 21
* Added [actionNamePrivacy](#plugin-startup) configuration flag
* Removed `instrumentDynatrace` from package.json
* Adding [`npx instrumentDynatrace`](#npx-instrumentdynatrace) and [`npx configDynatrace`](#npx-configdynatrace) command

2.243.0
* Removed deprecated [Picker](https://www.npmjs.com/package/@react-native-community/picker) 
* Added auto-instrumentation for the new [Picker](https://www.npmjs.com/package/@react-native-picker/picker)
* Updated Android Agent (8.241.1.1003) & iOS Agent (8.241.1.1013)

2.231.1
* Added [cancel API for actions](#cancel-actions) 
* Updated Android Agent (8.231.2.1007) & iOS Agent (8.231.1.1009)
* React Native 0.66.0 compatibility

2.227.0
* Fixed auto start in React Native 0.65.x
* Updated Android Agent (8.225.1.1004) 

2.225.0
* [Custom config](#customizing-paths-for-configuration) argument fixed for transformer
* Fixed infite loop of HOC with React Redux & Functional component
* Added Manual API for Class & Function component instrumentation
* Internally changed way of class component instrumentation
* Updated Android Agent (8.223.1.1003) & iOS Agent (8.223.1.1006)

2.217.0
* Added option to [exclude single elements from monitoring](#exclude-individual-jsx-elements)
* Added [reportCrash(name, crash)](#crash-reporting) API
* Updated iOS Agent to 8.217.1.1003 (Min iOS version changed to 9)

2.214.0
* Fixed runtime exchange of functional component

2.207.1
* [Added option to change action name with dtActionName property](#using-dtactionname-to-change-the-name-of-the-action)
* Added instrumentation for functional components
* Preserving names even if minification happened
* Support for JSX [Automatic runtime](#react-automatic-runtime)
* Support for Pressable Component

1.205.0
* Fixed transformation problems with TSImportType and JSX
* Updated error handler to report crashes instead of error stacktraces
* Added [setBeaconHeaders API](#setting-beacon-headers)
* Added [UserPrivacyOptions API](#data-collection)
* Updated DataCollection level enum members to match native agents

1.202.0
* Startup configuration now only written once
* Fixed usage of displayName for component action creation

1.201.0
* Improved exception handling

1.200.0
* .TSX transformation fixed

1.198.0
* Podspec Update

1.192.2
* Fix for Installation Script not executed
* RN >= 0.62 Touchables support
* [Multi-Transformer support](#using-a-second-transformer-besides-the-dynatrace-transformer)
* Updated & fixed .d.ts file
* Fixed NPE in text identification of Touchables
* Crashes are now reported in the overview
* iOS Webrequests are now linked with actions
* Fix for custom arguments on run-ios and run-android

0.186.0
* Fixed instrumentation (files were skipped)
* Changed [Configuration](#structure-of-the-dynatracejs-file) format
* Android: Switched to JCenter repository
* Applying configuration automatically (>= RN 0.60)
* Updated documenation for manual instrumentation
* Fixed problem with default config and beaconUrl
* Improved text identification of Touchables
* ImageButtons and Icons will now be reported
* Improved logic for plist file insertion

0.182.2
* MacOS: Fixed directory creation issue

0.182.1
* Fixed Typescript Parsing
* Fixed Decorator Parsing
* Fixed directory issue with older node version

0.181.1
* Picker & Swipe to Refresh instrumented
* Dynamic Imports/Requires now supported
* Fixed iOS Bug with reportErrorWithStacktrace

0.179.1
* Made Plugin compatible with RN AutoLinking
* Improved instrumentation of require & imports
* Fixed Button instrumentation 
* Improved Text identification of Touchable
* Webrequest linking (Android only)
* Auto User action creation (Android only)
* Report Stacktrace via Error API (Android & iOS)
* Uninstall process now removes everything
* Modifying SourceMap, Debugging now possible
* Fixed configuration issue with npm install

0.174.0
* Switching to new Android instrumentation
* Added options to filter instrumentation

0.172.0
* Error reporting through auto instrumentation
* [Debug message](#debug-mode) output in console

0.171.0
* Added auto instrumentation for React classes

0.168.0
* Initial Beta Release