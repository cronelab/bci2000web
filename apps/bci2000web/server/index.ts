// bci2000web.js
//* A node-based implementation of web-socket based BCI2000 remote control

import next from "next";
import helpers from "./helpers";
import WebSocket, { createWebSocketStream } from "ws";
import config from "./config/localconfig.json";
import { createServer } from "http";
import { parse } from "url";
import process from "process";

const port = parseInt(process.env.PORT, 10) || 3000;
const dev = process.env.NODE_ENV !== "production";
const app = next({ dev });
const handle = app.getRequestHandler();

app.prepare().then(async () => {
  const wss = new WebSocket.Server({ noServer: true });
  const server = createServer((req, res) =>
    handle(req, res, parse(req.url, true))
  );

  //Check if BCI2000 is running and start if not.
  let isBCI2000Running = await helpers.isRunning("operator.exe");
  let operator;
  if (!isBCI2000Running) {
    operator = await helpers.launchOperator(config.operatorPath);

    process.on("SIGINT", () => {
      console.log("STOP");
      operator.stdin.write("EXIT; \n");
      process.exit(0);
    });
  wss.on("connection", async (ws) => {
    ws.onmessage = (e) => {
      let msg = JSON.parse(e.data);
      if (msg.opcode == "E") {
        operator.stdin.write(`${msg.contents}; \n`);
        operator.stdout.on("data", (data) => {
          ws.send(
            JSON.stringify({
              opcode: "O",
              id: msg.id,
              response: data.toString().replaceAll("BCI2000Shell> ", "").trim(),
            })
          );
        });
      }
    };
  });
}

  server.on("upgrade", function (req, socket, head) {
    const { pathname } = parse(req.url, true);
    if (pathname !== "/_next/webpack-hmr") {
      wss.handleUpgrade(req, socket, head, function done(ws) {
        wss.emit("connection", ws, req);
      });
    }
  });

  server.listen(port, () => {
    console.log(
      `> Ready on http://localhost:${port} and ws://localhost:${port}`
    );
  });
});
