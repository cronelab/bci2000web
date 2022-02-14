export default class BCI2K_DataConnection {
    websocket: any;
    states: any;
    signal: any;
    signalProperties: any;
    stateFormat: any;
    stateVecOrder: any;
    SignalType: any;
    callingFrom: any;
    /**
  * Emitted whenever the stream is relinquishing ownership of a chunk of data to a consumer.
  * @event
  */
    onconnect: any;
    /**
  * Emitted whenever the stream is relinquishing ownership of a chunk of data to a consumer.
  * @event
  */
    onGenericSignal: any;
    /**
  * Emitted whenever the stream is relinquishing ownership of a chunk of data to a consumer.
  * @event
  */
    onStateVector: any;
    /**
  * Emitted whenever the stream is relinquishing ownership of a chunk of data to a consumer.
  * @event
  */
    onSignalProperties: any;
    /**
  * Emitted whenever the stream is relinquishing ownership of a chunk of data to a consumer.
  * @event
  */
    onStateFormat: any;
    /**
  * Emitted whenever the stream is relinquishing ownership of a chunk of data to a consumer.
  * @event
  */
    ondisconnect: any;
    /**
  * Emitted whenever decoding signal properties or generic signal
  * @event
  */
    onReceiveBlock: any;
    address: string;
    reconnect: boolean;
    constructor(address?: string);
    private getNullTermString;
    connect(address?: string): Promise<void>;
    disconnect(): void;
    connected(): boolean;
    private _decodeMessage;
    private _decodePhysicalUnits;
    private _decodeSignalProperties;
    private _decodeStateFormat;
    private _decodeGenericSignal;
    private _decodeStateVector;
}
