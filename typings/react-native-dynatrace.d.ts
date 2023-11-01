/**
* react-native-dynatrace.d.ts
*
* Type definition file for the react native dynatrace package
*/

/**
 * Specifying a platform when you want individual behaviour
 */
export declare enum Platform {
	/**
	 * Android Platform
	 */
	Android,

	/**
	 * iOS Platform
	 */
	Ios
}

/**
 * Level of log message that will be printed
 */
export declare enum LogLevel {
	/**
	 * A lot of diagnostic infos will be printed
	 */
	Debug,

	/**
	 * Only the necessary infos will be printed
	 */
	Info
}

/**
 * Enum that represents the different privacy levels.
 */
export declare enum DataCollectionLevel {
	/**
	 * @member {DataCollectionLevel} Off  
	 * @description Native Agent doesn't capture any monitoring data.
	 */
	Off,

	/**
	 * @member {DataCollectionLevel} Performance
	 * @description Native Agent captures only anonymous performance data.
	 */
	Performance,

	/**
	 * @deprecated Replaced by UserBehavior
	 * @member {DataCollectionLevel} User
	 * @description Native Agent captures both performance and user data.
	 */
	User,

	/**
	 * @member {DataCollectionLevel} UserBehavior
	 * @description Native Agent captures both performance and user data.
	 */
	UserBehavior,
}

type Primitive = string | number | boolean;
type JSONArray = JSONValue[];
type JSONValue = Primitive | JSONArray | JSONObject;

/**
 * JSON Object which can be used for sendEvent API
 */
export declare interface JSONObject {
	[key: string]: JSONValue;
}

