import ts from 'typescript';
import fs from 'fs';
import path from 'path';
const parseArgument = () => {
  const result: Record<string, string> = {};
  let key = 'inputFile';

  process.argv.splice(2).forEach((arg) => {
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
    .map((t, index, arr) => (index === arr.length - 1 ? 'js' : t))
    .join('.');
}
const source = fs.readFileSync(config.inputFile).toString();
const tsconfigString = fs
  .readFileSync(config.tsconfig || path.resolve(process.cwd(), 'tsconfig.json'))
  .toString();
const reg = /("([^\\"]*(\\.)?)*")|('([^\\']*(\\.)?)*')|(\/{2,}.*?(\r|\n|$))|(\/\*(\n|.)*?\*\/)/g;

const tsconfig = JSON.parse(
  tsconfigString.replace(reg, function (word) {
    return /^\/{2,}/.test(word) || /^\/\*/.test(word) ? '' : word;
  })
);
let tscPlusConfig;
try {
  tscPlusConfig = require(path.resolve(process.cwd(), 'single-tsc.js'));
} catch (e) {
  console.log('no config file');
  console.error(e);
  process.exit(0);
}
const result = ts.transpileModule(source, {
  ...tsconfig,
  fileName: config.inputFile,
  transformers: tscPlusConfig.transformers
});
fs.writeFileSync(config.outFile, result.outputText);
result.sourceMapText &&
  fs.writeFileSync(config.outFile + '.map', result.sourceMapText);
