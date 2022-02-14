(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var BCI2K_DataConnection = /** @class */ (function () {
        function BCI2K_DataConnection(address) {
            this.websocket = null;
            this.onconnect = function () { };
            this.onGenericSignal = function (data) { };
            this.onStateVector = function (data) { };
            this.onSignalProperties = function (data) { };
            this.onStateFormat = function (data) { };
            this.ondisconnect = function () { };
            this.onReceiveBlock = function () { };
            this.callingFrom = "";
            this.states = {};
            this.signal = null;
            this.signalProperties = null;
            this.stateFormat = null;
            this.stateVecOrder = null;
            this.SignalType = {
                INT16: 0,
                FLOAT24: 1,
                FLOAT32: 2,
                INT32: 3,
            };
            this.address = address;
            this.reconnect = true;
        }
        BCI2K_DataConnection.prototype.getNullTermString = function (dv) {
            var val = "";
            var count = 0;
            while (count < dv.byteLength) {
                var v = dv.getUint8(count);
                count++;
                if (v == 0)
                    break;
                val += String.fromCharCode(v);
            }
            return val;
        };
        BCI2K_DataConnection.prototype.connect = function (address) {
            var _this = this;
            var connection = this;
            if (connection.address === undefined)
                connection.address = address;
            return new Promise(function (resolve, reject) {
                connection.websocket = new WebSocket(connection.address);
                connection.websocket.binaryType = "arraybuffer";
                connection.websocket.onerror = function () {
                    // This will only execute if we err before connecting, since
                    // Promises can only get triggered once
                    reject("Error connecting to data source at " + connection.address);
                };
                connection.websocket.onopen = function () {
                    connection.onconnect();
                    console.log("Connected");
                    resolve();
                };
                connection.websocket.onclose = function (e) {
                    connection.ondisconnect();
                    setTimeout(function () {
                        console.log("Disconnected");
                        if (_this.reconnect != false) {
                            console.log("Reconnecting");
                            _this.connect("");
                        }
                    }, 1000);
                };
                connection.websocket.onmessage = function (event) {
                    connection._decodeMessage(event.data);
                };
            });
        };
        BCI2K_DataConnection.prototype.disconnect = function () {
            this.reconnect = false;
            this.websocket.close(1000, "disconnect called");
        };
        BCI2K_DataConnection.prototype.connected = function () {
            return this.websocket != null && this.websocket.readyState === WebSocket.OPEN;
        };
        BCI2K_DataConnection.prototype._decodeMessage = function (data) {
            var descriptor = new DataView(data, 0, 1).getUint8(0);
            switch (descriptor) {
                case 3:
                    var stateFormatView = new DataView(data, 1, data.byteLength - 1);
                    this._decodeStateFormat(stateFormatView);
                    break;
                case 4:
                    var supplement = new DataView(data, 1, 2).getUint8(0);
                    switch (supplement) {
                        case 1:
                            var genericSignalView = new DataView(data, 2, data.byteLength - 2);
                            this._decodeGenericSignal(genericSignalView);
                            break;
                        case 3:
                            var signalPropertyView = new DataView(data, 2, data.byteLength - 2);
                            this._decodeSignalProperties(signalPropertyView);
                            break;
                        default:
                            console.error("Unsupported Supplement: " + supplement.toString());
                            break;
                    }
                    this.onReceiveBlock();
                    break;
                case 5:
                    var stateVectorView = new DataView(data, 1, data.byteLength - 1);
                    this._decodeStateVector(stateVectorView);
                    break;
                default:
                    console.error("Unsupported Descriptor: " + descriptor.toString());
                    break;
            }
        };
        BCI2K_DataConnection.prototype._decodePhysicalUnits = function (unitstr) {
            var units;
            units = {};
            var unit = unitstr.split(" ");
            var idx = 0;
            units.offset = Number(unit[idx++]);
            units.gain = Number(unit[idx++]);
            units.symbol = unit[idx++];
            units.vmin = Number(unit[idx++]);
            units.vmax = Number(unit[idx++]);
            return units;
        };
        BCI2K_DataConnection.prototype._decodeSignalProperties = function (data) {
            var propstr = this.getNullTermString(data);
            // Bugfix: There seems to not always be spaces after '{' characters
            propstr = propstr.replace(/{/g, " { ");
            propstr = propstr.replace(/}/g, " } ");
            this.signalProperties = {};
            var prop_tokens = propstr.split(" ");
            var props = [];
            for (var i = 0; i < prop_tokens.length; i++) {
                if (prop_tokens[i].trim() === "")
                    continue;
                props.push(prop_tokens[i]);
            }
            var pidx = 0;
            this.signalProperties.name = props[pidx++];
            this.signalProperties.channels = [];
            if (props[pidx] === "{") {
                while (props[++pidx] !== "}")
                    this.signalProperties.channels.push(props[pidx]);
                pidx++; // }
            }
            else {
                var numChannels = parseInt(props[pidx++]);
                for (var i = 0; i < numChannels; i++)
                    this.signalProperties.channels.push((i + 1).toString());
            }
            this.signalProperties.elements = [];
            if (props[pidx] === "{") {
                while (props[++pidx] !== "}")
                    this.signalProperties.elements.push(props[pidx]);
                pidx++; // }
            }
            else {
                var numElements = parseInt(props[pidx++]);
                for (var i = 0; i < numElements; i++)
                    this.signalProperties.elements.push((i + 1).toString());
            }
            // Backward Compatibility
            this.signalProperties.numelements = this.signalProperties.elements.length;
            this.signalProperties.signaltype = props[pidx++];
            this.signalProperties.channelunit = this._decodePhysicalUnits(props.slice(pidx, (pidx += 5)).join(" "));
            this.signalProperties.elementunit = this._decodePhysicalUnits(props.slice(pidx, (pidx += 5)).join(" "));
            pidx++; // '{'
            this.signalProperties.valueunits = [];
            for (var i = 0; i < this.signalProperties.channels.length; i++)
                this.signalProperties.valueunits.push(this._decodePhysicalUnits(props.slice(pidx, (pidx += 5)).join(" ")));
            pidx++; // '}'
            this.onSignalProperties(this.signalProperties);
        };
        BCI2K_DataConnection.prototype._decodeStateFormat = function (data) {
            this.stateFormat = {};
            var formatStr = this.getNullTermString(data);
            var lines = formatStr.split("\n");
            for (var lineIdx = 0; lineIdx < lines.length; lineIdx++) {
                if (lines[lineIdx].trim().length === 0)
                    continue;
                var stateline = lines[lineIdx].split(" ");
                var name_1 = stateline[0];
                this.stateFormat[name_1] = {};
                this.stateFormat[name_1].bitWidth = parseInt(stateline[1]);
                this.stateFormat[name_1].defaultValue = parseInt(stateline[2]);
                this.stateFormat[name_1].byteLocation = parseInt(stateline[3]);
                this.stateFormat[name_1].bitLocation = parseInt(stateline[4]);
            }
            var vecOrder = [];
            for (var state in this.stateFormat) {
                var loc = this.stateFormat[state].byteLocation * 8;
                loc += this.stateFormat[state].bitLocation;
                vecOrder.push([state, loc]);
            }
            // Sort by bit location
            vecOrder.sort(function (a, b) { return (a[1] < b[1] ? -1 : a[1] > b[1] ? 1 : 0); });
            // Create a list of ( state, bitwidth ) for decoding state vectors
            this.stateVecOrder = [];
            for (var i = 0; i < vecOrder.length; i++) {
                var state = vecOrder[i][0];
                this.stateVecOrder.push([state, this.stateFormat[state].bitWidth]);
            }
            this.onStateFormat(this.stateFormat);
        };
        BCI2K_DataConnection.prototype._decodeGenericSignal = function (data) {
            var index = 0;
            var signalType = data.getUint8(index);
            index = index + 1;
            var nChannels = data.getUint16(index, true);
            index = index + 2;
            var nElements = data.getUint16(index, true);
            index = index + 2;
            index = index + data.byteOffset;
            var signalData = new DataView(data.buffer, index);
            var signal = [];
            for (var ch = 0; ch < nChannels; ++ch) {
                signal.push([]);
                for (var el = 0; el < nElements; ++el) {
                    switch (signalType) {
                        case this.SignalType.INT16:
                            signal[ch].push(signalData.getInt16((nElements * ch + el) * 2, true));
                            break;
                        case this.SignalType.FLOAT32:
                            signal[ch].push(signalData.getFloat32((nElements * ch + el) * 4, true));
                            break;
                        case this.SignalType.INT32:
                            signal[ch].push(signalData.getInt32((nElements * ch + el) * 4, true));
                            break;
                        case this.SignalType.FLOAT24:
                            // TODO: Currently Unsupported
                            signal[ch].push(0.0);
                            break;
                        default:
                            break;
                    }
                }
            }
            this.signal = signal;
            this.onGenericSignal(signal);
        };
        BCI2K_DataConnection.prototype._decodeStateVector = function (dv) {
            if (this.stateVecOrder == null)
                return;
            // Currently, states are maximum 32 bit unsigned integers
            // BitLocation 0 refers to the least significant bit of a byte in the packet
            // ByteLocation 0 refers to the first byte in the sequence.
            // Bits must be populated in increasing significance
            var i8Array = new Int8Array(dv.buffer);
            var firstZero = i8Array.indexOf(0);
            var secondZero = i8Array.indexOf(0, firstZero + 1);
            var decoder = new TextDecoder();
            var stateVectorLength = parseInt(decoder.decode(i8Array.slice(1, firstZero)));
            var numVectors = parseInt(decoder.decode(i8Array.slice(firstZero + 1, secondZero)));
            var index = secondZero + 1;
            var data = new DataView(dv.buffer, index);
            var states = {};
            for (var state in this.stateFormat) {
                states[state] = Array(numVectors).fill(this.stateFormat[state].defaultValue);
            }
            for (var vecIdx = 0; vecIdx < numVectors; vecIdx++) {
                var vec = new Uint8Array(data.buffer, data.byteOffset + vecIdx * stateVectorLength, stateVectorLength);
                var bits = [];
                for (var byteIdx = 0; byteIdx < vec.length; byteIdx++) {
                    bits.push((vec[byteIdx] & 0x01) !== 0 ? 1 : 0);
                    bits.push((vec[byteIdx] & 0x02) !== 0 ? 1 : 0);
                    bits.push((vec[byteIdx] & 0x04) !== 0 ? 1 : 0);
                    bits.push((vec[byteIdx] & 0x08) !== 0 ? 1 : 0);
                    bits.push((vec[byteIdx] & 0x10) !== 0 ? 1 : 0);
                    bits.push((vec[byteIdx] & 0x20) !== 0 ? 1 : 0);
                    bits.push((vec[byteIdx] & 0x40) !== 0 ? 1 : 0);
                    bits.push((vec[byteIdx] & 0x80) !== 0 ? 1 : 0);
                }
                for (var stateIdx = 0; stateIdx < this.stateVecOrder.length; stateIdx++) {
                    var fmt = this.stateFormat[this.stateVecOrder[stateIdx][0]];
                    var offset = fmt.byteLocation * 8 + fmt.bitLocation;
                    var val = 0;
                    var mask = 0x01;
                    for (var bIdx = 0; bIdx < fmt.bitWidth; bIdx++) {
                        if (bits[offset + bIdx])
                            val = (val | mask) >>> 0;
                        mask = (mask << 1) >>> 0;
                    }
                    states[this.stateVecOrder[stateIdx][0]][vecIdx] = val;
                }
            }
            this.onStateVector(states);
            this.states = states;
        };
        return BCI2K_DataConnection;
    }());
    exports.default = BCI2K_DataConnection;
});
//# sourceMappingURL=Data.js.map