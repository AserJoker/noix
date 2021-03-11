"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var typescript_1 = __importDefault(require("typescript"));
var fs_1 = __importDefault(require("fs"));
var path_1 = __importDefault(require("path"));
var parseArgument = function () {
    var result = {};
    var key = 'inputFile';
    process.argv.splice(2).forEach(function (arg) {
        if (arg.startsWith('--')) {
            key = arg.substr(2);
            result[key] = '';
        }
        else {
            result[key] = arg;
            key = 'inputFile';
        }
    });
    return result;
};
var config = parseArgument();
if (config.version !== undefined) {
    console.log('v0.0.1');
    process.exit(0);
}
if (!config.inputFile) {
    console.log('no input file');
    process.exit(0);
}
if (!config.inputFile.endsWith('.ts')) {
    console.log('input file is not typescript file');
    process.exit(0);
}
if (!config.outFile) {
    config.outFile = config.inputFile
        .split('.')
        .map(function (t, index, arr) { return (index === arr.length - 1 ? 'js' : t); })
        .join('.');
}
var source = fs_1.default.readFileSync(config.inputFile).toString();
var tsconfigString = fs_1.default
    .readFileSync(config.tsconfig || path_1.default.resolve(process.cwd(), 'tsconfig.json'))
    .toString();
var reg = /("([^\\"]*(\\.)?)*")|('([^\\']*(\\.)?)*')|(\/{2,}.*?(\r|\n|$))|(\/\*(\n|.)*?\*\/)/g;
var tsconfig = JSON.parse(tsconfigString.replace(reg, function (word) {
    return /^\/{2,}/.test(word) || /^\/\*/.test(word) ? '' : word;
}));
var tscPlusConfig;
try {
    tscPlusConfig = require(path_1.default.resolve(process.cwd(), 'single-tsc.js'));
}
catch (e) {
    console.log('no config file');
    console.error(e);
    process.exit(0);
}
var result = typescript_1.default.transpileModule(source, __assign(__assign({}, tsconfig), { fileName: config.inputFile, transformers: tscPlusConfig.transformers }));
fs_1.default.writeFileSync(config.outFile, result.outputText);
result.sourceMapText &&
    fs_1.default.writeFileSync(config.outFile + '.map', result.sourceMapText);
//# sourceMappingURL=main.js.map