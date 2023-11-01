//
//  DynatraceRNBridge.m
//

#import "DynatraceRNBridge.h"
#import <Foundation/Foundation.h>
#import <CoreLocation/CoreLocation.h>

@implementation DynatraceRNBridge

NSMutableDictionary *actionDict;
NSMutableDictionary *webTimingsDict;

NSString *const PlatformAndroid = @"android";
NSString *const PlatformiOS = @"ios";
NSString *const DataCollectionOff = @"OFF";
NSString *const DataCollectionPerformance = @"PERFORMANCE";
NSString *const DataCollectionUserBehavior = @"USER_BEHAVIOR";

RCT_EXPORT_MODULE(DynatraceBridge);

- (id) init
{
  self = [super init];
  if (self) {
    actionDict = [[NSMutableDictionary alloc] init];
    webTimingsDict = [[NSMutableDictionary alloc] init];
  }
  return self;
}

- (NSDictionary *)constantsToExport
{
    return @{ @"PLATFORM_ANDROID" : PlatformAndroid,
              @"PLATFORM_IOS" : PlatformiOS,
              @"DATA_COLLECTION_OFF" : DataCollectionOff,
              @"DATA_COLLECTION_PERFORMANCE" : DataCollectionPerformance,
              @"DATA_COLLECTION_USERBEHAVIOR" : DataCollectionUserBehavior };
}

RCT_EXPORT_METHOD(start:(NSDictionary *) options)
{
    if (options == nil) {
        return;
    }
    
    NSMutableDictionary<NSString*, id> *properties = [[NSMutableDictionary alloc] init];
    
    if (options[@"applicationId"] != NULL) {
        properties[@"DTXApplicationID"] = options[@"applicationId"];
    }

    if (options[@"beaconUrl"] != NULL) {
        properties[@"DTXBeaconURL"] = options[@"beaconUrl"];
    }

    if (options[@"userOptIn"] != NULL && [[options valueForKey:@"userOptIn"] isEqual: @(YES)]) {
        properties[@"DTXUserOptIn"] = @YES;
    }
    
    if (options[@"reportCrash"] != NULL && [[options valueForKey:@"reportCrash"] isEqual: @(NO)]) {
        properties[@"DTXCrashReporting"] = @NO;
    }
    
    if (options[@"logLevel"] != NULL && [((NSNumber *) options[@"logLevel"]) intValue] == 0){
        properties[@"DTXLogLevel"] = @"ALL";
    }

    if (properties[@"DTXBeaconURL"] != NULL && properties[@"DTXApplicationID"] != NULL) {
        [Dynatrace startupWithConfig:properties];
    }
}

RCT_EXPORT_METHOD(enterAction:(NSString *)name key:(nonnull NSString *)key platform: (NSString *) platform)
{
  if ([self shouldWorkOnIosWithPlatform: platform])
  {
    [self newAction:name key:key parentAction:nil];
  }
}

RCT_EXPORT_METHOD(enterManualAction:(NSString *)name key:(nonnull NSString *)key platform: (NSString *) platform)
{
  if ([self shouldWorkOnIosWithPlatform: platform])
  {
    DTXAction *action = [DTXAction enterActionWithName:name];
    
    if (action)
    {
        [actionDict setObject:action forKey:key];
    }
  }
}

RCT_EXPORT_METHOD(enterManualActionWithParent:(NSString *)name key:(nonnull NSString *)key parentKey:(nonnull NSString *)parentKey platform: (NSString *) platform)
{
    if ([self shouldWorkOnIosWithPlatform: platform])
    {
        DTXAction *parentAction = [self getAction:parentKey];

        if (parentAction != nil)
        {
            DTXAction *childAction = [DTXAction enterActionWithName:name parentAction:parentAction];
            
            if (childAction)
            {
                [actionDict setObject:childAction forKey:key];
            }
        }
        else
        {
            [self enterManualAction:name key:key platform:platform];
        }
    }
}

RCT_EXPORT_METHOD(leaveAction:(nonnull NSString *)key leave: (BOOL) leave platform: (NSString *) platform)
{
    if ([self shouldWorkOnIosWithPlatform: platform])
    {
        DTXAction *action = [self getAction:key];
        if (action == nil) return;
        [actionDict removeObjectForKey:key];

        if(leave)
        {
            [action leaveAction];
        }
    }
}