export declare const Dynatrace: {
	/**
	 * Starting the React Native plugin and OneAgent for Android or iOS. This method is only necessary
	 * in case of manual startup and will be ignored in auto startup scenarios. The start method will
	 * set the error handler for reporting crashes and will apply the provided configuration globally.
	 *
	 * @param {IConfiguration} configuration Configuration for a manual startup of the plugin
	 */
	start(configuration: IConfiguration): Promise<void>;

	/**
	 * This call allows to monitor the passed in component. Depending on the type of the component
	 * (Function Component or Class Component), it will be wrapped and data of renderings will be
	 * automatically reported.
	 *
	 * The name of the Component, which can be passed as parameter, is important because the build
	 * process will remove the name of a Functional Component. Still this parameter is optional as
	 * other properties can be used at runtime as well (e.g. dtActionName).
	 *
	 * @param Component Functional or Class Component
	 * @param {string} name The name of the Component
	 * @returns The Component which was wrapped to be monitored
	 */
	withMonitoring(Component: React.FunctionComponent<any> | React.ComponentClass<any>, name?: string): React.FunctionComponent<any> | React.ComponentClass<any>

	/**
	 * Creates an Action which will be automatically handled by the plugin. This means that the
	 * plugin decides about the hierachy of this action. If there is no open action, the following
	 * action will be a root action. All other actions created by this method, while a root action
	 * is open, will be automatically inserted as a child action. Furthermore the plugin will automatically
	 * link webrequest (if they are not tagged manually) to the open root action.
	 *
	 * @deprecated Please use either {@link enterAutoAction}, which is doing the same or alternatively {@link enterManualAction}.
	 *
	 * @param {string} name Name of the action, which will be created. This name must not be empty.
	 * @param {Platform} platform Optional, which means this call will be applied on both platforms (Android & iOS).
	 * @returns {IDynatraceAction} Action that is created. If name was empty a NullAction will be provided, which will act as normal action,
	 * but has no functionality.
	 */
	enterAction(name: string, platform?: Platform): IDynatraceAction;

	/**
	 * Creates an Action which will NOT be handled by the plugin. This means that you have full control
	 * about the hierachy of your actions. This function will create a {@link IDynatraceRootAction} for you,
	 * which has the ability to create child actions via {@link IDynatraceRootAction.enterAction}. Be aware,
	 * because of the full manual approach the plugin will not link webrequest automatically. Webrequest
	 * have to be manually tagged by using the tag provided by the action via {@link IDynatraceAction.getRequestTag}.
	 *
	 * @param {string} name Name of the action, which will be created. This name must not be empty.
	 * @param {Platform} platform Is optional, which means by default this call will be applied on both platforms (Android & iOS).
	 * @returns {IDynatraceRootAction} Action that is created. If name was empty a NullRootAction will be provided,
	 * which will act as normal root action, but has no functionality.
	 */
	enterManualAction(name: string, platform?: Platform): IDynatraceRootAction;

	/**
	 * Creates an Action which will be automatically handled by the plugin. This means that the
	 * plugin decides about the hierachy of this action. If there is no open action, the following
	 * action will be a root action. All other actions created by this method, while a root action
	 * is open, will be automatically inserted as a child action. Furthermore the plugin will automatically
	 * link webrequest (if they are not tagged manually) to the open root action.
	 *
	 * @param {string} name Name of the action, which will be created. This name must not be empty.
	 * @param {Platform} platform Is optional, which means by default this call will be applied on both platforms (Android & iOS).
	 * @returns {IDynatraceAction} Action that is created. If name was empty a NullAction will be provided,
	 * which will act as normal action, but has no functionality.
	 */
	enterAutoAction(name: string, platform?: Platform): IDynatraceAction;

	/**
	 * Can be called to end the current visit and start a new visit. All current actions are
	 * closed and sent to the server.
	 *
	 * @param {Platform} platform Is optional, which means by default this call will be applied on both platforms (Android & iOS).
	 */
	endSession(platform?: Platform): void;

	/**
	 * The current visit/session will be tagged with the provided user id.
	 * The value will not be stored and has to be renewed for every new session.
	 *
	 * @param {string} user a unique id that allows you to identify the current user.
	 * If user is null or empty, then the user tag will be removed from the session.
	 * @param {Platform} platform Is optional, which means by default this call will be applied on both platforms (Android & iOS).
	 */
	identifyUser(user: string, platform?: Platform): void;

	/**
	 * Saves the given GPS location for reporting along with the captured data.
	 *
	 * @param {Number} latitude latitude data of the position
	 * @param {Number} longitude longitude data of the position
	 * @param {Platform} platform Is optional, which means by default this call will be applied on both platforms (Android & iOS).
	 */
	setGPSLocation(latitude: Number, longitude: Number, platform?: Platform): void;

	/**
	 * Call this function to flush all collected events immediately. To reduce network chatter, the collected events are usually
	 * sent in packages where the oldest event has an age of up to 2 minutes (the default; the maximum age can be configured).
	 * Using this function, you can force sending of all collected events regardless of their age.
	 *
	 * @param {Platform} platform Is optional, which means by default this call will be applied on both platforms (Android & iOS).
	 */
	flushEvents(platform?: Platform): void;

	/**
	 * Tells you if you opted into crash reporting. If this value is false, which means off,
	 * the native agent will not report a single crash that is happening within the application.
	 * This method will always return true, when the user optin feature is not used.
	 *
	 * @deprecated Please use {@link getUserPrivacyOptions} to get the crash reporting opt-in value.
	 *
	 * @param {Platform} platform Is optional, which means by default this call will be applied on both platforms (Android & iOS).
	 * @returns {Promise<boolean>} Promise which resolves true if crash reporting is opted in.
	 */
	isCrashReportingOptedIn(platform?: Platform): Promise<boolean>;

	/**
	 * Allows the user to activate/deactivate crash reporting and stores the users decisions for future sessions.
	 * This method can only be used, when the configuration (dynatrace.config.js) for android or iOS is using the userOptIn mode.
	 *
	 * @deprecated Please use {@link applyUserPrivacyOptions} to set crash reporting opt-in.
	 *
	 * @param {boolean} crashReporting Pass true, if you want to enable crash reporting
	 * @param {Platform} platform Is optional, which means by default this call will be applied on both platforms (Android & iOS).
	 */
	setCrashReportingOptedIn(crashReporting: boolean, platform?: Platform): void;

	/**
	 * Returns the current {@link DataCollectionLevel} which is used by the plugin. This method will always
	 * return {@link DataCollectionLevel.UserBehavior}, when the user opt-in feature is not used.
	 *
	 * @deprecated Please use {@link getUserPrivacyOptions} to get the current data collection level value.
	 *
	 * @param {Platform} platform Is optional, which means by default this call will be applied on both platforms (Android & iOS).
	 * @returns promise which resolve a data collection level string
	 */
	getDataCollectionLevel(platform?: Platform): Promise<DataCollectionLevel>;

	/**
	 * Allows the user to set the {@link DataCollectionLevel} and stores the users decisions for future sessions.
	 * This method can only be used, when the configuration (dynatrace.config.js) for android or iOS is using the userOptIn mode.
	 * When the user changes the {@link DataCollectionLevel} a new session will be started.
	 *
	 * @deprecated Please use {@link applyUserPrivacyOptions} to apply the current data collection level value.
	 *
	 * @param {DataCollectionLevel} dataCollectionLevel New data collection level
	 * @param {Platform} platform Is optional, which means by default this call will be applied on both platforms (Android & iOS).
	 */
	setDataCollectionLevel(dataCollectionLevel: DataCollectionLevel, platform?: Platform): void;

	/**
	 * Get the current user privacy options including data collection level (Off, Performance, UserBehavior)
	 * and if crash reporting opt-in is enabled
	 *
	 * @param {Platform} platform Is optional, which means by default this call will be applied on both platforms (Android & iOS).
	 * @returns {Promise<UserPrivacyOptions>} current user privacy options
	 */
	getUserPrivacyOptions(platform?: Platform): Promise<UserPrivacyOptions>;

	/**
	 * Creates a new session with the specified privacy settings and stores the privacy settings for future sessions.
	 * This method can only be used, when user opt-in feature is enabled. This method call has no effect,
	 * if the given privacy settings are identical to the previously specified privacy settings.
	 *
	 * @param {UserPrivacyOptions} userPrivacyOptions the new privacy settings from the user
	 * @param {Platform} platform Is optional, which means by default this call will be applied on both platforms (Android & iOS).
	 */
	applyUserPrivacyOptions(userPrivacyOptions: UserPrivacyOptions, platform?: Platform): void;

	/**
	 * Similar to {@link IDynatraceAction.reportError}. But the error event is reported as root action.
	 *
	 * @param {string} errorName Name of the error event
	 * @param {number} errorCode The code of the error
	 * @param {Platform} platform Is optional, which means by default this call will be applied on both platforms (Android & iOS).
	 */
	reportError(errorName: string, errorCode: number, platform?: Platform): void;

	/**
	 * Reports a stacktrace
	 *
	 * @deprecated Please use {@link reportErrorStacktrace} instead.
	 *
	 * @param {string} errorName Name of the Error - SyntaxError
	 * @param {string} reason Reason for the Error
	 * @param {string} stacktrace Whole Stacktrace
	 * @param {Platform} platform Is optional, which means by default this call will be applied on both platforms (Android & iOS).
	 */
	reportErrorWithStacktrace(errorName: string, reason: string, stacktrace: string, platform?: Platform): void;

	/**
	 * Reports a stacktrace
	 *
	 * @param {string} errorName Name of the error
	 * @param {string} errorValue Value of the error
	 * @param {string} reason Reason for the error
	 * @param {string} stacktrace Whole stacktrace
	 * @param {Platform} platform Is optional, which means by default this call will be applied on both platforms (Android & iOS).
	 */
	reportErrorStacktrace(errorName: string, errorValue: string, reason: string, stacktrace: string, platform?: Platform): void;

	/**
	 * Reports a custom crash
	 *
	 * @param {string} crashName Name of the crash
	 * @param {string} reason Reason for the crash
	 * @param {string} stacktrace Whole stacktrace
	 * @param {Platform} platform Is optional, which means by default this call will be applied on both platforms (Android & iOS).
	 */
	reportCrash(crashName: string, reason: string, stacktrace: string, platform?: Platform): void;

	/**
	 * Reports a crash with an error object (which needs to contain a stacktrace)
	 *
	 * @param {string} crashName Name of the crash
	 * @param {Error} crash error object
	 * @param {Platform} platform Is optional, which means by default this call will be applied on both platforms (Android & iOS).
	 */
	reportCrashWithException(crashName: string, crash: Error, platform?: Platform);

	/**
	 * Puts a set of http headers on every agent http request (eg. the Authorization header). It also triggers the agent to
	 * reconnect to the beacon endpoint with the new headers. To clear the previous headers,
	 * call the method with a null or empty value.
	 *
	 * @param {Map<string, string>} headers a set of http headers
	 * @param {Platform} platform Is optional, which means by default this call will be applied on both platforms (Android & iOS).
	 */
	setBeaconHeaders(headers?: Map<string, string> | null, platform?: Platform): void;

	/**
	 * Send a Business Event
	 *
	 * With sendBizEvent, you can report a business event. These standalone events are being sent
	 * detached from user actions or sessions.
	 * 
	 * Note: The 'dt' key, as well as all 'dt.' prefixed keys are considered reserved by Dynatrace
	 * and will be stripped from the passed in attributes.
	 *
	 * Note: Business events are only supported on Dynatrace SaaS deployments currently.
	 *
	 * @param {string} type Mandatory event type
	 * @param {JSONObject} attributes Must be a valid JSON object and cannot contain functions,
	 * undefined, Infinity and NaN as values, otherwise they will be removed.
	 * Attributes need to be serializable using JSON.stringify.
	 * The resulting event will be populated with attributes parameter,
	 * and enriched with additional properties, thus also empty objects are valid.
	 * @param {Platform} platform Is optional, which means by default this call will be applied on both platforms (Android & iOS).
	 */
	 sendBizEvent(type: string, attributes?: JSONObject, platform?: Platform): void;
}

