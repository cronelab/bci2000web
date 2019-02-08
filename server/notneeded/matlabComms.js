const WebSocket = require('ws');
 
const ws = new WebSocket('ws://localhost:30000');
 
ws.on('open', function open() {
  ws.send('Sent from NodeJS!');
});

ws.on('message', function incoming(data) {
    console.log(data);
  });