import path from 'path';
import { spawn, exec } from 'child_process';
import fs from 'fs';

const helpers = {
  //? Checks to see if BCI2000's operator executable is running.
  isRunning: (win) => {
    return new Promise((resolve, reject) => {
      const cmd = 'tasklist';
      const proc = win;
      exec(cmd, (err, stdout, stderr) => {
        resolve(stdout.toLowerCase().indexOf(proc.toLowerCase()) > -1);
      });
    });
  },
  //? Launches BCI2000 on a particular telnet port in the foreground or background
  launchOperator: async (operatorPath, telnetPort, hide) => {
    let spawnParams = {
      cwd: path.dirname(operatorPath),
    };
    let operatorArgs = [
      '--Telnet',
      '*:' + telnetPort,
      '--StartupIdle',
      '--Title',
      '--BCI2000Web',
    ];
    if (hide) operatorArgs.push('--Hide');
    let operator = spawn(operatorPath, operatorArgs, spawnParams);
    return operator;
  },
  //? Searches the server/paradigms folder or tasks to populate the UI's task field
  findCards: (currentDirPath) => {
    let cardPaths = [];
    fs.readdirSync(currentDirPath).forEach((name) => {
      const filePath = path.join(currentDirPath, name);
      const stat = fs.statSync(filePath);
      if (stat.isFile() && path.basename(filePath) == 'task.json') {
        cardPaths.push(path.resolve(filePath));
      } else if (stat.isDirectory()) {
        cardPaths = cardPaths.concat(helpers.findCards(filePath));
      }
    });
    return cardPaths;
  },
  //? Searches the bci2000/data folder for saved .dat files.
  findData: (currentDirPath) => {
    let data = [];
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
