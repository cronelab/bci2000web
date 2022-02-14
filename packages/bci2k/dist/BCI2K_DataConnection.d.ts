export declare class BCI2K_DataConnection {
    _socket: any;
    states: any;
    signal: any;
    signalProperties: any;
    stateFormat: any;
    stateVecOrder: any;
    SignalType: any;
    callingFrom: any;
    onconnect: any;
    onGenericSignal: any;
    onStateVector: any;
    onSignalProperties: any;
    onStateFormat: any;
    ondisconnect: any;
    onReceiveBlock: any;
    address: string;
    constructor(address?: string);
    private getNullTermString;
    connect(address?: string, callingFrom?: string): Promise<void>;
    connected(): boolean;
    private _decodeMessage;
    private _decodePhysicalUnits;
    private _decodeSignalProperties;
    private _decodeStateFormat;
    private _decodeGenericSignal;
    private _decodeStateVector;
}
