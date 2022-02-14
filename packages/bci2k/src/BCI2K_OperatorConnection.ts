// ======================================================================== //
//
// bci2k.js
// A javascript connector for BCI2000
//
// ======================================================================== //

import { w3cwebsocket as WebSocket } from 'websocket';

export class BCI2K_OperatorConnection {
  msgID: number;
  websocket: any;
  state: any;
  ondisconnect: any;
  onStateChange: any;
  address: string;
  latestIncomingData: string;
  newData: any;
  responseBuffer: any;
  constructor(address?: string) {
    this.ondisconnect = () => {};
    this.onStateChange = (event: string) => {};
    this.websocket = null;
    this.state = "";
    this.address = address || undefined;
    this.latestIncomingData = ""
    this.msgID = 0;
    this.newData = () => {}
    this.responseBuffer = []
  }
  
  public connect(address?: string): Promise<void> {
    return new Promise((resolve, reject) => {
      if (this.address === undefined) {
        this.address =
          address || "ws://127.0.0.1:80" || `ws://{window.location.host}`;
      }

      this.websocket = new WebSocket(this.address);

      this.websocket.onerror = (error) => reject(`Error connecting to BCI2000 at ${this.address}`);

      
      this.websocket.onclose = () => {
        console.log("Connection closed")
        this.ondisconnect()
      };
      this.websocket.onopen = () => resolve();

      this.websocket.onmessage = (event) => {
        let { opcode, id, response } = JSON.parse(event.data);
        switch (opcode) {
          case "O":
            this.responseBuffer.push({id: id, response: response});
            this.newData(response)
            break;
          default:
            break;
        }
      };
    });
  }

  public disconnect(): void{
    this.websocket.close();
  }

  public connected(): boolean {
    return (
      this.websocket !== null && this.websocket.readyState === WebSocket.OPEN
    );
  }

  public execute(instruction: string): Promise<string> {
    if (this.connected()) {
      return new Promise((resolve, reject) => {
        this.msgID = this.msgID+1;
        this.websocket.send(
          JSON.stringify({
            opcode: "E",
            id: this.msgID,
            contents: instruction,
          })
        );
        this.newData = data => resolve(data)
      });
    }
    // Cannot execute if not connected
    return Promise.reject(
      "Cannot execute instruction: not connected to BCI2000"
    );
  }

  async getVersion(): Promise<string> {
    let resp = await this.execute("Version")
    return resp.split('\r')[0]
  }

  async showWindow(): Promise<void> {
    await this.execute("Show Window");
  }

  async hideWindow():Promise<void> {
    await this.execute("Hide Window");
  }

  async startExecutable(executable: string): Promise<void>{
    await this.execute(`Start executable ${executable}`)
  }

  async startDummyRun(): Promise<void>{
    // await this.execute('Startup system');
    await this.startExecutable('SignalGenerator')
    await this.startExecutable('DummySignalProcessing')
    await this.startExecutable('DummyApplication')
    // await this.execute("Set Config");
    // await this.execute("Start");

  }

  async setWatch(state: string, ip: string, port: string): Promise<void> {
    await this.execute("Add watch " + state + " at " + ip + ":" + port);
  }

  async resetSystem():Promise<void> {
    await this.execute("Reset System");
  }

  async setConfig():Promise<void> {
    await this.execute("Set Config");
  }

  async start():Promise<void> {
    await this.execute("Start");
  }

  async stop():Promise<void> {
    await this.execute("Stop");
  }

  async kill():Promise<void> {
    await this.execute("Exit");
  }

  stateListen(): void {
    setInterval(async () => {
      let state: string = await this.execute("GET SYSTEM STATE")
        if (state.trim() != this.state) {
          this.onStateChange(state.trim());
        }
    }, 1000);
  }

  async getSubjectName(): Promise<string> {
    return await this.execute("Get Parameter SubjectName");
  }

  async getTaskName(): Promise<string> {
    return await this.execute("Get Parameter DataFile");
  }

  async setParameter(parameter): Promise<void> {
    await this.execute(`Set paramater ${parameter}`)
  }

  async setState(state): Promise<void> {
    await this.execute(`Set state ${state}`)
  }

  //See https://www.bci2000.org/mediawiki/index.php/Technical_Reference:Parameter_Definition
  async getParameters(): Promise<any> {
    let parameters: any = await this.execute("List Parameters");
    let allData = parameters.split("\n");
    let data = {};
    let el;
    allData.forEach(line => {
      let descriptors = line.split("=")[0]
      let dataType = descriptors.split(" ")[1]
      let name = descriptors.split(" ")[2]
      let names = descriptors.split(" ")[0].split(":");
      names.forEach((x, i) =>{
        switch(i){
          case 0: {
            if(data[names[0]]==undefined){
              data[names[0]] = {}
            }
            el = data[names[0]]
            break;
          }
          case 1: {
            if(data[names[0]][names[1]]==undefined){
            data[names[0]][names[1]] ={}
            }
            el = data[names[0]][names[1]]
            break;
          }
          case 2: {
            if(data[names[0]][names[1]][names[2]]==undefined){
            data[names[0]][names[1]][names[2]] ={}
            }
            el = data[names[0]][names[1]][names[2]]
            break;
          }
            default: {}
          }
      })

      if(dataType != "matrix"){
        if(line.split("=")[1].split("//")[0].trim().split(" ").length == 4){
          el[name] = {
            dataType,
            value: {
              value: line.split("=")[1].split("//")[0].trim().split(" ")[0],
              defaultValue: line.split("=")[1].split("//")[0].trim().split(" ")[1],
              low:line.split("=")[1].split("//")[0].trim().split(" ")[2],
              high:line.split("=")[1].split("//")[0].trim().split(" ")[3],
            },
            comment: line.split("=")[1].split("//")[1]
          }
        }
        else{
          el[name] = {
            dataType,
            value: line.split("=")[1].split("//")[0].trim(),
            comment: line.split("=")[1].split("//")[1]
        }
      }
      }
      else{
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