export declare interface IDynatraceAction {
	/**
	 * Report an error
	 *
	 * @param {string} errorName Name of the error event
	 * @param {number} errorCode The code of the error
	 * @param {Platform} platform Is optional, which means by default this call will be applied on both platforms (Android & iOS).
	 */
	reportError(errorName: string, errorCode: number, platform?: Platform): void;

	/**
	 * Report an event
	 *
	 * @param {string} eventName Name of the event
	 * @param {Platform} platform Is optional, which means by default this call will be applied on both platforms (Android & iOS).
	 */
	reportEvent(eventName: string, platform?: Platform): void;

	/**
	 * Report a string value
	 *
	 * @param {string} valueName Name of the value
	 * @param {string} value The string value
	 * @param {Platform} platform Is optional, which means by default this call will be applied on both platforms (Android & iOS).
	 */
	reportStringValue(valueName: string, value: string, platform?: Platform): void;

	/**
	 * Report a int value
	 *
	 * @param {string} valueName Name of the value
	 * @param {number} value The int value
	 * @param {Platform} platform Is optional, which means by default this call will be applied on both platforms (Android & iOS).
	 */
	reportIntValue(valueName: string, value: number, platform?: Platform): void;

	/**
	 * Report a double value
	 *
	 * @param {string} valueName Name of the value
	 * @param {number} value The double value
	 * @param {Platform} platform Is optional, which means by default this call will be applied on both platforms (Android & iOS).
	 */
	reportDoubleValue(valueName: string, value: number, platform?: Platform): void;