RCT_EXPORT_METHOD(cancelAction:(nonnull NSString *)key platform: (NSString *) platform)
{
    if ([self shouldWorkOnIosWithPlatform: platform])
    {
        DTXAction *action = [self getAction:key];
        if (action == nil) return;
        [actionDict removeObjectForKey:key];
        [action cancelAction];
    }
}

RCT_EXPORT_METHOD(endVisit: (NSString *) platform)
{
    if ([self shouldWorkOnIosWithPlatform: platform])
    {
        [Dynatrace endVisit];
    }
}

RCT_EXPORT_METHOD(reportErrorWithoutStacktrace:(NSString *)errorName errorCode:(nonnull NSNumber *)errorCode platform: (NSString *) platform)
{
    if ([self shouldWorkOnIosWithPlatform: platform])
    {
        DTXAction *action = [DTXAction enterActionWithName:@"Error"];
        [action reportErrorWithName:errorName errorValue:[errorCode intValue]];
        [action leaveAction];
    }
}

RCT_EXPORT_METHOD(reportError:(NSString *)errorName errorValue:(NSString *)errorValue errorReason:(NSString *)errorReason stacktrace:(NSString *)stacktrace platform: (NSString *) platform)
{
    if ([self shouldWorkOnIosWithPlatform: platform])
    {
        [DTXAction reportExternalErrorForPlatformType:-1 errorName:errorName errorValue:errorValue reason:errorReason stacktrace:stacktrace];
    }
}

RCT_EXPORT_METHOD(reportCrash:(NSString *)errorName errorReason:(NSString *)errorReason stacktrace:(NSString *)stacktrace isRealError:(BOOL)isRealError newSession:(BOOL)newSession platform: (NSString *) platform)
{
    if ([self shouldWorkOnIosWithPlatform: platform])
    {
        if(isRealError){
            [DTXAction reportExternalCrashForPlatformType:DTXActionPlatformJavaScript crashName:errorName reason:errorReason stacktrace:stacktrace];
        }else{
            [DTXAction reportExternalCrashForPlatformType:-1 crashName:errorName reason:errorReason stacktrace:stacktrace];
        }
        
        // We ignore the newSession parameter and always end the session as the iOS agent has no troubles with this behavior
        [Dynatrace endVisit];
    }
}

RCT_EXPORT_METHOD(reportErrorInAction:(nonnull NSString *)key errorName:(NSString *)errorName errorCode:(nonnull NSNumber *)errorCode platform: (NSString *) platform)
{
    if ([self shouldWorkOnIosWithPlatform: platform])
    {
        DTXAction *action = [self getAction:key];
        if (action == nil)
            return;
        [action reportErrorWithName:errorName errorValue:[errorCode intValue]];
    }
}

RCT_EXPORT_METHOD(reportStringValueInAction:(nonnull NSString *)actionKey withName:(NSString *)name value: (NSString *)value platform: (NSString *) platform)
{
  if ([self shouldWorkOnIosWithPlatform: platform])
  {
    DTXAction *action = [self getAction:actionKey];
    if (action == nil) return;
    [action reportValueWithName:name stringValue:value];
  }
}

RCT_EXPORT_METHOD(reportIntValueInAction:(nonnull NSString *)actionKey withName:(NSString *)name value: (nonnull NSNumber *)value platform: (NSString *) platform)
{
  if ([self shouldWorkOnIosWithPlatform: platform])
  {
    DTXAction *action = [self getAction:actionKey];
    if (action == nil) return;
    [action reportValueWithName:name intValue:value.intValue];
  }
}

RCT_EXPORT_METHOD(reportDoubleValueInAction:(nonnull NSString *)actionKey withName:(NSString *)name value: (nonnull NSNumber *)value platform: (NSString *) platform)
{
  if ([self shouldWorkOnIosWithPlatform: platform])
  {
    DTXAction *action = [self getAction:actionKey];
    if (action == nil) return;
    [action reportValueWithName:name doubleValue:value.doubleValue];
  }
}

RCT_EXPORT_METHOD(getRequestTag:(nonnull NSString *)actionKey withUrl:(NSString *)url findEventsWithResolver:(RCTPromiseResolveBlock)resolve rejecter:(RCTPromiseRejectBlock)reject)
{
    DTXAction* action = [self getAction:actionKey];
    resolve([action getTagForURL:[NSURL URLWithString:url]]);
}

