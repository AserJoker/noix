"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createTSIgnoreDecoratorTanstormer = void 0;
var typescript_1 = __importDefault(require("typescript"));
var createTSIgnoreDecoratorTanstormer = function (decorator) {
    if (decorator === void 0) { decorator = '@Ignore'; }
    return function (context) {
        var visit = function (node) {
            if (typescript_1.default.isClassLike(node)) {
                if (node.decorators &&
                    node.decorators.find(function (d) { return d.getText() === decorator; })) {
                    return undefined;
                }
            }
            if (typescript_1.default.isClassElement(node)) {
                if (node.decorators &&
                    node.decorators.find(function (d) { return d.getText() === decorator; })) {
                    return undefined;
                }
            }
            return typescript_1.default.visitEachChild(node, visit, context);
        };
        return function (node) { return typescript_1.default.visitNode(node, visit); };
    };
};
exports.createTSIgnoreDecoratorTanstormer = createTSIgnoreDecoratorTanstormer;
//# sourceMappingURL=main.js.map