	/**
	 * Leave action
	 *
	 * @param {Platform} platform Is optional, which means by default this call will be applied on both platforms (Android & iOS).
	 */
	leaveAction(platform?: Platform): void;

	/**
	 * Cancel action
	 *
	 * @param {Platform} platform Is optional, which means by default this call will be applied on both platforms (Android & iOS).
	 */
	cancel(platform?: Platform): void;

	/**
	 * Retrieve the request tag for this certain root action. This will
	 * allow you to manually link a web request to this action if you use
	 * this tag as header value.
	 *
	 * @param {string} url URL that you want to track
	 * @returns {Promise<string>} header tag which should be applied onto the request
	 */
	 getRequestTag(url: string): Promise<string>;

	 /**
	  * If you want to manually link a web request with an action this is 
	  * the name of the header you need to set.
	  * 
	  * @returns {string} name of the header that should be used for tagging a request
	  */
	 getRequestTagHeader(): string;
}

/**
 * Root action which can additionally to the normal IDynatraceAction
 * create another layer of actions underneath.
 */
export declare interface IDynatraceRootAction extends IDynatraceAction {
	/**
	 * Create a child action
	 *
	 * @param {string} actionName - name of action
	 * @param {Platform} platform Is optional, which means by default this call will be applied on both platforms (Android & iOS).
	 * @return {IDynatraceAction} created action
	 */
	 enterAction(name: string, platform?: Platform): IDynatraceAction;
}