RCT_EXPORT_METHOD(startWebRequestTiming:(NSString*) requestTag url:(NSString*) url)
{
    if(requestTag != NULL && url != NULL){
        DTXWebRequestTiming* timing = [DTXWebRequestTiming getDTXWebRequestTiming:requestTag requestUrl:[NSURL URLWithString:url]];
        if (timing != NULL) {
            [webTimingsDict setObject:timing forKey:[NSString stringWithString:requestTag]];
            [timing startWebRequestTiming];
        }
    }
}

RCT_EXPORT_METHOD(stopWebRequestTiming:(NSString*) requestTag url:(NSString*)url responseCode:(nonnull NSNumber*) responseCode responseMessage:(NSString*)responseMessage)
{
    if(requestTag != NULL){
        DTXWebRequestTiming* timing = [webTimingsDict objectForKey:requestTag];
        if(timing){
            [timing stopWebRequestTiming:[responseCode stringValue]];
            [webTimingsDict removeObjectForKey:requestTag];
        }
    }
}

RCT_EXPORT_METHOD(identifyUser:(NSString *)user platform: (NSString *) platform)
{
    if ([self shouldWorkOnIosWithPlatform: platform])
    {
        [Dynatrace identifyUser:user];
    }
}

RCT_EXPORT_METHOD(reportEventInAction:(nonnull NSString *)actionKey withName: (NSString *)name platform: (NSString *) platform)
{
    if ([self shouldWorkOnIosWithPlatform: platform])
    {
        DTXAction *action = [self getAction:actionKey];
        if (action == nil) return;
        [action reportEventWithName: name];
    }
}

RCT_EXPORT_METHOD(sendEvent:(NSString *)name withAttributes:(NSDictionary<NSString*, id>*) attributes platform: (NSString *) platform)
{
    if ([self shouldWorkOnIosWithPlatform: platform])
    {
        [Dynatrace sendEventWithName:name attributes:attributes];
    }
}

RCT_EXPORT_METHOD(sendBizEvent:(NSString *)type withAttributes:(NSDictionary<NSString*, id>*) attributes platform: (NSString *) platform)
{
    if ([self shouldWorkOnIosWithPlatform: platform])
    {
        [Dynatrace sendBizEventWithType:type attributes:attributes];
    }
}

RCT_EXPORT_METHOD(setGPSLocation:(double)latitude andLongitude: (double)longitude platform: (NSString *) platform)
{
    if ([self shouldWorkOnIosWithPlatform: platform])
    {
        CLLocation *location = [[CLLocation alloc] initWithLatitude:latitude longitude:longitude];
        [Dynatrace setGpsLocation:location];
    }
}

RCT_EXPORT_METHOD(flushEvents:(NSString *) platform)
{
    if ([self shouldWorkOnIosWithPlatform: platform])
    {
        [Dynatrace flushEvents];
    }
}

RCT_EXPORT_METHOD(isCrashReportingOptedIn:(NSString *) platform findEventsWithResolver:(RCTPromiseResolveBlock)resolve rejecter:(RCTPromiseRejectBlock)reject)
{
    if ([self shouldWorkOnIosWithPlatform: platform])
    {
        if([Dynatrace crashReportingOptedIn]){
            resolve(@"true");
        }else{
            resolve(@"false");
        }
    }
}

RCT_EXPORT_METHOD(setCrashReportingOptedIn:(BOOL) crashReportingOptedIn platform: (NSString *) platform)
{
    if ([self shouldWorkOnIosWithPlatform: platform])
    {
        [Dynatrace setCrashReportingOptedIn:crashReportingOptedIn];
    }
}

RCT_EXPORT_METHOD(getDataCollectionLevel:(NSString *) platform findEventsWithResolver:(RCTPromiseResolveBlock)resolve rejecter:(RCTPromiseRejectBlock)reject)
{
    if ([self shouldWorkOnIosWithPlatform: platform])
    {
        int i = [Dynatrace dataCollectionLevel];
        
        if(i == DTX_DataCollectionUserBehavior){
            resolve(DataCollectionUserBehavior);
        }else if(i == DTX_DataCollectionPerformance){
            resolve(DataCollectionPerformance);
        }else{
            resolve(DataCollectionOff);
        }
    }
}

