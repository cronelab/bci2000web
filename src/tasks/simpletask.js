// var bci = new BCI2K();
// bci.connect();

// var trialConnection = null;
// (function applyConfig() {
//   if (bci.connected() && config) {
//     var script = config.script() + "Set Config; Wait for Resting; ";
//     bci
//       .execute(script)
//       .then(function() {
//         return new Promise(function(resolve, reject) {
//           setTimeout(function() {
//             resolve();
//           }, 1000);
//         });
//       })
//       .then(function() {
//         bci
//           .tap("SpectralOutput")
//           .then(setupSpectralConnection)
//           .catch(function(reason) {
//             console.log("Could not tap SpectralOutput: " + reason);
//           });
//       })
//       .then(function() {
//         bci.start();
//       });
//   } else setTimeout(applyConfig, 100);
// })();



// var trials = 0;
// var curCode = null;
// var setupSpectralConnection = function(dataConnection) {
//   dataConnection.onStateVector = function(states) {
//     if (
//       states.hasOwnProperty("StimulusCode") &&
//       states.StimulusCode[0] != curCode
//     ) {
//       curCode = states.StimulusCode[0];
//       if (curCode) {
//         trials++;
//         requestAnimationFrame(draw);
//       }
//     }
//   };
//   setTimeout(updateState, 500);
// };
