const { spawn } = require("child_process");
// import { spawn } from "child_process";
// import path from "path";
let operator;
(async () => {
  let spawnParams = {
    cwd: path.dirname("/mnt/c/Users/Chris/Downloads/Dickens_BCI2000/prog/BCI2000Shell.exe"),
  };
  operator = spawn(
    "/mnt/c/Users/Chris/Downloads/Dickens_BCI2000/prog/BCI2000Shell.exe",
    ["-i"],
    spawnParams
  );
  operator.stdin.write("Show Window; \n");
  operator.stdin.write("Startup system; \n");
  operator.stdin.write("Start executable SignalGenerator; \n");
  operator.stdin.write("Start executable DummySignalProcessing; \n");
  operator.stdin.write("Start executable DummyApplication; \n");
  operator.stdout.on("data", (data) => {
    let message = data.toString();
    console.log(message.slice(0, -14).trim());
  });
  operator.on("beforeExit", () => {
    operator.stdin.write("EXIT; \n");
  });
})();