RCT_EXPORT_METHOD(setDataCollectionLevel:(nonnull NSString *) dataCollectionLevel platform: (NSString *) platform)
{
    if ([self shouldWorkOnIosWithPlatform: platform])
    {
        int dataCollectionLevelEnum;
        
        if([dataCollectionLevel isEqualToString: DataCollectionPerformance]){
            dataCollectionLevelEnum = DTX_DataCollectionPerformance;
        }else if([dataCollectionLevel isEqualToString: DataCollectionUserBehavior]){
            dataCollectionLevelEnum = DTX_DataCollectionUserBehavior;
        }else{
            dataCollectionLevelEnum = DTX_DataCollectionOff;
        }
        
        [Dynatrace setDataCollectionLevel:dataCollectionLevelEnum completion:^(BOOL successful) {
            // Do nothing - Not sure
        }];
    }
}

RCT_EXPORT_METHOD(setBeaconHeaders:(NSDictionary *) headers platform: (NSString *) platform)
{
    if ([self shouldWorkOnIosWithPlatform: platform])
    {
        if (!headers) {
            [Dynatrace setBeaconHeaders:nil];
        } else {
            [Dynatrace setBeaconHeaders:headers];
        }
    }
}

RCT_EXPORT_METHOD(getUserPrivacyOptions:(NSString *) platform findEventsWithResolver:(RCTPromiseResolveBlock)resolve rejecter:(RCTPromiseRejectBlock)reject)
{
    if ([self shouldWorkOnIosWithPlatform: platform])
    {
        id<DTXUserPrivacyOptions> privacyConfig = [Dynatrace userPrivacyOptions];
        NSString * level;
        
        if(privacyConfig.dataCollectionLevel == DTX_DataCollectionUserBehavior){
            level = DataCollectionUserBehavior;
        }else if(privacyConfig.dataCollectionLevel == DTX_DataCollectionPerformance){
            level = DataCollectionPerformance;
        }else{
            level = DataCollectionOff;
        }

        NSDictionary *privacyDict = @{@"dataCollectionLevel": level, @"crashReportingOptedIn": [NSNumber numberWithBool: privacyConfig.crashReportingOptedIn]};

        resolve(privacyDict);
    }
}

RCT_EXPORT_METHOD(applyUserPrivacyOptions:(NSDictionary *) userPrivacyOptions platform: (NSString *) platform)
{
    if ([self shouldWorkOnIosWithPlatform: platform])
    {
        id<DTXUserPrivacyOptions> privacyConfig = [Dynatrace userPrivacyOptions];
        
        if([[userPrivacyOptions valueForKey:@"_dataCollectionLevel"] isEqualToString: DataCollectionPerformance]){
            privacyConfig.dataCollectionLevel = DTX_DataCollectionPerformance;
        }else if([[userPrivacyOptions valueForKey:@"_dataCollectionLevel"] isEqualToString: DataCollectionUserBehavior]){
            privacyConfig.dataCollectionLevel = DTX_DataCollectionUserBehavior;
        }else if([[userPrivacyOptions valueForKey:@"_dataCollectionLevel"] isEqualToString: DataCollectionOff]){
            privacyConfig.dataCollectionLevel = DTX_DataCollectionOff;
        } else {
            // do nothing and keep current value
        }
        
        if ([[userPrivacyOptions valueForKey:@"_crashReportingOptedIn"] isEqual: @(YES)]) {
            privacyConfig.crashReportingOptedIn = YES;
        } else if ([[userPrivacyOptions valueForKey:@"_crashReportingOptedIn"]  isEqual: @(NO)]) {
            privacyConfig.crashReportingOptedIn = NO;
        } else {
            // do nothing and keep current value
        }

        [Dynatrace applyUserPrivacyOptions:privacyConfig completion:^(BOOL successful) {
            // do nothing with callback
        }];
    }
}

- (void) newAction:(NSString *)name key:(nonnull NSString *)key parentAction:(DTXAction *)parentAction
{
    DTXAction *action = [DTXAction integrateActionWithName:name];
    
    if (action)
    {
        [actionDict setObject:action forKey:key];
    }
}

- (DTXAction *) getAction:(nonnull NSString *)key
{
  return [actionDict objectForKey:key];
}


+ (BOOL)requiresMainQueueSetup
{
  return YES;
}

- (BOOL) shouldWorkOnIosWithPlatform: (NSString *) platform
{
    return platform == nil || [platform isEqualToString:PlatformiOS] || [platform isEqualToString:@""];
}

@end