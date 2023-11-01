"use strict";
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.babelParser = void 0;
const babel = require("@babel/parser");
const babelParser = (parser) => ({
    parse: (source, options) => {
        const ast = babel.parse(source, getParserOptions(parser));
        if (isASTNode(ast)) {
            return ast;
        }
        throw new Error('This is not an AST Node!');
    },
});
exports.babelParser = babelParser;
const getParserOptions = (parser) => {
    switch (parser) {
        case '.ts':
            return defaultOptionsTs;
        case '.tsx':
            return defaultOptionsTsx;
        default:
            return defaultOptions;
    }
};
const defaultOptionsTs = require('jscodeshift/parser/tsOptions.js');
const defaultOptionsTsx = JSON.parse(JSON.stringify(require('jscodeshift/parser/tsOptions.js')));
(_a = defaultOptionsTsx.plugins) === null || _a === void 0 ? void 0 : _a.push('jsx');
const defaultOptions = {
    sourceType: 'module',
    allowImportExportEverywhere: true,
    allowReturnOutsideFunction: true,
    startLine: 1,
    tokens: true,
    plugins: [
        ['flow', { all: true }],
        'jsx',
        'asyncGenerators',
        'bigInt',
        'classProperties',
        'classPrivateProperties',
        'classPrivateMethods',
        ['decorators', { decoratorsBeforeExport: true }],
        'doExpressions',
        'dynamicImport',
        'exportDefaultFrom',
        'exportNamespaceFrom',
        'functionBind',
        'functionSent',
        'importMeta',
        'nullishCoalescingOperator',
        'numericSeparator',
        'objectRestSpread',
        'optionalCatchBinding',
        'optionalChaining',
        ['pipelineOperator', { proposal: 'minimal' }],
        'throwExpressions',
    ],
};
const isASTNode = (ast) => ast.type != null;
