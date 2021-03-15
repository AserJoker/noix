// const cp = require('child_process');
const { singleTSC } = require('single-tsc/dist/main');
const fs = require('fs');
module.exports = {
  inputDir: './src',
  outputDir: './dist',
  ignore: ['node_modules'],
  exec: (input, output) => {
    const inputFile = input + '';
    const outputFile = (output + '')
      .split('.')
      .map((s, index, arr) => {
        return index === arr.length - 1 ? 'js' : s;
      })
      .join('.');
    if (input.endsWith('.ts')) {
      singleTSC(['', '', '--inputFile', inputFile, '--outputFile', outputFile]);
    } else {
      const source = fs.readFileSync(inputFile);
      fs.writeFileSync(outputFile, source);
    }
  }
};
