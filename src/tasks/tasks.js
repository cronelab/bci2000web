import BCI2K from "bci2k";
var bci = new BCI2K();
let state = "Loading...";
let trials = 0;
let curCode = null;
import "./task.scss";
import {CreateConfig} from './configLoader'

window.onload = () => {
  getParametersForParadigm();
  bci.connect("127.0.0.1");


};

// const tapSockets = async () => {
//   let spectralConnection = await bci.tap("Source");
//   spectralConnection.onStateVector = states => {
//     if (
//       states.hasOwnProperty("StimulusCode") &&
//       states.StimulusCode[0] != curCode
//     ) {
//       curCode = states.StimulusCode[0];
//       if (curCode) {
//         trials++;
//       }
//     }
//   };
//   updateState();
// };

const getParametersForParadigm = async () => {
  const urlParams = new URLSearchParams(window.location.search);
  const task = urlParams.get("task");
  const instance = urlParams.get("instance");
  const block = urlParams.get("block");
  let config = await new CreateConfig(task);
  bci.execute(config);
  await new Promise(resolve => setTimeout(resolve, 2500));
  document.title = `${task}: ${instance}`
  // tapSockets();

};





// const updateState = () => {
//   bci.execute("Get System State", result => state = result.output);
//   requestAnimationFrame(draw);
//   setTimeout(updateState, 1000);
// }

// const draw = time => {
//   let canvas = document.getElementById("stim");
//   let context = canvas.getContext("2d");

//   context.clearRect(0, 0, canvas.width, canvas.height);
//   var cx = canvas.width / 2.0;
//   var cy = canvas.height / 2.0;

//   context.textAlign = "center";
//   context.textBaseline = "middle";
//   context.font = "20px arial";
//   context.fillStyle = "white";
//   context.fillText(document.title, cx, cy);
//   context.font = "12px arial";
//   if (state.search("Suspended") >= 0)
//     context.fillText('Click "Back" to Finish Paradigm', cx, cy + 50);
//   else {
//     if (trials == 0) context.fillText("Getting Ready...", cx, cy + 50);
//     else context.fillText("Trials: " + trials.toString(), cx, cy + 50);
//   }
// }

bci.onconnect = e => {
  console.log("connected");
};


// window.onbeforeunload = function() {
  // if (bci.connected()) {
    // bci.resetSystem();
  // }
// };

bci.onconnect = e => {
  setInterval(() => {
    bci
      .execute("Get System State", result => result)
      .then(state => {
        if(state.trim() == "Idle"){
          window.close()
        }
      })
  }, 1000);
};