import Telnet from 'telnet-client';

export default class OperatorServer {


    //? Connect to BCI2000's operator telnet port in order to send/receive operator commands.
    async connectTelnet(operator, app) {
        const connection = new Telnet();

        // Cache new parameters in the operator process object
        operator.telnet = null;
        operator.commandQueue = [];
        operator.executing = null;

        connection.on('ready', () => (operator.telnet = connection));
        connection.on('timeout', () => (operator.executing = null));
        connection.on('close', () => process.exit(0));

        try {
            //TODO configure this better
            await connection.connect({
                host: '127.0.0.1',
                port: 3999,
                timeout: 1000,
                shellPrompt: '>',
                echoLines: 0,
                execTimeout: 30,
            });
        } catch (error) {
            console.log(error);
        }

        //!Fixes an idiotic race condition where the WS isn't set up until AFTER bci2000 connects
        //!arbitrary time, in the future set this into the config.json
        await new Promise((resolve) => setTimeout(resolve, 2000));
        //? Set up WebSocket handler
        app.ws('/', (ws) => {
            ws.on('message', (message) => {
                console.log(message);
                let msg = JSON.parse(message);
                msg.ws = ws;
                if (msg.opcode == 'E') {
                    operator.commandQueue.push(msg);
                }
            });

            // emits on new datagram msg
            // udpServer.on('message', (msg, info) => {
            //     let msgBlock = msg.toString().split('\t');
            //     let udpmsg = {
            //         opcode: 'U',
            //         id: null,
            //         contents: msgBlock,
            //     };
            //     if (ws.readyState == 1) {
            //         ws.send(JSON.stringify(udpmsg));
            //     }
            // });
        });

        // Start command execution loop
        //?Every 20ms send info about connection state/listen for commands
        (function syncCommunications() {
            if (
                operator.commandQueue.length &&
                operator.telnet &&
                !operator.executing
            ) {
                operator.executing = operator.commandQueue.shift();

                operator.telnet.exec(operator.executing.contents, (err, response) => {
                    let ws = operator.executing.ws;

                    let id = operator.executing.id;
                    operator.executing = null;
                    if (response != undefined) {
                        try {
                            let msg = {
                                opcode: 'O',
                                id: id,
                                contents: response.trim(),
                            };
                            ws.send(JSON.stringify(msg));
                        } catch (e) {
                            console.log(e);
                            /* client stopped caring */
                        }
                    }
                });
            }
            setTimeout(syncCommunications, 20);
        })();
    };

    //? Checks to see if BCI2000's operator executable is running.
    isRunning(win, exec) {
        return new Promise((resolve, reject) => {
            const cmd = 'tasklist';
            const proc = win;
            exec(cmd, (err, stdout, stderr) => {
                resolve(stdout.toLowerCase().indexOf(proc.toLowerCase()) > -1);
            });
        });
    };

    //? Launches BCI2000 on a particular telnet port in the foreground or background
    async launchOperator(operatorPath, spawn) {
        // let spawnParams = {
        //     cwd: path.dirname(operatorPath),
        // };
        let operatorArgs = [
            '--Telnet',
            '*:' + 3999,
            '--StartupIdle',
            '--Title',
            '--BCI2000Web',
        ];
        let operator = spawn(operatorPath, operatorArgs)//, spawnParams);
        return operator;
    };

}
