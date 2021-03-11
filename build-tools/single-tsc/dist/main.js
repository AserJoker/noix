#!/usr/bin/env node
var __assign =
  (this && this.__assign) ||
  function () {
    __assign =
      Object.assign ||
      function (t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
          s = arguments[i];
          for (const p in s) {
            if (Object.prototype.hasOwnProperty.call(s, p)) {
              t[p] = s[p];
            }
          }
        }
        return t;
      };
    return __assign.apply(this, arguments);
  };
const __importDefault =
  (this && this.__importDefault) ||
  function (mod) {
    return mod && mod.__esModule ? mod : { default: mod };
  };
Object.defineProperty(exports, '__esModule', { value: true });
const typescript_1 = __importDefault(require('typescript'));
const fs_1 = __importDefault(require('fs'));
const path_1 = __importDefault(require('path'));
const parseArgument = function () {
  const result = {};
  let key = 'inputFile';
  process.argv.splice(2).forEach(function (arg) {
    if (arg.startsWith('--')) {
      key = arg.substr(2);
      result[key] = '';
    } else {
      result[key] = arg;
      key = 'inputFile';
    }
  });
  return result;
};
const config = parseArgument();
if (config.versioin) {
  console.log('v0.0.1');
}
if (!config.inputFile) {
  console.log('no input file');
}
if (!config.inputFile.endsWith('.ts')) {
  console.log('input file is not typescript file');
}
if (!config.outFile) {
  config.outFile = config.inputFile
    .split('.')
    .map(function (t, index, arr) {
      return index === arr.length - 1 ? 'js' : t;
    })
    .join('.');
}
const source = fs_1.default.readFileSync(config.inputFile).toString();
const tsconfigString = fs_1.default
  .readFileSync(
    config.tsconfig || path_1.default.resolve(process.cwd(), 'tsconfig.json')
  )
  .toString();
const reg = /("([^\\"]*(\\.)?)*")|('([^\\']*(\\.)?)*')|(\/{2,}.*?(\r|\n|$))|(\/\*(\n|.)*?\*\/)/g;
const tsconfig = JSON.parse(
  tsconfigString.replace(reg, function (word) {
    return /^\/{2,}/.test(word) || /^\/\*/.test(word) ? '' : word;
  })
);
let tscPlusConfig;
try {
  tscPlusConfig = require(path_1.default.resolve(
    process.cwd(),
    'single-tsc.js'
  ));
} catch (e) {
  console.log('no config file');
  console.error(e);
}
const result = typescript_1.default.transpileModule(
  source,
  __assign(__assign({}, tsconfig), {
    fileName: config.inputFile,
    transformers: tscPlusConfig.transformers
  })
);
fs_1.default.writeFileSync(config.outFile, result.outputText);
result.sourceMapText &&
  fs_1.default.writeFileSync(config.outFile + '.map', result.sourceMapText);
// # sourceMappingURL=main.js.map
