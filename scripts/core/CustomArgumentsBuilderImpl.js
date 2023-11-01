"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CustomArgumentsBuilderImpl = void 0;
const CustomArgumentsImpl_1 = require("./CustomArgumentsImpl");
class CustomArgumentsBuilderImpl {
    withConfigurationArgument(configurationPath) {
        this.configurationPath = configurationPath;
        return this;
    }
    withGradleArgument(gradlePath) {
        this.gradlePath = gradlePath;
        return this;
    }
    withPlistArgument(plistPath) {
        this.plistPath = plistPath;
        return this;
    }
    build() {
        return new CustomArgumentsImpl_1.CustomArgumentsImpl(this.configurationPath, this.gradlePath, this.plistPath);
    }
}
exports.CustomArgumentsBuilderImpl = CustomArgumentsBuilderImpl;
