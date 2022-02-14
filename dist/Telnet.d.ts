export default class OperatorServer {
    connectTelnet(operator: any, app: any): Promise<void>;
    isRunning(win: any, exec: any): Promise<unknown>;
    launchOperator(operatorPath: any, spawn: any): Promise<any>;
}
