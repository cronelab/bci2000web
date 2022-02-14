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
        define(["require", "exports", "websocket"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var websocket_1 = require("websocket");
    var BCI2K_OperatorConnection = /** @class */ (function () {
        function BCI2K_OperatorConnection(address) {
            // this.ondisconnect = () => { };
            // this.onconnect = () => { };
            this.onStateChange = function (event) { };
            this.onWatchReceived = function (event) { };
            this.client = null;
            this._execid = 0;
            this._exec = {};
            this.state = "";
            this.address = address;
        }
        /**
         *
         * @param address address to bci2000web
         * @returns promise void
         */
        BCI2K_OperatorConnection.prototype.connect = function (address) {
            var _this = this;
            if (this.address === undefined)
                this.address = address;
            return new Promise(function (resolve, reject) {
                _this.client = new websocket_1.w3cwebsocket(_this.address);
                console.log(_this);
                _this.client.onerror = function (error) {
                    // This will only execute if we err before connecting, since
                    // Promises can only get triggered once
                    reject("Error connecting to BCI2000 at " + _this.address + " due to " + error);
                };
                _this.client.onopen = function () {
                    // this.onconnect();
                    console.log("Connected");
                    resolve();
                };
                _this.client.onclose = function () {
                    console.log("Disconnected");
                    // this.ondisconnect();
                    // this.websocket.close();
                };
                _this.client.onmessage = function (event) {
                    var _a = JSON.parse(event.data), opcode = _a.opcode, id = _a.id, contents = _a.contents;
                    switch (opcode) {
                        case "O": // OUTPUT: Received output from command
                            _this._exec[id](contents);
                            delete _this._exec[id];
                            break;
                        case "U":
                            var _id = contents.shift();
                            contents[contents.length - 1].trim();
                            _this.onWatchReceived(contents);
                        default:
                            break;
                    }
                };
            });
        };
        BCI2K_OperatorConnection.prototype.disconnect = function () {
            this.client.close();
        };
        // /**
        //  * @deprecated
        //  */
        // public tap(location: string) {
        //     let connection = this;
        //     let locationParameter = "WS" + location + "Server";
        //     return this.execute("Get Parameter " + locationParameter).then(
        //         (location: string) => {
        //             if (location.indexOf("does not exist") >= 0) {
        //                 return Promise.reject("Location parameter does not exist");
        //             }
        //             if (location === "") {
        //                 return Promise.reject("Location parameter not set");
        //             }
        //             let dataConnection = new BCI2K_DataConnection();
        //             // Use our address plus the port from the result
        //             return dataConnection
        //                 .connect(connection.address + ":" + location.split(":")[1])
        //                 .then((event) => {
        //                     // To keep with our old API, we actually want to wrap the
        //                     // dataConnection, and not the connection event
        //                     // TODO This means we can't get the connection event!
        //                     return dataConnection;
        //                 });
        //         }
        // );
        // }
        BCI2K_OperatorConnection.prototype.connected = function () {
            return (this.client !== null && this.client.readyState === websocket_1.w3cwebsocket.OPEN);
        };
        BCI2K_OperatorConnection.prototype.execute = function (instruction) {
            var _this = this;
            if (this.connected()) {
                return new Promise(function (resolve, reject) {
                    var id = (++_this._execid).toString();
                    // TODO Properly handle errors from BCI2000
                    _this._exec[id] = function (exec) { return resolve(exec); };
                    _this.client.send(JSON.stringify({
                        opcode: "E",
                        id: id,
                        contents: instruction,
                    }));
                });
            }
            // Cannot execute if not connected
            return Promise.reject("Cannot execute instruction: not connected to BCI2000");
        };
        /**
         * shows current BCI2000 version
         */
        // getVersion() {
        //     this.execute("Version").then((x: string) => console.log(x.split(" ")[1]));
        // }
        BCI2K_OperatorConnection.prototype.showWindow = function () {
            return this.execute("Show Window");
        };
        BCI2K_OperatorConnection.prototype.hideWindow = function () {
            return this.execute("Hide Window");
        };
        BCI2K_OperatorConnection.prototype.setWatch = function (state, ip, port) {
            return this.execute("Add watch " + state + " at " + ip + ":" + port);
        };
        /**
         * [BCI2000 documentation](https://www.bci2000.org/mediawiki/index.php/User_Reference:Operator_Module_Scripting#RESET_SYSTEM)
         * @returns
         */
        BCI2K_OperatorConnection.prototype.resetSystem = function () {
            return this.execute("Reset System");
        };
        BCI2K_OperatorConnection.prototype.setConfig = function () {
            return this.execute("Set Config");
        };
        BCI2K_OperatorConnection.prototype.start = function () {
            return this.execute("Start");
        };
        BCI2K_OperatorConnection.prototype.stop = function () {
            return this.execute("Stop");
        };
        BCI2K_OperatorConnection.prototype.kill = function () {
            return this.execute("Exit");
        };
        /**
         * @deprecated in favor of BCI2000 watches
         */
        BCI2K_OperatorConnection.prototype.stateListen = function () {
            var _this = this;
            setInterval(function () {
                _this.execute("GET SYSTEM STATE").then(function (state) {
                    if (state.trim() != _this.state) {
                        _this.onStateChange(state.trim());
                        _this.state = state.trim();
                    }
                });
            }, 500);
        };
        BCI2K_OperatorConnection.prototype.getSubjectName = function () {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.execute("Get Parameter SubjectName")];
                        case 1: 
                        //Promise<string> {
                        return [2 /*return*/, _a.sent()];
                    }
                });
            });
        };
        BCI2K_OperatorConnection.prototype.getTaskName = function () {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.execute("Get Parameter DataFile")];
                        case 1: return [2 /*return*/, _a.sent()];
                    }
                });
            });
        };
        //See https://www.bci2000.org/mediawiki/index.php/Technical_Reference:Parameter_Definition
        BCI2K_OperatorConnection.prototype.getParameters = function () {
            return __awaiter(this, void 0, void 0, function () {
                var parameters, allData, data, el;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.execute("List Parameters")];
                        case 1:
                            parameters = _a.sent();
                            allData = parameters.split("\n");
                            data = {};
                            allData.forEach(function (line) {
                                var descriptors = line.split("=")[0];
                                var dataType = descriptors.split(" ")[1];
                                var name = descriptors.split(" ")[2];
                                var names = descriptors.split(" ")[0].split(":");
                                names.forEach(function (x, i) {
                                    switch (i) {
                                        case 0: {
                                            if (data[names[0]] == undefined) {
                                                data[names[0]] = {};
                                            }
                                            el = data[names[0]];
                                            break;
                                        }
                                        case 1: {
                                            if (data[names[0]][names[1]] == undefined) {
                                                data[names[0]][names[1]] = {};
                                            }
                                            el = data[names[0]][names[1]];
                                            break;
                                        }
                                        case 2: {
                                            if (data[names[0]][names[1]][names[2]] == undefined) {
                                                data[names[0]][names[1]][names[2]] = {};
                                            }
                                            el = data[names[0]][names[1]][names[2]];
                                            break;
                                        }
                                        default: { }
                                    }
                                });
                                if (dataType != "matrix") {
                                    if (line.split("=")[1].split("//")[0].trim().split(" ").length == 4) {
                                        el[name] = {
                                            dataType: dataType,
                                            value: {
                                                value: line.split("=")[1].split("//")[0].trim().split(" ")[0],
                                                defaultValue: line.split("=")[1].split("//")[0].trim().split(" ")[1],
                                                low: line.split("=")[1].split("//")[0].trim().split(" ")[2],
                                                high: line.split("=")[1].split("//")[0].trim().split(" ")[3],
                                            },
                                            comment: line.split("=")[1].split("//")[1]
                                        };
                                    }
                                    else {
                                        el[name] = {
                                            dataType: dataType,
                                            value: line.split("=")[1].split("//")[0].trim(),
                                            comment: line.split("=")[1].split("//")[1]
                                        };
                                    }
                                }
                                else {
                                    el[name] = {
                                        dataType: dataType,
                                        value: line.split("=")[1].split("//")[0].trim(),
                                        comment: line.split("=")[1].split("//")[1]
                                    };
                                }
                            });
                            return [2 /*return*/, data];
                    }
                });
            });
        };
        return BCI2K_OperatorConnection;
    }());
    exports.default = BCI2K_OperatorConnection;
});
//# sourceMappingURL=Operator.js.map