/**
 * The Web request timing interface which can be used to measure a web request manually
 */
 export declare interface IDynatraceWebRequestTiming {

	/**
	 * Constructor for creating a DynatraceWebRequestTiming
	 * @param {string} requestTag Request Tag for the action to be linked to
	 * @param {string} url URL that should be linked
	 */
	constructor(requestTag: string, url: string);

	/**
	 * Start the measurment of the web request. Call this before the request is started.
	 */
	startWebRequestTiming(): void;

	/**
	 * Stops the measurment of the web request. This needs to be called after the request is executed.
	 * The responseCode and responseMessage will be transfered and shown in the web UI.
	 *
	 * @param {number} responseCode Status Code of the response e.g. 200
	 * @param {string} responseMessage Message of the response
	 */
	stopWebRequestTiming(responseCode: number, responseMessage: string): void;

	/**
	 * Returns the content for the header that is needed in order to track a request
	 *
	 * @returns {string} header tag which should be applied onto the request
	 */
	getRequestTag(): string;

	/**
	 * Returns the name for the header that is needed in order to track a request
	 *
	 * @returns {string} name of the header that should be used for tagging a request
	 */
	getRequestTagHeader(): string;

}

/**
 * Class which gives you the option to measure a web request
 */
export declare class DynatraceWebRequestTiming {

	/**
	 * Constructor for creation of a Web Request Timing object
	 * @param {string} requestTag The request tag used for the timing object.
	 * @param {string} url The URL of the request that is tagged and timed.
	 */
    constructor(requestTag: string, url: string);

	/**
     * Start the measurment of the web request. Call this before the request is started.
     */
    startWebRequestTiming(): void;

	/**
     * Stops the measurment of the web request. This needs to be called after the request is executed.
     * The responseCode and responseMessage will be transfered and shown in the web UI.
     *
     * @param {number} responseCode Status Code of the response e.g. 200
     * @param {string} responseMessage Message of the response
     */
    stopWebRequestTiming(responseCode: number, responseMessage: string): void;

	/**
     * Returns the content for the header that is needed in order to track a request
     *
     * @returns {string} header tag which should be applied onto the request
     */
    getRequestTag(): string;

	/**
     * Returns the name for the header that is needed in order to track a request
     *
     * @returns {string} name of the header that should be used for tagging a request
     */
    getRequestTagHeader(): string;
}

/**
 * Represents the privacy settings that the user can select
 */
export declare class UserPrivacyOptions {

	/**
	 * Constructor for creation of a privacy settings object
	 * @param {DataCollectionLevel} dataCollectionLevel Data collection level.
	 * @param {boolean} crashReportingOptedIn If crash reporting should be enabled.
	 */
	constructor(dataCollectionLevel: DataCollectionLevel, crashReportingOptedIn: boolean);

	/**
	 * Returns the specified data collection level.
	 * 
	 * @returns {DataCollectionLevel} the specified data collection level
	 */
	get dataCollectionLevel(): DataCollectionLevel;

	/**
	 * Sets the data collection level specified by the user.
	 *
	 * @param {DataCollectionLevel} dataCollectionLevel the specified data collection level from the user
	 */
	set dataCollectionLevel(dataCollectionLevel: DataCollectionLevel);

	/**
	 * Returns the opt-in value for crash reporting.
	 *
	 * @return {boolean} the opt-in value for crash reporting
	 */
	get crashReportingOptedIn(): boolean;

