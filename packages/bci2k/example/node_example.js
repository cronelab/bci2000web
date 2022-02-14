const BCI2K = require("../dist");

let bci = new BCI2K.bciOperator();
const bciSourceData = new BCI2K.bciData();
const bciFilterData = new BCI2K.bciData();

function sleep(n) { return new Promise(resolve=>setTimeout(resolve,n)); }

(async () =>{
  await bci.connect("ws://127.0.0.1:80")
  console.log("Connected to Operator layer through NodeJS server");
  await bciSourceData.connect("ws://127.0.0.1:20100")
  bciSourceData.onGenericSignal = x => console.log(x);
  await sleep(5000);
  bciSourceData.disconnect()
  await sleep(5000);
  await bciSourceData.connect("ws://127.0.0.1:20100")
})()
