package com.dynatrace.android.agent;

import static com.dynatrace.android.agent.DynatraceUtils.toHashMap;

import com.dynatrace.android.agent.conf.DynatraceConfigurationBuilder;
import com.dynatrace.android.agent.crash.PlatformType;
import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.bridge.ReadableMap;
import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.ReadableMapKeySetIterator;

import java.net.MalformedURLException;
import java.util.Hashtable;
import java.util.HashMap;
import java.util.Map;

import android.location.Location;

import org.json.JSONObject;

import com.dynatrace.android.agent.conf.DataCollectionLevel;
import com.dynatrace.android.agent.conf.UserPrivacyOptions;

public class DynatraceRNBridge extends ReactContextBaseJavaModule {
    
    private HashMap<String, WebRequestTiming> webTimings;
    private HashMap<String, DTXAction> actions;
    private static final String PLATFORM_ANDROID = "android";
    private static final String PLATFORM_IOS = "ios";
    private static final String DATA_COLLECTION_OFF = "OFF";
    private static final String DATA_COLLECTION_PERFORMANCE = "PERFORMANCE";
    private static final String DATA_COLLECTION_USERBEHAVIOR = "USER_BEHAVIOR";

    private static PrivateDTBridge _internal;

    public DynatraceRNBridge(ReactApplicationContext reactContext, PrivateDTBridge internal) {
        super(reactContext);
        webTimings = new HashMap<>();
        actions = new HashMap<>();
        _internal = internal;
    }

    @Override
    public String getName(){
        return "DynatraceBridge";
    }

    @Override
    public Map<String, Object> getConstants() {
        final Map<String, Object> constants = new HashMap<>();
        constants.put("PLATFORM_ANDROID", PLATFORM_ANDROID);
        constants.put("PLATFORM_IOS", PLATFORM_IOS);
        constants.put("DATA_COLLECTION_OFF", DATA_COLLECTION_OFF);
        constants.put("DATA_COLLECTION_PERFORMANCE", DATA_COLLECTION_PERFORMANCE);
        constants.put("DATA_COLLECTION_USERBEHAVIOR", DATA_COLLECTION_USERBEHAVIOR);
        return constants;
    }

    @ReactMethod
    public void start(ReadableMap configuration) throws Exception {
        if (configuration == null) {
            throw new Exception("Configuration is empty for manual startup! This is not possible");
        } else {
            if(configuration.getString("applicationId") == null || configuration.getString("beaconUrl") == null){
                throw new Exception("applicationId and beaconUrl can't be empty!");
            }

            DynatraceConfigurationBuilder builder = new DynatraceConfigurationBuilder(configuration.getString("applicationId"),
                configuration.getString("beaconUrl"));

            builder.withUserOptIn(configuration.getBoolean("userOptIn"));
            builder.withCrashReporting(configuration.getBoolean("reportCrash"));
            // 0 == Debug / 1 == Info
            builder.withDebugLogging(configuration.getInt("logLevel") == 0);

            Dynatrace.startup(getReactApplicationContext(), builder.buildConfiguration());
        } 
    }

    //
    // Expects a key which is generated in JS. This is to circumvent the async callback system.
    //
    @ReactMethod
    public void enterAction(String name, String key, String platform) {
        if (this.shouldWorkOnAndroid(platform)) {
            try {
                newAction(name, key);
            }
            catch (Exception e) {}
        }
    }

    @ReactMethod
    public void enterManualAction(String name, String key, String platform) {
        if (this.shouldWorkOnAndroid(platform)) {
			actions.put(key, Dynatrace.enterAction(name));
        }
    }

    @ReactMethod
    public void enterManualActionWithParent(String name, String key, String parentKey, String platform) {
		if (this.shouldWorkOnAndroid(platform)) {
			DTXAction parent = actions.get(parentKey);

			if (parent != null) {
				actions.put(key, Dynatrace.enterAction(name, parent));
			} else {
				enterManualAction(name, key, platform);
			}
		}
	}

    @ReactMethod
    public void leaveAction(String key, boolean leave, String platform) {
        if (this.shouldWorkOnAndroid(platform)) {
            DTXAction action = getAction(key);
            if (action == null) return;
            if (action instanceof DTXAutoAction){
                ((DTXAutoAction) action).startTimer();
            }else{
                action.leaveAction();
            }

            actions.remove(key);
        }
    }