	/**
	 * Sets the privacy setting for crash reporting.
	 *
	 * @param {boolean} crashReportingOptedIn the opt-in value specified by the user
	 */
	set crashReportingOptedIn(crashReportingOptedIn: boolean);
}

/**
 * Configuration interface which should be used during a manual startup
 */
export declare interface IConfiguration {

    /**
     * Beacon url which is used for communicate with the beacon endpoint. This value is mandatory.
     *
     * Be aware this value is only important for manual startup. In case of auto startup this needs to be handled via
     * native agent configuration.
     */
    readonly beaconUrl: string;

    /**
     * Needed to identify and report data for this application. This value is mandatory.
     *
     * Be aware this value is only important for manual startup. In case of auto startup this needs to be handled via
     * native agent configuration.
     */
	readonly applicationId: string;

    /**
     * Enables reporting of crashes. By default this value is true if nothing is passed.
     *
     * Be aware this value is only important for manual startup. In case of auto startup this needs to be handled via
     * native agent configuration.
     */
	readonly reportCrash: boolean;

    /**
     * Log level of our plugin during application runtime. By default this values is LogLevel.Info, if nothing is passed.
     */
	readonly logLevel: LogLevel;

    /**
     * Decide if you want to see update cycles on lifecycle actions as well.
     * By default this value is false, if nothing is passed. Be aware as this creates a lot more data.
     */
	readonly lifecycleUpdate: boolean;

    /**
     * Activates the privacy mode when set to true. User consent must be queried and set.
     * The privacy settings for data collection and crash reporting can be changed via OneAgent SDK
     * for Mobile as described under Data privacy. By default this value is false, if nothing is passed.
     *
     * Be aware this value is only important for manual startup. In case of auto startup this needs to be handled via
     * native agent configuration.
     */
	readonly userOptIn: boolean;

    /**
     * Activates a privacy mode especially for Touchables and Buttons. Setting this option to true
     * means that a name for the control will no longer be shown, e.g. "Touch on Button".
     * When setting a dtActionName onto the component this setting will be ignored. By default this value is false,
     * if nothing is passed.
     */
	readonly actionNamePrivacy: boolean;

    /**
     * Will define the bundle name which will prefix internal action ids.
     */
    readonly bundleName?: string;
}

/**
 * Manual startup configuration which is used for Dynatrace.start()
 * @deprecated Use ConfigurationBuilder and IConfiguration instead
 */
export declare class ManualStartupConfiguration implements IConfiguration {
	/**
	 * Creates a Manual Startup configuration instance
	 *
	 * @param {string} beaconUrl Identifies your environment within Dynatrace. This property is mandatory for manual startup
	 * @param {string} applicationId Identifies your mobile app. This property is mandatory for manual startup
	 * @param {boolean} reportCrash Allows reporting React Native crashes.     
	 * @param {LogLevel} logLevel Allows you to choose between `LogLevel.Info` and `LogLevel.Debug`. Debug returns more logs. This is especially important when something is not functioning correctly.
	 * @param {boolean} lifecycleUpdate Decide if you want to see update cycles on lifecycle actions as well. This is per default false as it creates a lot more actions.
	 * @param {boolean} userOptIn Activates the privacy mode when set to `true`. User consent must be queried and set.
	 * @param {boolean} actionNamePrivacy Activates a privacy mode especially for Touchables and Buttons. Setting this option to true means that a name for the control will no longer be shown, e.g. "Touch on Button". When setting a dtActionName onto the component this setting will be ignored.
	 * @param {string} bundleName Will define the bundle name which will prefix internal action ids.
	 * 
	 * @deprecated Use ConfigurationBuilder and IConfiguration instead
	 */
	constructor(beaconUrl: string, applicationId: string, reportCrash?: boolean,
		logLevel?: LogLevel, lifecycleUpdate?: boolean, userOptIn?: boolean, 
		actionNamePrivacy?: boolean, bundleName?: string);

	/**
     * Beacon url which is used for communicate with the beacon endpoint. This value is mandatory.
     *
     * Be aware this value is only important for manual startup. In case of auto startup this needs to be handled via
     * native agent configuration.
     */
    readonly beaconUrl: string;

