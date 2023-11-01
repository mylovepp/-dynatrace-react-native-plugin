//
//  DynatraceRNBridge.h
//

#ifndef DynatraceRNBridge_h
#define DynatraceRNBridge_h

#import <React/RCTBridgeModule.h>
@import Dynatrace;


@interface DynatraceRNBridge : NSObject <RCTBridgeModule>
- (void) newAction:(NSString *)name key:(NSString *)key parentAction:(DTXAction *)parentAction;
- (DTXAction *) getAction:(NSString *)key;
- (BOOL) shouldWorkOnIosWithPlatform: (NSString *) platform;
@end

typedef enum : NSUInteger {
    DTXActionPlatformJavaScript = 1,
    DTXActionPlatformXamarin,
} DTXActionPlatformType;

@interface DTXAction (ExternalAgents)
+ (void)reportExternalCrashForPlatformType:(DTXActionPlatformType)platformType crashName:(NSString*)crashName reason:(NSString*)reason stacktrace:(NSString*)stacktrace;
+ (DTXAction*)integrateActionWithName:(NSString*)actionName;
+ (DTX_StatusCode)reportExternalErrorForPlatformType:(DTXActionPlatformType)platformType errorName:(NSString*)errorName errorValue:(NSString*)errorValue reason:(NSString*)reason stacktrace:(NSString*)stacktrace;
- (DTX_StatusCode)reportExternalErrorForPlatformType:(DTXActionPlatformType)platformType errorName:(NSString*)errorName errorValue:(NSString*)errorValue reason:(NSString*)reason stacktrace:(NSString*)stacktrace;
@end

@interface Dynatrace (Events)
+ (void)sendEventWithName:(NSString*)name attributes:(NSDictionary<NSString*,id>* _Nullable)attributes;
+ (void)sendBizEventWithType:(NSString *)type attributes:(NSDictionary<NSString *, id> *_Nullable)attributes;
@end

#endif /* DynatraceRNBridge_h */
