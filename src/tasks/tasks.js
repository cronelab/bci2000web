import BCI2K from "bci2k";
var bci = new BCI2K();
let state = "Loading...";
let trials = 0;
let curCode = null;
import "./task.scss";

window.onload = () => {
  getParametersForParadigm();
  bci.connect("127.0.0.1");


};

const tapSockets = async () => {
  let spectralConnection = await bci.tap("Source");
  spectralConnection.onStateVector = states => {
    if (
      states.hasOwnProperty("StimulusCode") &&
      states.StimulusCode[0] != curCode
    ) {
      curCode = states.StimulusCode[0];
      if (curCode) {
        trials++;
      }
    }
  };
  updateState();

};

function updateState() {
  bci.execute("Get System State", result => state = result.output);
  requestAnimationFrame(draw);
  setTimeout(updateState, 1000);
}

function draw(time) {
  let canvas = document.getElementById("stim");
  let context = canvas.getContext("2d");

  context.clearRect(0, 0, canvas.width, canvas.height);
  var cx = canvas.width / 2.0;
  var cy = canvas.height / 2.0;

  context.textAlign = "center";
  context.textBaseline = "middle";
  context.font = "20px arial";
  context.fillStyle = "white";
  context.fillText(document.title, cx, cy);
  context.font = "12px arial";
  if (state.search("Suspended") >= 0)
    context.fillText('Click "Back" to Finish Paradigm', cx, cy + 50);
  else {
    if (trials == 0) context.fillText("Getting Ready...", cx, cy + 50);
    else context.fillText("Trials: " + trials.toString(), cx, cy + 50);
  }
}

const bciScript = async x => {
  let configRes = await fetch("/localconfig");
  let localConfig = await configRes.json();

  let script = "";

  script += "Reset System; ";
  script += "Startup System localhost; ";

  Object.values(x.executables).map(executables => {
    script += `Start executable ${executables} --local; `;
  });

  script += "Wait for Connected; ";

  x.loadParameters.map(loadP => {
    script += `Load Parameterfile ${loadP}; `;
  });
  Object.keys(x.setParameters).map(setP => {
    script += `Set Parameter ${setP} ${x.setParameters[setP]} ; `;
  });

  script += `Set parameter SubjectName ${localConfig.subject}; `;

  script += "Set Config; ";
  script += "Wait for Resting; ";
  script += "Sleep 1; ";
  script += "Start; ";

  bci.execute(script);
  await new Promise(resolve => setTimeout(resolve, 3000));

  tapSockets();
};

const getParametersForParadigm = async () => {
  const urlParams = new URLSearchParams(window.location.search);
  const task = urlParams.get("task");
  const instance = urlParams.get("instance");
  const block = urlParams.get("block");
  let paramRes = await fetch(`/paradigms/${task}/run`);
  let parameters = await paramRes.json();
  bciScript(parameters);
  document.title = `${task}: ${instance}`
};

bci.onconnect = e => {
  console.log("connected");
};
window.onbeforeunload = function() {
  if (bci.connected()) {
    bci.resetSystem();
  }
};
