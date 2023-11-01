package com.dynatrace.android.agent;

import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;

public class PrivateDTBridge extends ReactContextBaseJavaModule {

    public PrivateDTBridge(ReactApplicationContext reactContext) {
        super(reactContext);
    }

    @Override
    public String getName() {
        return "PrivateDTBridge";
    }

    /**
     * Helper method which should not be called.
     * @param name Action name
     * @return Action
     */
    @ReactMethod
    public DTXAction enterAction(String name) {
        return Dynatrace.integrateNewAction(name);
    }

}
