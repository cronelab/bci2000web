import { w3cwebsocket as WebSocket } from 'websocket';

export default class BCI2K_OperatorConnection {
    client: any;
    _execid: any;
    _exec: any;
    state: string;
    // ondisconnect: any;
    // onconnect: any;
    onStateChange: any;
    address: string;
    onWatchReceived: any;
    constructor(address?: string) {
        // this.ondisconnect = () => { };
        // this.onconnect = () => { };
        this.onStateChange = (event: string) => { };
        this.onWatchReceived = (event: string[]) => { };
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
    public connect(address?: string): Promise<void> {
        if (this.address === undefined) this.address = address;

        return new Promise<void>((resolve, reject) => {
            this.client = new WebSocket(this.address);
            console.log(this)
            this.client.onerror = (error) => {
                // This will only execute if we err before connecting, since
                // Promises can only get triggered once
                reject(`Error connecting to BCI2000 at ${this.address} due to ${error}`);
            };

            this.client.onopen = () => {
                // this.onconnect();
                console.log("Connected")
                resolve();
            };

            this.client.onclose = () => {
                console.log("Disconnected");
                // this.ondisconnect();
                // this.websocket.close();

            };

            this.client.onmessage = (event) => {
                let { opcode, id, contents } = JSON.parse(event.data);
                switch (opcode) {
                    case "O": // OUTPUT: Received output from command
                        this._exec[id](contents);
                        delete this._exec[id];
                        break;
                    case "U":
                        let _id = contents.shift();
                        contents[contents.length - 1].trim()
                        this.onWatchReceived(contents)
                    default:
                        break;
                }
            };
        });
    }

    public disconnect() {
        this.client.close();

    }

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

    public connected() {
        return (
            this.client !== null && this.client.readyState === WebSocket.OPEN
        );
    }

    public execute(instruction: string) {
        if (this.connected()) {
            return new Promise((resolve, reject) => {
                let id = (++this._execid).toString();
                // TODO Properly handle errors from BCI2000
                this._exec[id] = (exec) => resolve(exec);
                this.client.send(
                    JSON.stringify({
                        opcode: "E",
                        id: id,
                        contents: instruction,
                    })
                );
            });
        }
        // Cannot execute if not connected
        return Promise.reject(
            "Cannot execute instruction: not connected to BCI2000"
        );
    }

    /**
     * shows current BCI2000 version
     */
    // getVersion() {
    //     this.execute("Version").then((x: string) => console.log(x.split(" ")[1]));
    // }

    showWindow() {
        return this.execute("Show Window");
    }

    hideWindow() {
        return this.execute("Hide Window");
    }

    setWatch(state: string, ip: string, port: string) {
        return this.execute("Add watch " + state + " at " + ip + ":" + port);
    }

    /**
     * [BCI2000 documentation](https://www.bci2000.org/mediawiki/index.php/User_Reference:Operator_Module_Scripting#RESET_SYSTEM)
     * @returns 
     */
    resetSystem() {
        return this.execute("Reset System");
    }

    setConfig() {
        return this.execute("Set Config");
    }

    start() {
        return this.execute("Start");
    }

    stop() {
        return this.execute("Stop");
    }

    kill() {
        return this.execute("Exit");
    }

    /**
     * @deprecated in favor of BCI2000 watches
     */
    stateListen() {
        setInterval(() => {
            this.execute("GET SYSTEM STATE").then((state: any) => {
                if (state.trim() != this.state) {
                    this.onStateChange(state.trim());
                    this.state = state.trim();
                }
            });
        }, 500);
    }

    async getSubjectName() {
        //Promise<string> {
        return await this.execute("Get Parameter SubjectName");
    }

    async getTaskName() {
        return await this.execute("Get Parameter DataFile");
    }
    //See https://www.bci2000.org/mediawiki/index.php/Technical_Reference:Parameter_Definition
    async getParameters() {
        let parameters: any = await this.execute("List Parameters");
        let allData = parameters.split("\n");
        let data = {};
        let el;
        allData.forEach(line => {
            let descriptors = line.split("=")[0]
            let dataType = descriptors.split(" ")[1]
            let name = descriptors.split(" ")[2]
            let names = descriptors.split(" ")[0].split(":");
            names.forEach((x, i) => {
                switch (i) {
                    case 0: {
                        if (data[names[0]] == undefined) {
                            data[names[0]] = {}
                        }
                        el = data[names[0]]
                        break;
                    }
                    case 1: {
                        if (data[names[0]][names[1]] == undefined) {
                            data[names[0]][names[1]] = {}
                        }
                        el = data[names[0]][names[1]]
                        break;
                    }
                    case 2: {
                        if (data[names[0]][names[1]][names[2]] == undefined) {
                            data[names[0]][names[1]][names[2]] = {}
                        }
                        el = data[names[0]][names[1]][names[2]]
                        break;
                    }
                    default: { }
                }
            })

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
                    }
                }
                else {
                    el[name] = {
                        dataType,
                        value: line.split("=")[1].split("//")[0].trim(),
                        comment: line.split("=")[1].split("//")[1]
                    }
                }
            }
            else {
                el[name] = {
                    dataType,
                    value: line.split("=")[1].split("//")[0].trim(),
                    comment: line.split("=")[1].split("//")[1]
                }
            }

        });

        return data
    }
}