    @ReactMethod
    public void cancelAction(String key, String platform) {
        if (this.shouldWorkOnAndroid(platform)) {
            DTXAction action = getAction(key);
            if (action == null) return;
            action.cancel();
            actions.remove(key);
        }
    }

    @ReactMethod
    public void endVisit(String platform) {
        if (this.shouldWorkOnAndroid(platform)) {
            Dynatrace.endVisit();
        }
    }

    @ReactMethod
    public void reportErrorWithoutStacktrace(String errorName, int errorCode, String platform) {
        if (this.shouldWorkOnAndroid(platform)) {
            Dynatrace.reportError(errorName, errorCode);
        }
    }

    /**
     * Reports a stacktrace
     * @param errorName Name of the Error - SyntaxError
     * @param errorValue Value of the Error
     * @param reason Reason for the Error
     * @param stacktrace Whole Stacktrace
     * @param platform Platform wise or both
     */
    @ReactMethod
    public void reportError(String errorName, String errorValue, String reason, String stacktrace, String platform){
        if (this.shouldWorkOnAndroid(platform)) {
            Dynatrace.reportError(PlatformType.CUSTOM, errorName, errorValue, reason, stacktrace);
        }
    }

    @ReactMethod
    public void reportCrash(String errorName, String reason, String stacktrace, boolean isRealError, boolean newSession, String platform){
        if (this.shouldWorkOnAndroid(platform)) {
            Dynatrace.reportCrash(isRealError ? PlatformType.JAVA_SCRIPT : PlatformType.CUSTOM, errorName, reason, stacktrace);
            if(newSession){
                Dynatrace.createNewSession();
            }     
        }
    }

    @ReactMethod
    public void reportErrorInAction(String key, String errorName, int errorCode, String platform) {
        if (this.shouldWorkOnAndroid(platform)) {
            DTXAction action = getAction(key);
            if (action == null) return;
            action.reportError(errorName, errorCode);
        }
    }

    @ReactMethod
    public void reportValue(String key, String valueName, String value, String platform) {
        if (this.shouldWorkOnAndroid(platform)) {
            DTXAction action = getAction(key);
            if (action == null) return;
            action.reportValue(valueName, value);
        }
    }

    @ReactMethod
    public void getRequestTag(String key, String url, Promise promise){
        DTXAction action = getAction(key);

        if (action == null){
            promise.resolve(Dynatrace.getRequestTag());
            return;
        };

        promise.resolve(action.getRequestTag());
    }

    @ReactMethod
    public void startWebRequestTiming(String requestTag, String url) {
        if (requestTag != null) {
            WebRequestTiming timing = Dynatrace.getWebRequestTiming(requestTag);
            if(timing != null){
                webTimings.put(requestTag, timing);
                timing.startWebRequestTiming();
            }
        }
    }
    
    @ReactMethod
    public void stopWebRequestTiming(String requestTag, String url, int responseCode, String responseMessage) {
        if (requestTag != null) {
            WebRequestTiming timing = webTimings.get(requestTag);
            if (timing != null) {
                try {
                    timing.stopWebRequestTiming(url, responseCode, responseMessage);
                    webTimings.remove(requestTag);
                } catch (MalformedURLException ex) {
                    // do nothing
                }
            }
        }
    }

    @ReactMethod
    public void identifyUser(String user, String plaform) {
        if (this.shouldWorkOnAndroid(plaform)) {
            Dynatrace.identifyUser(user);
        }
    }

    @ReactMethod
    public void reportEventInAction(String actionKey, String name, String platform) {
        if (this.shouldWorkOnAndroid(platform)) {
            DTXAction action = getAction(actionKey);
            if (action == null) return;
            action.reportEvent(name);
        }
    }

    @ReactMethod
    public void reportStringValueInAction(String actionKey, String name, String value, String platform) {
        if (this.shouldWorkOnAndroid(platform)) {
            DTXAction action = getAction(actionKey);
            if (action == null) return;
            action.reportValue(name, value);
        }
    }

    @ReactMethod
    public void reportIntValueInAction(String actionKey, String name, int value, String platform) {
        if (this.shouldWorkOnAndroid(platform)) {
            DTXAction action = getAction(actionKey);
            if (action == null) return;
            action.reportValue(name, value);
        }
    }

    @ReactMethod
    public void reportDoubleValueInAction(String actionKey, String name, double value, String platform) {
        if (this.shouldWorkOnAndroid(platform)) {
            DTXAction action = getAction(actionKey);
            if (action == null) return;
            action.reportValue(name, value);
        }
    }

