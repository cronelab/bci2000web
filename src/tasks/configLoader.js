export class CreateConfig {
  constructor(task) {
    return (async () => {
      const urlParams = new URLSearchParams(window.location.search);

      const task = urlParams.get("task");
      const instance = urlParams.get("instance");
      const block = urlParams.get("block");
      let configRes = await fetch("/localconfig");
      let localConfig = await configRes.json();
      let taskRes = await fetch(`/paradigms/${task}`);
      let taskConfig = await taskRes.json();
      let ampRes = await fetch(`/amplifiers`);
      let ampConfig = await ampRes.json();
      let ampParams = null;

      //initiate bci2000 script container
      let script = "";
      //Reset and restart
      script += "Reset System; ";
      script += "Startup System localhost; ";

      //declare executables
      if (localConfig.source != "") {
        script += `Start executable ${localConfig.source} --local; `;
        ampParams = ampConfig[localConfig.source];
      } else {
        script += `Start executable SignalGenerator --local; `;
        ampParams = ampConfig[localConfig.source];
      }
      if (
        Object.keys(taskConfig[instance].executables).includes("processing")
      ) {
        script += `Start executable ${
          taskConfig[instance].executables.processing
        } --local; `;
      } else {
        script += `Start executable DummySignalProcessing --local; `;
      }
      if (
        Object.keys(taskConfig[instance].executables).includes("application")
      ) {
        script += `Start executable ${
          taskConfig[instance].executables.application
        } --local; `;
      } else {
        script += `Start executable DummyApplication --local; `;
      }

      script += "Wait for Connected; ";

      script += `Set parameter SubjectName ${localConfig.subject}; `;
      // if (session) ret += "Set parameter SubjectSession " + session + "; ";
      script += "Set parameter DataFile ";
      script += '"%24%7bSubjectName%7d/' + task + "/%24%7bSubjectName%7d_";
      script += task + "_S%24%7bSubjectSession%7dR%24%7bSubjectRun%7d.";
      script += '%24%7bFileFormat%7d"; ';

      //Source parameters
      Object.keys(ampParams.setParameters).map(par => {
        script += `Set parameter ${par} ${ampParams.setParameters[par]}; `;
      });

      //Set parameters
      Object.keys(taskConfig[instance].setParameters).map(tskPrm => {
        script += `Set parameter ${tskPrm} ${
          taskConfig[instance].setParameters[tskPrm]
        }; `;
      });

      //Load parameters
      taskConfig[instance].loadParameters.map(tskPrm => {
        script += `Load parameterfile ${tskPrm}; `;
      });

      console.log(taskConfig[instance]);
      console.log(taskConfig[instance].Blocks);
      console.log(taskConfig[instance].Blocks.Block_1);


      taskConfig[instance].Blocks[block].loadParameters.map(tskPrm => {
        console.log(tskPrm)
        script += `Load parameterfile ${tskPrm}; `;
      });

      script += `Set config; `;
      script += `Start`;
      return script;
    })();
  }
}

// if (!Object.keys(params.executables).includes("source")) {
//   script += `Set Parameter SamplingRate 1000Hz; `;
// }

// Object.values(params.executables).map(executables => {
//   script += `Start executable ${executables} --local; `;
// });

// params.loadParameters.map(loadP => {
//   script += `Load Parameterfile ${loadP}; `;
// });
// Object.keys(params.setParameters).map(setP => {
//   script += `Set Parameter ${setP} ${params.setParameters[setP]} ; `;
// });

// script += `Set parameter SubjectName ${localConfig.subject}; `;

// script += "Set Config; ";
// script += "Wait for Resting; ";
// script += "Sleep 1; ";
// script += "Start; ";
