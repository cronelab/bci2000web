"use strict";
// ======================================================================== //
//
// bci2k.js
// A javascript connector for BCI2000
//
// ======================================================================== //
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BCI2K_OperatorConnection = void 0;
const websocket_1 = require("websocket");
class BCI2K_OperatorConnection {
    constructor(address) {
        this.ondisconnect = () => { };
        this.onStateChange = (event) => { };
        this.websocket = null;
        this.state = "";
        this.address = address || undefined;
        this.latestIncomingData = "";
        this.msgID = 0;
        this.newData = () => { };
        this.responseBuffer = [];
    }
    connect(address) {
        return new Promise((resolve, reject) => {
            if (this.address === undefined) {
                this.address =
                    address || "ws://127.0.0.1:80" || `ws://{window.location.host}`;
            }
            this.websocket = new websocket_1.w3cwebsocket(this.address);
            this.websocket.onerror = (error) => reject(`Error connecting to BCI2000 at ${this.address}`);
            this.websocket.onclose = () => {
                console.log("Connection closed");
                this.ondisconnect();
            };
            this.websocket.onopen = () => resolve();
            this.websocket.onmessage = (event) => {
                let { opcode, id, response } = JSON.parse(event.data);
                switch (opcode) {
                    case "O":
                        this.responseBuffer.push({ id: id, response: response });
                        this.newData(response);
                        break;
                    default:
                        break;
                }
            };
        });
    }
    disconnect() {
        this.websocket.close();
    }
    connected() {
        return (this.websocket !== null && this.websocket.readyState === websocket_1.w3cwebsocket.OPEN);
    }
    execute(instruction) {
        if (this.connected()) {
            return new Promise((resolve, reject) => {
                this.msgID = this.msgID + 1;
                this.websocket.send(JSON.stringify({
                    opcode: "E",
                    id: this.msgID,
                    contents: instruction,
                }));
                this.newData = data => resolve(data);
            });
        }
        // Cannot execute if not connected
        return Promise.reject("Cannot execute instruction: not connected to BCI2000");
    }
    getVersion() {
        return __awaiter(this, void 0, void 0, function* () {
            let resp = yield this.execute("Version");
            return resp.split('\r')[0];
        });
    }
    showWindow() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.execute("Show Window");
        });
    }
    hideWindow() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.execute("Hide Window");
        });
    }
    startExecutable(executable) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.execute(`Start executable ${executable}`);
        });
    }
    startDummyRun() {
        return __awaiter(this, void 0, void 0, function* () {
            // await this.execute('Startup system');
            yield this.startExecutable('SignalGenerator');
            yield this.startExecutable('DummySignalProcessing');
            yield this.startExecutable('DummyApplication');
            // await this.execute("Set Config");
            // await this.execute("Start");
        });
    }
    setWatch(state, ip, port) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.execute("Add watch " + state + " at " + ip + ":" + port);
        });
    }
    resetSystem() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.execute("Reset System");
        });
    }
    setConfig() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.execute("Set Config");
        });
    }
    start() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.execute("Start");
        });
    }
    stop() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.execute("Stop");
        });
    }
    kill() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.execute("Exit");
        });
    }
    stateListen() {
        setInterval(() => __awaiter(this, void 0, void 0, function* () {
            let state = yield this.execute("GET SYSTEM STATE");
            if (state.trim() != this.state) {
                this.onStateChange(state.trim());
            }
        }), 1000);
    }
    getSubjectName() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.execute("Get Parameter SubjectName");
        });
    }
    getTaskName() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.execute("Get Parameter DataFile");
        });
    }
    setParameter(parameter) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.execute(`Set paramater ${parameter}`);
        });
    }
    setState(state) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.execute(`Set state ${state}`);
        });
    }
    //See https://www.bci2000.org/mediawiki/index.php/Technical_Reference:Parameter_Definition
    getParameters() {
        return __awaiter(this, void 0, void 0, function* () {
            let parameters = yield this.execute("List Parameters");
            let allData = parameters.split("\n");
            let data = {};
            let el;
            allData.forEach(line => {
                let descriptors = line.split("=")[0];
                let dataType = descriptors.split(" ")[1];
                let name = descriptors.split(" ")[2];
                let names = descriptors.split(" ")[0].split(":");
                names.forEach((x, i) => {
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
                            dataType,
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
                            dataType,
                            value: line.split("=")[1].split("//")[0].trim(),
                            comment: line.split("=")[1].split("//")[1]
                        };
                    }
                }
                else {
                    el[name] = {
                        dataType,
                        value: line.split("=")[1].split("//")[0].trim(),
                        comment: line.split("=")[1].split("//")[1]
                    };
                }
            });
            return data;
        });
    }
}
exports.BCI2K_OperatorConnection = BCI2K_OperatorConnection;
//# sourceMappingURL=BCI2K_OperatorConnection.js.map