    @ReactMethod
    public void sendEvent(String name, ReadableMap attributes, String platform) {
        if(this.shouldWorkOnAndroid(platform)) {
            Dynatrace.sendEvent(name, new JSONObject(toHashMap(attributes)));
        }
    }

    @ReactMethod
    public void sendBizEvent(String type, ReadableMap attributes, String platform) {
        if(this.shouldWorkOnAndroid(platform)) {
            Dynatrace.sendBizEvent(type, new JSONObject(toHashMap(attributes)));
        }
    }

    @ReactMethod
    public void setGPSLocation(double latitude, double longitude, String platform){
        if(this.shouldWorkOnAndroid(platform)){
            Location location = new Location("");
            location.setLatitude(latitude);
            location.setLongitude(longitude);
            Dynatrace.setGpsLocation(location);
        }
    }

    @ReactMethod
    public void flushEvents(String platform){
        if(this.shouldWorkOnAndroid(platform)){
            Dynatrace.flushEvents();
        }
    }

    @ReactMethod
    public void isCrashReportingOptedIn(String platform, Promise promise){
        if(this.shouldWorkOnAndroid(platform)){
            promise.resolve(Dynatrace.isCrashReportingOptedIn());
        }
    }

    @ReactMethod
    public void setCrashReportingOptedIn(boolean crashReporting, String platform){
        if(this.shouldWorkOnAndroid(platform)){
            Dynatrace.setCrashReportingOptedIn(crashReporting);
        }
    }

    @ReactMethod
    public void setDataCollectionLevel(String collectionLevel, String platform){
        if(this.shouldWorkOnAndroid(platform)){
            Dynatrace.setDataCollectionLevel(DataCollectionLevel.valueOf(collectionLevel));
        }
    }

    @ReactMethod
    public void getDataCollectionLevel(String platform, Promise promise){
        if(this.shouldWorkOnAndroid(platform)){
            DataCollectionLevel level = Dynatrace.getDataCollectionLevel();
            promise.resolve(level.name());
        }
    }

    @ReactMethod
    public void setBeaconHeaders(ReadableMap headers, String platform){
        if(this.shouldWorkOnAndroid(platform)){
            if (headers == null) {
                Dynatrace.setBeaconHeaders(null);
            } else {
                Map<String, String> beaconHeaders = new HashMap<>();
                ReadableMapKeySetIterator iterator = headers.keySetIterator();
                while (iterator.hasNextKey()) {
                    String currentKey = iterator.nextKey();
                    beaconHeaders.put(currentKey, headers.getString(currentKey));
                }
                Dynatrace.setBeaconHeaders(beaconHeaders);
            } 
        }
    }
    
    @ReactMethod
    public void applyUserPrivacyOptions(ReadableMap userPrivacyOptions, String platform){
        if(this.shouldWorkOnAndroid(platform)){
            UserPrivacyOptions.Builder optionsBuilder = UserPrivacyOptions.builder();
            optionsBuilder.withCrashReportingOptedIn(userPrivacyOptions.getBoolean("_crashReportingOptedIn"));
            optionsBuilder.withDataCollectionLevel(DataCollectionLevel.valueOf(userPrivacyOptions.getString("_dataCollectionLevel")));

            Dynatrace.applyUserPrivacyOptions(optionsBuilder
                .build()
            );
        }
    }

    @ReactMethod
    public void getUserPrivacyOptions(String platform, Promise promise){
        if(this.shouldWorkOnAndroid(platform)){
            UserPrivacyOptions options = Dynatrace.getUserPrivacyOptions();
            WritableMap privacyMap = Arguments.createMap();
            privacyMap.putString("dataCollectionLevel", String.valueOf(options.getDataCollectionLevel()));
            privacyMap.putBoolean("crashReportingOptedIn", options.isCrashReportingOptedIn());
            promise.resolve(privacyMap);
        }
    }

    private void newAction(String name, String key) throws Exception {
        if (name == null) throw new Exception("action name is null");
        actions.put(key, _internal.enterAction(name));
    }

    private DTXAction getAction(String key){
        return actions.get(key);
    }

    private Boolean shouldWorkOnAndroid(String platform) {
        return platform == null || platform.equals(PLATFORM_ANDROID) || platform.equals("");
    }

}
