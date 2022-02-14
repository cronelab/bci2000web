// /**
//  * Class that controls websocket communication to and from BCI2000 (via [BCI2000Web](https://github.com/cronelab/bci2000web))
//  */
(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports", "./Operator", "./Data", "./Telnet"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.OperatorServer = exports.BCI2K_DataConnection = exports.BCI2K_OperatorConnection = void 0;
    var Operator_1 = require("./Operator");
    Object.defineProperty(exports, "BCI2K_OperatorConnection", { enumerable: true, get: function () { return Operator_1.default; } });
    var Data_1 = require("./Data");
    Object.defineProperty(exports, "BCI2K_DataConnection", { enumerable: true, get: function () { return Data_1.default; } });
    var Telnet_1 = require("./Telnet");
    Object.defineProperty(exports, "OperatorServer", { enumerable: true, get: function () { return Telnet_1.default; } });
});
//# sourceMappingURL=index.js.map