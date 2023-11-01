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
const TerminalReporter = require('metro/src/lib/TerminalReporter');
const { Terminal } = require('metro-core');
const files = require('../scripts/FileOperationHelper');
const paths = require('../scripts/PathsConstants');
const reporter = new TerminalReporter(new Terminal(process.stdout));
const update = (event) => __awaiter(void 0, void 0, void 0, function* () {
    if (event != null) {
        if (event.type === 'transform_cache_reset') {
            try {
                yield files.default.deleteDirectory(paths.default.getBuildPath());
            }
            catch (e) {
            }
        }
    }
    reporter.update(event);
});
module.exports.update = update;
