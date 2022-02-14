export default class BCI2K_OperatorConnection {
    client: any;
    _execid: any;
    _exec: any;
    state: string;
    onStateChange: any;
    address: string;
    onWatchReceived: any;
    constructor(address?: string);
    /**
     *
     * @param address address to bci2000web
     * @returns promise void
     */
    connect(address?: string): Promise<void>;
    disconnect(): void;
    connected(): boolean;
    execute(instruction: string): Promise<unknown>;
    /**
     * shows current BCI2000 version
     */
    showWindow(): Promise<unknown>;
    hideWindow(): Promise<unknown>;
    setWatch(state: string, ip: string, port: string): Promise<unknown>;
    /**
     * [BCI2000 documentation](https://www.bci2000.org/mediawiki/index.php/User_Reference:Operator_Module_Scripting#RESET_SYSTEM)
     * @returns
     */
    resetSystem(): Promise<unknown>;
    setConfig(): Promise<unknown>;
    start(): Promise<unknown>;
    stop(): Promise<unknown>;
    kill(): Promise<unknown>;
    /**
     * @deprecated in favor of BCI2000 watches
     */
    stateListen(): void;
    getSubjectName(): Promise<unknown>;
    getTaskName(): Promise<unknown>;
    getParameters(): Promise<{}>;
}
