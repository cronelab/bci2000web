export class CreateConfig {

  async creator(task2) {

    const urlParams = new URLSearchParams(window.location.search);

    const task = urlParams.get("task");
    const taskTitle = urlParams.get("taskName");
    const instance = urlParams.get("instance");
    const block = urlParams.get("block");
    let configRes = await fetch("/localconfig");
    let localConfig = await configRes.json();
    let taskRes = await fetch(`/paradigms/${task2}`);
    let taskConfig = await taskRes.json();
    let ampRes = await fetch(`/amplifiers`);
    let ampConfig = await ampRes.json();
    let ampParams = null;

    let script = "";


    //initiate bci2000 script container
    //Reset and restart
    script += "Reset System; ";


    if (taskConfig[instance].addEvents.length >= 1) {
      taskConfig[instance].addEvents.forEach(event => {
        script += `Add Event ${event}; `;
      })
    }
    if (taskConfig[instance].addStates.length >= 1) {
      taskConfig[instance].addStates.forEach(state => {
        script += `Add State ${state}; `;
      })
    }

    script += "Startup System localhost; ";

    let userPrompt = null;
    if (taskConfig[instance].userPrompt.length > 0) {
      let res = confirm(`${Object.keys(taskConfig[instance].userPrompt[0])}`);
      if (res == true) {
        userPrompt = Object.values(taskConfig[instance].userPrompt[0]);
      }
    }

    let taskScript = fetch(`/paradigms/${task}/task`)
    let response = taskScript.then(res => res.text())
    response.then(y => {
      let script = document.createElement('script')
      document.body.appendChild(script);
      script.innerHTML = y
    })

    //declare executables
    if (userPrompt != null) {
      script += `Start executable ${
          localConfig.source
        } --local ${userPrompt}; `;
    } else {
      script += `Start executable ${localConfig.source} --local; `;
      console.log(localConfig.source)
    }

    ampParams = ampConfig[localConfig.source];

    if (
      Object.keys(taskConfig[instance].executables).includes("processing")
    ) {
      script += `Start executable ${
          taskConfig[instance].executables.processing
        }; `;
    } else {
      script += `Start executable DummySignalProcessing --local; `;
    }
    console.log(script);
    if (
      Object.keys(taskConfig[instance].executables).includes("application")
    ) {
      script += `Start executable ${
          taskConfig[instance].executables.application
        } --local; `;
    } else {
      script += `Start executable DummyApplication --local; `;
    }
    //Add additional parameters
    taskConfig[instance].addParameters.map(tskPrm => {
      script += `Add parameter ${tskPrm}; `;
    });
    script += "Wait for Connected; ";

    script += `Set parameter SubjectName ${localConfig.subject}; `;
    if (block)
      script += "Set parameter SubjectSession " + block.substring(6) + "; ";
    script += "Set parameter DataFile ";
    script += '"%24%7bSubjectName%7d/' + taskTitle + "/%24%7bSubjectName%7d_";
    script += `${taskTitle}_S%24%7bSubjectSession%7dR%24%7bSubjectRun%7d_${localStorage.getItem("datComment")}.`;
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

    //Load task parameters
    taskConfig[instance].loadParameters.map(tskPrm => {
      script += `Load parameterfile ${tskPrm}; `;
    });

    //Load block parameters
    taskConfig[instance].Blocks[block].loadParameters.map(tskPrm => {
      script += `Load parameterfile ${tskPrm}; `;
    });
    if (taskConfig[instance].executables.processing != 'DummySignalProcessing') {
      script += `Set parameter WSSpectralOutputServer *:20203; `;
    }
    // if (localStorage.getItem("hasInput") == "true") {
    //   let stimChan1 = localStorage.getItem("stim1field")
    //   let stimChan2 = localStorage.getItem("stim2field")
    //   let stimIntensity = localStorage.getItem("stimintensityfield")
    //   let stimRate = localStorage.getItem("stimratefield")
    //   script += `Set Parameter stimCh1 ${stimChan1}; `;
    //   script += `Set Parameter stimCh2 ${stimChan2}; `;
    //   script += `Set Parameter stimIntensity ${stimIntensity}; `;
    //   script += `Set Parameter stimRate ${stimRate}; `;
    // }

    script += `Set parameter WSConnectorServer *:20323; `;
    script += `Set parameter WSSourceServer *:20100; `;

    script += `Set config; `;
    script += `Start`;
    return script;
  };

}