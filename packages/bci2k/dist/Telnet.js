var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports", "telnet-client"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var telnet_client_1 = require("telnet-client");
    var OperatorServer = /** @class */ (function () {
        function OperatorServer() {
        }
        //? Connect to BCI2000's operator telnet port in order to send/receive operator commands.
        OperatorServer.prototype.connectTelnet = function (operator, app) {
            return __awaiter(this, void 0, void 0, function () {
                var connection, error_1;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            connection = new telnet_client_1.default();
                            // Cache new parameters in the operator process object
                            operator.telnet = null;
                            operator.commandQueue = [];
                            operator.executing = null;
                            connection.on('ready', function () { return (operator.telnet = connection); });
                            connection.on('timeout', function () { return (operator.executing = null); });
                            connection.on('close', function () { return process.exit(0); });
                            _a.label = 1;
                        case 1:
                            _a.trys.push([1, 3, , 4]);
                            //TODO configure this better
                            return [4 /*yield*/, connection.connect({
                                    host: '127.0.0.1',
                                    port: 3999,
                                    timeout: 1000,
                                    shellPrompt: '>',
                                    echoLines: 0,
                                    execTimeout: 30,
                                })];
                        case 2:
                            //TODO configure this better
                            _a.sent();
                            return [3 /*break*/, 4];
                        case 3:
                            error_1 = _a.sent();
                            console.log(error_1);
                            return [3 /*break*/, 4];
                        case 4: 
                        //!Fixes an idiotic race condition where the WS isn't set up until AFTER bci2000 connects
                        //!arbitrary time, in the future set this into the config.json
                        return [4 /*yield*/, new Promise(function (resolve) { return setTimeout(resolve, 2000); })];
                        case 5:
                            //!Fixes an idiotic race condition where the WS isn't set up until AFTER bci2000 connects
                            //!arbitrary time, in the future set this into the config.json
                            _a.sent();
                            //? Set up WebSocket handler
                            app.ws('/', function (ws) {
                                ws.on('message', function (message) {
                                    console.log(message);
                                    var msg = JSON.parse(message);
                                    msg.ws = ws;
                                    if (msg.opcode == 'E') {
                                        operator.commandQueue.push(msg);
                                    }
                                });
                                // emits on new datagram msg
                                // udpServer.on('message', (msg, info) => {
                                //     let msgBlock = msg.toString().split('\t');
                                //     let udpmsg = {
                                //         opcode: 'U',
                                //         id: null,
                                //         contents: msgBlock,
                                //     };
                                //     if (ws.readyState == 1) {
                                //         ws.send(JSON.stringify(udpmsg));
                                //     }
                                // });
                            });
                            // Start command execution loop
                            //?Every 20ms send info about connection state/listen for commands
                            (function syncCommunications() {
                                if (operator.commandQueue.length &&
                                    operator.telnet &&
                                    !operator.executing) {
                                    operator.executing = operator.commandQueue.shift();
                                    operator.telnet.exec(operator.executing.contents, function (err, response) {
                                        var ws = operator.executing.ws;
                                        var id = operator.executing.id;
                                        operator.executing = null;
                                        if (response != undefined) {
                                            try {
                                                var msg = {
                                                    opcode: 'O',
                                                    id: id,
                                                    contents: response.trim(),
                                                };
                                                ws.send(JSON.stringify(msg));
                                            }
                                            catch (e) {
                                                console.log(e);
                                                /* client stopped caring */
                                            }
                                        }
                                    });
                                }
                                setTimeout(syncCommunications, 20);
                            })();
                            return [2 /*return*/];
                    }
                });
            });
        };
        ;
        //? Checks to see if BCI2000's operator executable is running.
        OperatorServer.prototype.isRunning = function (win, exec) {
            return new Promise(function (resolve, reject) {
                var cmd = 'tasklist';
                var proc = win;
                exec(cmd, function (err, stdout, stderr) {
                    resolve(stdout.toLowerCase().indexOf(proc.toLowerCase()) > -1);
                });
            });
        };
        ;
        //? Launches BCI2000 on a particular telnet port in the foreground or background
        OperatorServer.prototype.launchOperator = function (operatorPath, spawn) {
            return __awaiter(this, void 0, void 0, function () {
                var operatorArgs, operator;
                return __generator(this, function (_a) {
                    operatorArgs = [
                        '--Telnet',
                        '*:' + 3999,
                        '--StartupIdle',
                        '--Title',
                        '--BCI2000Web',
                    ];
                    operator = spawn(operatorPath, operatorArgs) //, spawnParams);
                    ;
                    return [2 /*return*/, operator];
                });
            });
        };
        ;
        return OperatorServer;
    }());
    exports.default = OperatorServer;
});
//# sourceMappingURL=Telnet.js.map