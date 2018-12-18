const path = require( 'path' );
const spawn = require( 'child_process' ).spawn;
const exec = require('child_process').exec
let Client = require('ssh2-sftp-client');
let sftp = new Client();
const config = require('./config.json');
// const credentials = require('./credentials.json');

module.exports = {
    isRunning: (win, mac, linux) => {
        return new Promise(function(resolve, reject){
            const plat = process.platform
            const cmd = plat == 'win32' ? 'tasklist' : (plat == 'darwin' ? 'ps -ax | grep ' + mac : (plat == 'linux' ? 'ps -A' : ''))
            const proc = plat == 'win32' ? win : (plat == 'darwin' ? mac : (plat == 'linux' ? linux : ''))
            if(cmd === '' || proc === ''){
                resolve(false)
            }
            exec(cmd, function(err, stdout, stderr) {
                resolve(stdout.toLowerCase().indexOf(proc.toLowerCase()) > -1)
            })
        })
    },
    launchOperator: async ( operatorPath, telnetPort, hide ) => {
        let spawnParams = {cwd: path.dirname( operatorPath )};
        let operatorArgs = [
            '--Telnet', '*:' + telnetPort,
            '--StartupIdle',
            '--Title', '--BCI2000Web'
        ];
        if ( hide ) operatorArgs.push("--Hide");
            let operator = spawn( operatorPath, operatorArgs, spawnParams );
        return operator
    },
    connect2STFP: () =>{
        //docs
        //https://www.npmjs.com/package/ssh2-sftp-client
        //         var fs = require('fs');

        // // ...

        // for(var i = 0; i < data.length; i++) {
        //   const remoteFilename = '/path/to/remote/files/' + data[i].name;
        //   const localFilename = '/path/to/local/files/' + data[i].name;
        //   sftp.get(remoteFilename).then((stream) => {
        //     stream.pipe(fs.createWriteStream(localFilename));
        //   });
        // }
        sftp.connect({
            host: 'zappa.neuro.jhu.edu',
            port: '22',
            username: config.sftpUser,
            password: credentials.sftpPass
          }).then(() => {
            return sftp.list('/mnt/shared/ecog')
          }).then((data) => {
            console.log(data, 'the data info');
          }).catch((err) => {
            console.log(err, 'catch error');
          });
    }
}
