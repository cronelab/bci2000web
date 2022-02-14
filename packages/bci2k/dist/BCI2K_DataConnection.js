"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BCI2K_DataConnection = void 0;
const websocket_1 = require("websocket");
class BCI2K_DataConnection {
    constructor(address) {
        this._socket = null;
        this.onconnect = () => { };
        this.onGenericSignal = (data) => { };
        this.onStateVector = (data) => { };
        this.onSignalProperties = (data) => { };
        this.onStateFormat = (data) => { };
        this.ondisconnect = () => { };
        this.onReceiveBlock = () => { };
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
    }
    getNullTermString(dv) {
        var val = "";
        let count = 0;
        while (count < dv.byteLength) {
            var v = dv.getUint8(count);
            count++;
            if (v == 0)
                break;
            val += String.fromCharCode(v);
        }
        return val;
    }
    connect(address, callingFrom) {
        let connection = this;
        if (connection.address === undefined)
            connection.address = address;
        this.callingFrom = callingFrom;
        return new Promise((resolve, reject) => {
            connection._socket = new websocket_1.w3cwebsocket(connection.address);
            connection._socket.binaryType = "arraybuffer";
            connection._socket.onerror = () => {
                // This will only execute if we err before connecting, since
                // Promises can only get triggered once
                reject("Error connecting to data source at " + connection.address);
            };
            connection._socket.onopen = () => {
                connection.onconnect();
                resolve();
            };
            connection._socket.onclose = () => {
                connection.ondisconnect();
                setTimeout(() => {
                    console.log("Disconnected");
                    this.connect("");
                }, 1000);
            };
            connection._socket.onmessage = (event) => {
                connection._decodeMessage(event.data);
            };
        });
    }
    connected() {
        return this._socket != null && this._socket.readyState === websocket_1.w3cwebsocket.OPEN;
    }
    _decodeMessage(data) {
        let descriptor = new DataView(data, 0, 1).getUint8(0);
        switch (descriptor) {
            case 3:
                let stateFormatView = new DataView(data, 1, data.byteLength - 1);
                this._decodeStateFormat(stateFormatView);
                break;
            case 4:
                let supplement = new DataView(data, 1, 2).getUint8(0);
                switch (supplement) {
                    case 1:
                        let genericSignalView = new DataView(data, 2, data.byteLength - 2);
                        this._decodeGenericSignal(genericSignalView);
                        break;
                    case 3:
                        let signalPropertyView = new DataView(data, 2, data.byteLength - 2);
                        this._decodeSignalProperties(signalPropertyView);
                        break;
                    default:
                        console.error("Unsupported Supplement: " + supplement.toString());
                        break;
                }
                this.onReceiveBlock();
                break;
            case 5:
                let stateVectorView = new DataView(data, 1, data.byteLength - 1);
                this._decodeStateVector(stateVectorView);
                break;
            default:
                console.error("Unsupported Descriptor: " + descriptor.toString());
                break;
        }
    }
    _decodePhysicalUnits(unitstr) {
        let units;
        units = {};
        let unit = unitstr.split(" ");
        let idx = 0;
        units.offset = Number(unit[idx++]);
        units.gain = Number(unit[idx++]);
        units.symbol = unit[idx++];
        units.vmin = Number(unit[idx++]);
        units.vmax = Number(unit[idx++]);
        return units;
    }
    _decodeSignalProperties(data) {
        let propstr = this.getNullTermString(data);
        // Bugfix: There seems to not always be spaces after '{' characters
        propstr = propstr.replace(/{/g, " { ");
        propstr = propstr.replace(/}/g, " } ");
        this.signalProperties = {};
        let prop_tokens = propstr.split(" ");
        let props = [];
        for (let i = 0; i < prop_tokens.length; i++) {
            if (prop_tokens[i].trim() === "")
                continue;
            props.push(prop_tokens[i]);
        }
        let pidx = 0;
        this.signalProperties.name = props[pidx++];
        this.signalProperties.channels = [];
        if (props[pidx] === "{") {
            while (props[++pidx] !== "}")
                this.signalProperties.channels.push(props[pidx]);
            pidx++; // }
        }
        else {
            let numChannels = parseInt(props[pidx++]);
            for (let i = 0; i < numChannels; i++)
                this.signalProperties.channels.push((i + 1).toString());
        }
        this.signalProperties.elements = [];
        if (props[pidx] === "{") {
            while (props[++pidx] !== "}")
                this.signalProperties.elements.push(props[pidx]);
            pidx++; // }
        }
        else {
            let numElements = parseInt(props[pidx++]);
            for (let i = 0; i < numElements; i++)
                this.signalProperties.elements.push((i + 1).toString());
        }
        // Backward Compatibility
        this.signalProperties.numelements = this.signalProperties.elements.length;
        this.signalProperties.signaltype = props[pidx++];
        this.signalProperties.channelunit = this._decodePhysicalUnits(props.slice(pidx, (pidx += 5)).join(" "));
        this.signalProperties.elementunit = this._decodePhysicalUnits(props.slice(pidx, (pidx += 5)).join(" "));
        pidx++; // '{'
        this.signalProperties.valueunits = [];
        for (let i = 0; i < this.signalProperties.channels.length; i++)
            this.signalProperties.valueunits.push(this._decodePhysicalUnits(props.slice(pidx, (pidx += 5)).join(" ")));
        pidx++; // '}'
        this.onSignalProperties(this.signalProperties);
    }
    _decodeStateFormat(data) {
        this.stateFormat = {};
        let formatStr = this.getNullTermString(data);
        let lines = formatStr.split("\n");
        for (let lineIdx = 0; lineIdx < lines.length; lineIdx++) {
            if (lines[lineIdx].trim().length === 0)
                continue;
            let stateline = lines[lineIdx].split(" ");
            let name = stateline[0];
            this.stateFormat[name] = {};
            this.stateFormat[name].bitWidth = parseInt(stateline[1]);
            this.stateFormat[name].defaultValue = parseInt(stateline[2]);
            this.stateFormat[name].byteLocation = parseInt(stateline[3]);
            this.stateFormat[name].bitLocation = parseInt(stateline[4]);
        }
        let vecOrder = [];
        for (let state in this.stateFormat) {
            let loc = this.stateFormat[state].byteLocation * 8;
            loc += this.stateFormat[state].bitLocation;
            vecOrder.push([state, loc]);
        }
        // Sort by bit location
        vecOrder.sort((a, b) => (a[1] < b[1] ? -1 : a[1] > b[1] ? 1 : 0));
        // Create a list of ( state, bitwidth ) for decoding state vectors
        this.stateVecOrder = [];
        for (let i = 0; i < vecOrder.length; i++) {
            let state = vecOrder[i][0];
            this.stateVecOrder.push([state, this.stateFormat[state].bitWidth]);
        }
        this.onStateFormat(this.stateFormat);
    }
    _decodeGenericSignal(data) {
        let index = 0;
        let signalType = data.getUint8(index);
        index = index + 1;
        let nChannels = data.getUint16(index, true);
        index = index + 2;
        let nElements = data.getUint16(index, true);
        index = index + 2;
        index = index + data.byteOffset;
        let signalData = new DataView(data.buffer, index);
        let signal = [];
        for (let ch = 0; ch < nChannels; ++ch) {
            signal.push([]);
            for (let el = 0; el < nElements; ++el) {
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
    }
    _decodeStateVector(dv) {
        if (this.stateVecOrder == null)
            return;
        // Currently, states are maximum 32 bit unsigned integers
        // BitLocation 0 refers to the least significant bit of a byte in the packet
        // ByteLocation 0 refers to the first byte in the sequence.
        // Bits must be populated in increasing significance
        let i8Array = new Int8Array(dv.buffer);
        let firstZero = i8Array.indexOf(0);
        let secondZero = i8Array.indexOf(0, firstZero + 1);
        let decoder = new TextDecoder();
        let stateVectorLength = parseInt(decoder.decode(i8Array.slice(1, firstZero)));
        let numVectors = parseInt(decoder.decode(i8Array.slice(firstZero + 1, secondZero)));
        let index = secondZero + 1;
        let data = new DataView(dv.buffer, index);
        let states = {};
        for (let state in this.stateFormat) {
            states[state] = Array(numVectors).fill(this.stateFormat[state].defaultValue);
        }
        for (let vecIdx = 0; vecIdx < numVectors; vecIdx++) {
            let vec = new Uint8Array(data.buffer, data.byteOffset + vecIdx * stateVectorLength, stateVectorLength);
            let bits = [];
            for (let byteIdx = 0; byteIdx < vec.length; byteIdx++) {
                bits.push((vec[byteIdx] & 0x01) !== 0 ? 1 : 0);
                bits.push((vec[byteIdx] & 0x02) !== 0 ? 1 : 0);
                bits.push((vec[byteIdx] & 0x04) !== 0 ? 1 : 0);
                bits.push((vec[byteIdx] & 0x08) !== 0 ? 1 : 0);
                bits.push((vec[byteIdx] & 0x10) !== 0 ? 1 : 0);
                bits.push((vec[byteIdx] & 0x20) !== 0 ? 1 : 0);
                bits.push((vec[byteIdx] & 0x40) !== 0 ? 1 : 0);
                bits.push((vec[byteIdx] & 0x80) !== 0 ? 1 : 0);
            }
            for (let stateIdx = 0; stateIdx < this.stateVecOrder.length; stateIdx++) {
                let fmt = this.stateFormat[this.stateVecOrder[stateIdx][0]];
                let offset = fmt.byteLocation * 8 + fmt.bitLocation;
                let val = 0;
                let mask = 0x01;
                for (let bIdx = 0; bIdx < fmt.bitWidth; bIdx++) {
                    if (bits[offset + bIdx])
                        val = (val | mask) >>> 0;
                    mask = (mask << 1) >>> 0;
                }
                states[this.stateVecOrder[stateIdx][0]][vecIdx] = val;
            }
        }
        this.onStateVector(states);
        this.states = states;
    }
}
exports.BCI2K_DataConnection = BCI2K_DataConnection;
//# sourceMappingURL=BCI2K_DataConnection.js.map