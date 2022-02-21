import path from 'path';
import { spawn, exec } from 'child_process';
import fs from 'fs';

const helpers = {
  //? Checks to see if BCI2000's operator executable is running.
  isRunning: (win: string) => {
    return new Promise((resolve, reject) => {
      const cmd = 'tasklist';
      const proc = win;
      exec(cmd, (err, stdout, stderr) => {
        resolve(stdout.toLowerCase().indexOf(proc.toLowerCase()) > -1);
      });
    });
  },
  //? Launches BCI2000 on a particular telnet port in the foreground or background
  launchOperator: async (operatorPath: string) => {

    let spawnParams = {
      cwd: path.dirname(
        "/mnt/c/Users/Chris/Downloads/Dickens_BCI2000/prog/BCI2000Shell.exe"
      ),
      detached: true
    };
    let operator = spawn(operatorPath,['-i'], spawnParams);
    operator.stdin.write('Show Window; \n')
    operator.stdin.write('Startup system; \n')
    // operator.stdin.write('Start executable prog/SignalGenerator; \n')
    // operator.stdin.write('Start executable prog/DummySignalProcessing; \n')
    // operator.stdin.write('Start executable prog/DummyApplication; \n')
    operator.on('error', e => {
      console.log(e)
    })
    operator.on('close', (code) => {

      console.log(`child process exited with code ${code}`);
      process.exit();
    });
    return operator;
  },

  //? Searches the bci2000/data folder for saved .dat files.
  findData: (currentDirPath: string): String[] => {
    let data: String[] = [];
    fs.readdirSync(currentDirPath).forEach((name) => {
      const filePath = path.join(currentDirPath, name);
      const stat = fs.statSync(filePath);
      if (stat.isFile() && path.extname(filePath) === '.dat') {
        data.push(path.resolve(filePath).split('.').slice(0, -1).join('.'));
      } else if (stat.isDirectory()) {
        data = data.concat(helpers.findData(filePath));
      }
    });
    return data;
  },
};

export default helpers;
