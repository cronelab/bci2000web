import VMPL from 'vMPL.js';
import path from 'path';
import * as BCI2K from 'bci2k';
import { execFile } from 'child_process';
const sleep = (ms) => {
  return new Promise((res, rej) => {
    setTimeout(res, ms);
  });
};
let bciSourceConnection;
let bciOperatorConn;

// (async () => {
//   let leftArm = new VMPL('left', '10.194.224.12');
//   let rightArm = new VMPL('right', '10.194.224.12');
//   leftArm.fist();
//   await sleep(2000);
//   leftArm.palmDown();
//   await sleep(2000);
//   rightArm.fist();
//   await sleep(2000);
//   rightArm.waveLeft();
//   await sleep(2000);
//   rightArm.waveRight();
//   await sleep(2000);
//   rightArm.peace();
// })();

(async () => {
  let bciOperatorConn = new BCI2K.bciOperator();
  bciSourceConnection = new BCI2K.bciData();
  try {
    await bciOperatorConn.connect('ws://10.194.224.12');
    await bciSourceConnection.connect('ws://10.194.224.12:20100');
  } catch (err) {
    console.log(err);
  }
  let clickOnce = false;
  bciSourceConnection.onGenericSignal = (x) => {
    console.log(x);
    // if (Object.keys(bciSourceConnection.states).length != 0) {
    //   if (
    //     bciSourceConnection.states?.ControlClick[0] == 1 &&
    //     clickOnce == false
    //   ) {
    //     leftArm.thumb('close');
    //     bciOperatorConn.execute('SET STATE ControlClick 0');
    //     console.log('control click');
    //     clickOnce = true;
    //   }
    //   if (
    //     bciSourceConnection.states?.ControlClick[0] == 0 &&
    //     clickOnce == true
    //   ) {
    //     clickOnce = false;
    //   }
    // }
  };
})();
