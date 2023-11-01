"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StringUtils = void 0;
exports.StringUtils = {
    isStringNullEmptyOrUndefined: (value) => !(value != null && value.length !== undefined && value.length > 0),
    isStringNullOrUndefined: (value) => value == null || value === undefined,
};
