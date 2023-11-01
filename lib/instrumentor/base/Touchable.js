"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TouchableHelper = void 0;
const ConfigurationHandler_1 = require("./configuration/ConfigurationHandler");
const TouchableHelper = (Dynatrace, Logger) => ({
    attachOnPress(longPress, props, children) {
        const origFunction = longPress && this._isLongPress(props)
            ? props.onLongPress
            : props.onPress;
        const nameOfAction = this._findActionName(props, children);
        const isButton = this._isPropsButton(props);
        return (event) => __awaiter(this, void 0, void 0, function* () {
            if (nameOfAction == null) {
                Logger.logDebug('TouchableHelper: Skipping creation of action as no name was found!');
                if (origFunction != null) {
                    yield origFunction(event);
                }
            }
            else if (!ConfigurationHandler_1.ConfigurationHandler.isConfigurationAvailable()) {
                Logger.logInfo('TouchableHelper: React Native plugin has not been started yet! Touch will not be reported!');
                if (origFunction != null) {
                    yield origFunction(event);
                }
            }
            else {
                let finalNameOfAction = nameOfAction;
                if (ConfigurationHandler_1.ConfigurationHandler.isActionNamePrivacyEnabled()) {
                    finalNameOfAction = isButton ? 'Button' : 'Touchable';
                }
                const action = Dynatrace.enterAutoAction(`Touch on ${finalNameOfAction}`);
                if (origFunction != null) {
                    yield origFunction(event);
                }
                action.leaveAction();
            }
        });
    },
    _findActionName(props, children) {
        if (this._isDynatraceProperties(props)) {
            return props.dtActionName;
        }
        else if (this._isPropsButton(props) && props.title != null) {
            return props.title;
        }
        else if (props.accessibilityLabel != null) {
            return props.accessibilityLabel;
        }
        else if (children != null &&
            children.length === 1 &&
            typeof children[0] === 'string') {
            return children[0];
        }
        else {
            return this._walkChildrenToFindText(children);
        }
    },
    _isPropsButton: (props) => props.title != null,
    _isImageButton: (props) => props.source != null,
    _isLongPress: (props) => props.onLongPress != null,
    _isImageURISourceType: (source) => source.uri != null,
    _isIconButton: (element) => {
        const type = element.type;
        return type != null && type.name === 'Icon';
    },
    _walkTreeToFindText(element) {
        if (element == null || element.props == null) {
            return null;
        }
        else if (this._isImageButton(element.props)) {
            if (this._isImageURISourceType(element.props.source)) {
                return 'Image Button: ' + element.props.source.uri;
            }
            else {
                return 'Image Button';
            }
        }
        else if (this._isIconButton(element) && element.props.name != null) {
            return 'Icon Button: ' + element.props.name;
        }
        return this._walkChildrenToFindText(element.props.children);
    },
    _walkChildrenToFindText(children) {
        if (typeof children === 'string') {
            return children;
        }
        else if (Array.isArray(children)) {
            for (const child of children) {
                if (this._isReactElement(child)) {
                    const name = this._walkTreeToFindText(child);
                    if (name != null) {
                        return name;
                    }
                }
            }
            return null;
        }
        else {
            return this._walkTreeToFindText(children);
        }
    },
    _isReactElement: (node) => node != null && node.props != null,
    _isDynatraceProperties: (properties) => properties.dtActionName !== undefined,
});
exports.TouchableHelper = TouchableHelper;
