"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DynatraceClassWrapper = exports.DynatraceFnWrapper = void 0;
const react_1 = require("react");
const ConfigurationHandler_1 = require("../instrumentor/base/configuration/ConfigurationHandler");
const Logger_1 = require("../instrumentor/base/Logger");
const NullAction_1 = require("../instrumentor/base/NullAction");
const Dynatrace_1 = require("../instrumentor/base/Dynatrace");
const DynatraceFnWrapper = (props) => {
    const componentName = getNameFromComponent(props);
    const action = Dynatrace_1.Dynatrace.enterAutoAction(`Render ${componentName}`);
    if (action instanceof NullAction_1.NullAction) {
        Logger_1.Logger.logInfo(`Component ${componentName}: React Native plugin has not been started yet! Component will not be reported!`);
    }
    (0, react_1.useEffect)(() => {
        action.leaveAction();
    });
    return props.children;
};
exports.DynatraceFnWrapper = DynatraceFnWrapper;
class DynatraceClassWrapper extends react_1.Component {
    constructor(props) {
        super(props);
        this.wrappingName = getNameFromComponent(props);
        this.componentMounted = false;
    }
    render() {
        if (!ConfigurationHandler_1.ConfigurationHandler.isConfigurationAvailable()) {
            Logger_1.Logger.logInfo(`Component ${this.wrappingName}: React Native plugin has not been started yet! Component will not be reported!`);
        }
        else {
            if ((this.componentMounted && ConfigurationHandler_1.ConfigurationHandler.isLifecycleUpdateEnabled()) ||
                !this.componentMounted) {
                const actionPrefix = !this.componentMounted ? 'Render ' : 'Update ';
                this.internalAction = Dynatrace_1.Dynatrace.enterAutoAction(actionPrefix + this.wrappingName);
            }
        }
        return this.props.children;
    }
    componentWillUnmount() {
        this.componentMounted = false;
    }
    componentDidUpdate() {
        this.reportFunctionEvent('componentDidUpdate()');
    }
    componentDidMount() {
        this.componentMounted = true;
        this.reportFunctionEvent('componentDidMount()');
    }
    reportFunctionEvent(event) {
        if (this.internalAction !== undefined) {
            this.internalAction.reportEvent(`${this.wrappingName}.${event}`);
            this.internalAction.leaveAction();
            this.internalAction = undefined;
        }
    }
}
exports.DynatraceClassWrapper = DynatraceClassWrapper;
const getNameFromComponent = (props) => {
    if (props !== undefined && props.children !== undefined) {
        let child;
        if (Array.isArray(props.children) && props.children.length === 1) {
            child = props.children[0];
        }
        else {
            child = props.children;
        }
        if (child.props !== undefined && child.props.dtActionName !== undefined) {
            return child.props.dtActionName;
        }
        else if (child.type !== undefined) {
            if (child.type.displayName !== undefined) {
                return child.type.displayName;
            }
            else if (child.type._dtInfo !== undefined) {
                return child.type._dtInfo.name;
            }
            else {
                return child.type.name;
            }
        }
    }
    else {
        return 'Undefined Name';
    }
};
