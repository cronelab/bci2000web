const path = require("path");
const spawn = require("child_process").spawn;
const exec = require("child_process").exec;
const fs = require("fs");

module.exports = {
  isRunning: win => {
    return new Promise((resolve, reject) => {
      const cmd = "tasklist"
      const proc = win
     exec(cmd, (err, stdout, stderr) => {
        resolve(stdout.toLowerCase().indexOf(proc.toLowerCase()) > -1);
      });
    });
  },
  launchOperator: async (operatorPath, telnetPort, hide) => {
    let spawnParams = { cwd: path.dirname(operatorPath) };
    let operatorArgs = [
      "--Telnet",
      "*:" + telnetPort,
      "--StartupIdle",
      "--Title",
      "--BCI2000Web"
    ];
    if (hide) operatorArgs.push("--Hide");
    let operator = spawn(operatorPath, operatorArgs, spawnParams);
    return operator;
  },
  findCards: currentDirPath => {
    let cardPaths = [];
    fs.readdirSync(currentDirPath).forEach(name => {
      const filePath = path.join(currentDirPath, name);
      const stat = fs.statSync(filePath);
      if (stat.isFile() && path.basename(filePath) == "task.json") {
        cardPaths.push(path.resolve(filePath));
      } else if (stat.isDirectory()) {
        cardPaths = cardPaths.concat(module.exports.findCards(filePath));
      }
    });
    return cardPaths;
  },
  findData: currentDirPath => {
    let data = [];
    fs.readdirSync(currentDirPath).forEach(name => {
      const filePath = path.join(currentDirPath, name);
      const stat = fs.statSync(filePath);
      if (stat.isFile() && path.extname(filePath) === ".dat") {
        data.push(
          path
            .resolve(filePath)
            .split(".")
            .slice(0, -1)
            .join(".")
        );
      } else if (stat.isDirectory()) {
        data = data.concat(module.exports.findData(filePath));
      }
    });
    return data;
  }
};
