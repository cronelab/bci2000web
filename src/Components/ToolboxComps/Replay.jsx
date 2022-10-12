import {
  InputGroup,
  Card,
  Button,
} from "react-bootstrap";
import React, { useState, useEffect, useContext } from "react";
import { Context } from "../../MyProvider";

const ReplayTasks = () => {
  const { bci, replayTask, replaySubject, config } = useContext(Context);
  const [runs, setRuns] = useState([]);
  const [filterExec, setFilterExec] = useState('')
  const [stimPres, setStimPres] = useState(false);

  const runTask = dataFile => {
    let data = `${replaySubject}/${replayTask}/${dataFile}`;
    let ret = `Reset system;`;
    ret += `Startup system localhost;`;
    ret += `Start executable ${filterExec}; `;
    if(stimPres == false){
      ret += `Start executable DummyApplication; `;
    }
    else{
    ret += `Start executable StimulusPresentation_Timing; `;
    }
    ret += `Start executable FilePlayback --local --FileFormat=Null --PlaybackStates=1 --PlaybackFileName=../data/${data}.dat; `;
    ret += `Wait for Connected; `;
    ret += `Load Parameterfile ../parms/SpectralSigProc.prm; `;
    if(filterExec == 'ZMQ_Filter'){
      ret += "SET Parameter ZMQOutputServer *:5556; "
    }
    ret += 'Add State ControlClick 0 2'
    ret += `Set Parameter WSSpectralOutputServer *:20203; `;
    ret += `Set Parameter WSConnectorServer *:20323; `;
    ret += `Set Parameter WSSourceServer *:20100; `;
    if (Object.keys(config.setParameters).length > 0) {
      ret += `Set Parameter ${Object.keys(config.setParameters)[0]} ${
        config.setParameters[Object.keys(config.setParameters)[0]]
      }; `;
      ret += `Set Parameter ${Object.keys(config.setParameters)[1]} ${
        config.setParameters[Object.keys(config.setParameters)[1]]
      }; `;
    }
    ret += `Set Config; `;
    ret += `Wait for Resting; `;
    bci.execute(ret);
  };

  useEffect(() => {
    (async () => {
      let runReq = await fetch(`api/${replaySubject}/${replayTask}`);
      let allRuns = await runReq.json();
      setRuns(allRuns);

      let signalProcessingExecutable = prompt('Filter executable?')
      setFilterExec(signalProcessingExecutable)
    })();
  }, [replayTask]);

  return (
    <>
      <Card>
        <Card.Header>
          <Card.Title>
            <InputGroup>
              <InputGroup.Checkbox
                as
                Button
                onClick={e => setStimPres(e.target.checked)}
              />
            </InputGroup>
            <h3 className="text-center">Replay files</h3>
          </Card.Title>
        </Card.Header>
        {runs.map(y => (
          <Button key={y} id={y} title={y} onClick={() => runTask(y)}>
            {y}
          </Button>
        ))}
      </Card>
    </>
  );
};

const ReplayParadigms = () => {
  const [tasks, setTasks] = useState([]);
  const { replaySubject, setReplayTask } = useContext(Context);

  useEffect(() => {
    (async () => {
      let tasks = await fetch(`api/${replaySubject}`);
      let allTasks = await tasks.json();
      setTasks(allTasks);
    })();
  }, [replaySubject]);

  return (
    <>
      <Card>
        <Card.Header>
          <Card.Title>
            <h3 className="text-center">Replay files</h3>
          </Card.Title>
        </Card.Header>
        {tasks.map(y => (
          <Button key={y} id={y} title={y} onClick={() => setReplayTask(y)}>
            {y}
          </Button>
        ))}
      </Card>
    </>
  );
};

export { ReplayParadigms, ReplayTasks };

//@ts-check

// export const launchSession = (patient, task, file, dataDirectory) => {
//   var datafile = `${dataDirectory}/${patient}/${task}/${file}.dat`;
//   let filter = 'Spectral_WS'
//   if (task == 'CCEPS') filter = 'EvokedPotentialFilter'
//   var script = "Reset System; ";
//   script += "Startup System localhost; ";
//   script += `Start executable ${filter} --local; `;
//   script += "Start executable DummyApplication --local; ";
//   script += `Start executable FilePlayback --local --FileFormat=Null --PlaybackStates=1 --PlaybackFileName=${datafile}; `;

//   script += `Wait for Connected; `;
//   // script += "Load Parameterfile ../parms/SpectralSigProc.prm; ";
//   //Backwards compatibility
//   // script += "Load Parameterfile ../parms.ecog/SpectralSigProc.prm; ";

//   // script += "Set Parameter WSSourceServer *:20100; ";
//   // script += "Set Parameter WSSpectralOutputServer *:20203; ";
//   // script += "Set Parameter WSConnectorServer *:20323; ";

//   // script += "Set Config; ";
//   // script += "Wait for Resting; ";
//   // script += "Start; ";

//   return script;
// };
// const fetchSubjects = async () => {
//   let ddMenu = document.getElementById("replay-dropdown");
//   var arr = [].slice.call(ddMenu.children).map(x => x.remove());
//   let res = await fetch("/subjects");
//   let subjects = await res.json();

//   let subjBtnGroup = document.createElement("div");
//   subjects.map(subject => {
//     let ddItem = document.createElement("button");
//     ddItem.classList.add("btn");
//     ddItem.classList.add("btn-secondary");
//     ddItem.id = `${subject}-subject`;
//     ddItem.innerHTML = subject;
//     ddItem.style.width = "100%";

//     ddItem.onclick = e => {
//       e.preventDefault();
//       fetchData(subject);
//       e.stopPropagation();
//     };
//     subjBtnGroup.appendChild(ddItem);
//   });
//   ddMenu.appendChild(subjBtnGroup);
// };

// const fetchData = async subj => {
//   let ddMenu = document.getElementById("paradigms");
//   var arr = [].slice.call(ddMenu.children).map(x => x.remove());
//   let res = await fetch(`api/${subj}`);
//   let tasks = await res.json();
//   tasks.map(task => {
//     let taskList = document.createElement("li");
//     taskList.classList.add("list-group-item");
//     taskList.innerHTML = task;

//     taskList.onclick = async e => {
//       e.preventDefault();
//       let res = await fetch(`/api/${subj}/${task}`);
//       let dataFile = await res.json();
//       var arr = [].slice
//         .call(document.getElementById("data").children)
//         .map(x => x.remove());
//       dataFile.map(data => {
//         let dataList = document.createElement("li");
//         dataList.classList.add("list-group-item");
//         dataList.innerHTML = data;

//         dataList.onclick = event => {
//           event.preventDefault();
//           bci.execute(launchSession(subj, task, data, dataDirectory));
//           event.stopPropagation();
//         };
//         document.getElementById("data").appendChild(dataList);
//       });
//       e.stopPropagation();
//     };
//     document.getElementById("paradigms").appendChild(taskList);
//   });
// };
