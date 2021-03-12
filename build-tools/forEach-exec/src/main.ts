import path from 'path';
import fs from 'fs';
export const main = (argv: string[]) => {
  const parseArgument = () => {
    const result: Record<string, string> = {};
    let key = 'inputFile';

    argv.splice(2).forEach((arg) => {
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
  let execConfig: {
    inputDir: string;
    outputDir: string;
    exec: (input: string, output: string) => void;
    ignore: string[];
  };
  try {
    execConfig = require(path.resolve(
      process.cwd(),
      config.config || 'forEach-exec.js'
    ));
    if (!execConfig.exec) {
      console.log('no exec function ');
    }
    if (!execConfig.inputDir) {
      console.log('no input dir');
    }
    if (!execConfig.outputDir) {
      console.log('no output dir');
    }
    const resolveDir = (p: string, o: string) => {
      try {
        const pa = fs.readdirSync(p);
        pa.forEach((ele) => {
          if (execConfig.ignore.includes(ele)) {
            return;
          }
          const _p = path.resolve(p, ele);
          const _o = path.resolve(o, ele);
          const info = fs.statSync(_p);
          if (info.isDirectory()) {
            if (!fs.existsSync(_o)) {
              fs.mkdirSync(_o);
            }
            resolveDir(_p, _o);
          } else {
            execConfig.exec(_p, _o);
          }
        });
      } catch (e) {
        console.error(e);
      }
    };
    try {
      if (!fs.existsSync(path.resolve(execConfig.outputDir))) {
        fs.mkdirSync(path.resolve(execConfig.outputDir));
      }
      resolveDir(execConfig.inputDir, execConfig.outputDir);
    } catch (e) {
      console.log(e);
    }
  } catch (e) {
    console.error('no forEach-exec.js file');
    console.log(e);
  }
};
