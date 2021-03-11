"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.B = void 0;
var Ignore = function (target, name) { };
var B = /** @class */ (function () {
    function B() {
        if (this.FA) {
            this.FA();
        }
        if (this.FB) {
            this.FB();
        }
    }
    B.prototype.FA = function () {
        console.log('FA');
    };
    return B;
}());
exports.B = B;
// eslint-disable-next-line no-new
new B();
//# sourceMappingURL=main.js.map