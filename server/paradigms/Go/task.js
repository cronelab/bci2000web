// // function callThis(bciInstance) {
// // bciInstance.execute('Hide window')
// // }
// let state = "Loading...";
// let trials = 0;
// let curCode = null;

// const tapSockets = async bciInstance => {
//   let spectralConnection = await bciInstance.tap("Source");
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
//   const updateState = () => {
//     bciInstance.execute("Get System State", result => (state = result.output));
//     requestAnimationFrame(draw);
//     setTimeout(updateState, 1000);
//   };
//   updateState();
// };

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
//   context.font = "24px arial";
//   if (state.search("Suspended") >= 0)
//     context.fillText('Click "Back" to Finish Paradigm', cx, cy + 50);
//   else {
//     if (trials == 0) context.fillText("Getting Ready...", cx, cy + 50);
//     else context.fillText("Trials: " + trials.toString(), cx, cy + 50);
//   }
// };