    /**
     * Needed to identify and report data for this application. This value is mandatory.
     *
     * Be aware this value is only important for manual startup. In case of auto startup this needs to be handled via
     * native agent configuration.
     */
	readonly applicationId: string;

	/**
     * Enables reporting of crashes. By default this value is true if nothing is passed.
     *
     * Be aware this value is only important for manual startup. In case of auto startup this needs to be handled via
     * native agent configuration.
     */
	readonly reportCrash: boolean;

    /**
     * Log level of our plugin during application runtime. By default this values is LogLevel.Info, if nothing is passed.
     */
	readonly logLevel: LogLevel;

    /**
     * Decide if you want to see update cycles on lifecycle actions as well.
     * By default this value is false, if nothing is passed. Be aware as this creates a lot more data.
     */
	readonly lifecycleUpdate: boolean;

    /**
     * Activates the privacy mode when set to true. User consent must be queried and set.
     * The privacy settings for data collection and crash reporting can be changed via OneAgent SDK
     * for Mobile as described under Data privacy. By default this value is false, if nothing is passed.
     *
     * Be aware this value is only important for manual startup. In case of auto startup this needs to be handled via
     * native agent configuration.
     */
	readonly userOptIn: boolean;

    /**
     * Activates a privacy mode especially for Touchables and Buttons. Setting this option to true
     * means that a name for the control will no longer be shown, e.g. "Touch on Button".
     * When setting a dtActionName onto the component this setting will be ignored. By default this value is false,
     * if nothing is passed.
     */
	readonly actionNamePrivacy: boolean;

    /**
     * Will define the bundle name which will prefix internal action ids.
     */
    readonly bundleName?: string;
}

/**
 * Builder for Manual startup configuration which is used for Dynatrace.start()
 */
export declare class ConfigurationBuilder {

	/**
	 * Creates a builder for Manual Startup configuration
	 * 
	 * @param {string} beaconUrl Identifies your environment within Dynatrace. This property is mandatory for manual startup
	 * @param {string} applicationId Identifies your mobile app. This property is mandatory for manual startup
	 */
	constructor(beaconUrl: string, applicationId: string);

	/**
	 * Builder function to handle crash reporting property
	 *
	 * @param {boolean} reportCrash Allows reporting React Native crashes.     
	 */
	public withCrashReporting(reportCrash: boolean): ConfigurationBuilder;

	/**
	 * Builder function to handle loglevel property
	 *
	 * @param {LogLevel} logLevel Allows you to choose between `LogLevel.Info` and `LogLevel.Debug`. Debug returns more logs. This is especially important when something is not functioning correctly.
	 */
	public withLogLevel(logLevel: LogLevel): ConfigurationBuilder;

	/**
	 * Builder function to handle lifecycle update property
	 *
	 * @param {boolean} lifecycleUpdate Decide if you want to see update cycles on lifecycle actions as well. This is per default false as it creates a lot more actions.
	 */
	public withLifecycleUpdate(lifecycleUpdate: boolean): ConfigurationBuilder

	/**
	 * Builder function to handle user opt in property
	 *
	 * @param {boolean} userOptIn Activates the privacy mode when set to `true`. User consent must be queried and set.
	 */
	public withUserOptIn(userOptIn: boolean): ConfigurationBuilder;

	/**
	 * Builder function to handle action name privacy property
	 * 
	 * @param {boolean} actionNamePrivacy Activates a privacy mode especially for Touchables and Buttons. Setting this option to true means that a name for the control will no longer be shown, e.g. "Touch on Button". When setting a dtActionName onto the component this setting will be ignored.
	 */
	public withActionNamePrivacy(actionNamePrivacy: boolean): ConfigurationBuilder;

	/**
	 * Builder function to handle bundle name property
	 *
	 * @param {string} bundleName Will define the bundle name which will prefix internal action ids.
	 */
	public withBundleName(bundleName: string): ConfigurationBuilder;

	/**
	 * Build configuration which is used for startup
	 */
	public buildConfiguration(): IConfiguration;
}