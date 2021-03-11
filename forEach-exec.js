const cp = require('child_process');
module.exports = {
  inputDir: './project/demo/src',
  outputDir: './project/demo/dist',
  ignore: ['node_modules'],
  exec: (input, output) => {
    if (input.endsWith('.ts')) {
      cp.exec(
        `node build-tools/single-tsc --inputFile ${input} --outFile ${(
          output + ''
        )
          .split('.')
          .map((s, index, arr) => {
            return index === arr.length - 1 ? 'js' : s;
          })
          .join('.')}`,
        (e, stdout, stderr) => {
          if (e) {
            throw e;
          }
          stdout !== '' && console.log(stdout);
          stderr !== '' && console.error(stderr);
        }
      );
    }
  }
};
