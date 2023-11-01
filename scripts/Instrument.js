#!/usr/bin/env node
'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
const InstrumentCall_1 = require("./core/InstrumentCall");
module.exports = (() => {
    (0, InstrumentCall_1.instrumentCommand)();
})();
