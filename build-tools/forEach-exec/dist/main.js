"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var path_1 = __importDefault(require("path"));
var fs_1 = __importDefault(require("fs"));
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
if (config.versioin) {
    console.log('v0.0.1');
}
var execConfig;
try {
    execConfig = require(path_1.default.resolve(process.cwd(), 'forEach-exec.js'));
    if (!execConfig.exec) {
        console.log('no exec function ');
    }
    if (!execConfig.inputDir) {
        console.log('no input dir');
    }
    if (!execConfig.outputDir) {
        console.log('no output dir');
    }
    var resolveDir_1 = function (p, o) {
        try {
            var pa = fs_1.default.readdirSync(p);
            pa.forEach(function (ele) {
                if (execConfig.ignore.includes(ele)) {
                    return;
                }
                var _p = path_1.default.resolve(p, ele);
                var _o = path_1.default.resolve(o, ele);
                var info = fs_1.default.statSync(_p);
                if (info.isDirectory()) {
                    if (!fs_1.default.existsSync(_o)) {
                        fs_1.default.mkdirSync(_o);
                    }
                    resolveDir_1(_p, _o);
                }
                else {
                    execConfig.exec(_p, _o);
                }
            });
        }
        catch (e) {
            console.error(e);
        }
    };
    try {
        if (!fs_1.default.existsSync(path_1.default.resolve(execConfig.outputDir))) {
            fs_1.default.mkdirSync(path_1.default.resolve(execConfig.outputDir));
        }
        resolveDir_1(execConfig.inputDir, execConfig.outputDir);
    }
    catch (e) {
        console.log(e);
    }
}
catch (e) {
    console.error('no forEach-exec.js file');
    console.log(e);
}
//# sourceMappingURL=main.js.map