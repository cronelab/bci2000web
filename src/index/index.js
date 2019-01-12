import "./index.scss";
import BCI2K from "bci2k";
import "bootstrap";
import "@fortawesome/fontawesome-free/js/all";

window.onload = () => {
  let bci = new BCI2K();

//   languagePluginLoader.then(() => {
//     // pyodide is now ready to use...
//     console.log(pyodide.runPython("import sys\nsys.version"));
//     pyodide.loadPackage("numpy").then(() => {
//       pyodide.runPython("import numpy as np");
//       pyodide.runPython("np.zeros((16, 16))");
//     });
//     pyodide.loadPackage("matplotlib");
//   });

  bci.connect("127.0.0.1");
  bci.onconnect = e => {
    console.log("Connected");

    setInterval(() => {
      bci
        .execute("Get System State", result => result)
        .then(x => {
          updateState(x.trim());
        });
    }, 1000);
  };
  loadParadigms();

  document.getElementById("replay-subject").onclick = () => {
    fetchSubjects();
  };
};

const loadParadigms = async () => {
  let res = await fetch("/paradigms");
  let paradigms = await res.json();
  paradigms.map(paradigm => {
    let paradigmList = document.createElement("li");
    paradigmList.classList.add("list-group-item");
    paradigmList.innerHTML = paradigm.name;
    paradigmList.onclick = function(e) {
      e.preventDefault();
      loadTask(e.target.innerHTML);
    };
    document.getElementById("paradigms").appendChild(paradigmList);
  });
};

const loadTask = async taskName => {
  var arr = [].slice
    .call(document.getElementById("task-card").children)
    .map(x => x.remove());
  let res = await fetch(`/paradigms/${taskName}`);
  let task = await res.json();
  let header = document.createElement("h3");
  header.classList.add("card-header");
  header.id = "task-card";
  header.innerHTML = taskName;
  document.getElementById("task-card").appendChild(header);

  let taskKeys = Object.keys(task);
  taskKeys.map(indTask => {
    let individualTaskKeys = task[`${indTask}`];
    let taskTitle = document.createElement("div");
    taskTitle.classList.add("card-title");
    taskTitle.innerHTML = `<strong>${individualTaskKeys.title}</strong>`;

    let cardBody = document.createElement("div");
    cardBody.classList.add("card-body");

    let cardText = document.createElement("p");
    cardText.classList.add("card-text");
    cardText.innerHTML = individualTaskKeys.description;
    cardBody.appendChild(cardText);

    document.getElementById("task-card").appendChild(taskTitle);
    document.getElementById("task-card").appendChild(cardBody);

    let blocks = individualTaskKeys.Blocks;
    Object.keys(blocks).map(individualBlocks => {
      let individualBlock = blocks[`${individualBlocks}`];
      let blockButton = document.createElement("a");
      blockButton.href = `/task.html?task=${taskName}&instance=${indTask}&block=${individualBlocks}`;
      blockButton.classList.add("btn");
      blockButton.classList.add("btn-primary");
      blockButton.innerHTML = individualBlock.title;
      document.getElementById("task-card").appendChild(blockButton);
    });
  });
};

const fetchSubjects = async () => {
  let ddMenu = document.getElementById("replay-dropdown");
  var arr = [].slice.call(ddMenu.children).map(x => x.remove());
  let res = await fetch("/subjects");
  let subjects = await res.json();

  let subjBtnGroup = document.createElement("div");
  subjBtnGroup.classList.add("btn-group");
  subjBtnGroup.classList.add("dropright");

  subjects.map(subject => {
    let ddItem = document.createElement("button");
    ddItem.classList.add("btn");
    ddItem.classList.add("btn-secondary");
    ddItem.classList.add("dropdown-toggle");
    // ddItem.classList.add('dropright')
    ddItem.id = `${subject}-subject`;
    ddItem.innerHTML = subject;
    ddItem.style.width = "100%";

    ddItem.onclick = e => {
      e.preventDefault();
      fetchData(subject);
      e.stopPropagation();
    };
    subjBtnGroup.appendChild(ddItem);
  });
  ddMenu.appendChild(subjBtnGroup);
};

const fetchData = async subj => {
  let res = await fetch(`api/${subj}`);
  let tasks = await res.json();
  // let taskContainer = document.createElement('div')
  // taskContainer.classList.add('dropdown')
  // let taskMenu = document.createElement('div');
  // taskMenu.classList.add('show')

  // taskMenu.classList.add('dropdown-menu')

  tasks.map(task => {
    let taskButton = document.createElement("button");
    taskButton.classList.add("btn");
    taskButton.classList.add("btn-info");
    taskButton.classList.add("dropdown-toggle");

    taskButton.id = `${task}-task`;
    taskButton.innerHTML = task;
    taskButton.onclick = async e => {
      e.preventDefault();
      // let taskItem = document.createElement('a')
      let res = await fetch(`/api/${subj}/${task}`);
      let dataFile = await res.json();
      dataFile.map(data => {
        console.log(data);
      });
      e.stopPropagation();
    };
    // taskItem.onclick = async (e) => {
    //     e.preventDefault();
    //

    // }
    // taskItem.href = "#"
    // taskItem.classList.add('dropdown-item')
    // taskItem.innerHTML = task;
    // taskMenu.appendChild(taskItem)
    document.getElementById(`${subj}-subject`).appendChild(taskButton);
  });
  // taskContainer.appendChild(taskMenu);
};

const launchSession = (patient, task, file) => {
  var datafile = `../data/${patient}/${task}/${file}.dat`;

  var script = "Reset System; ";
  script += "Startup System localhost; ";
  script += "Start executable SpectralSignalProcessingMod --local; ";
  script += "Start executable DummyApplication --local; ";
  script +=
    "Start executable FilePlayback --local --FileFormat=Null --PlaybackStates=1 --PlaybackFileName=" +
    datafile +
    "; ";

  script += "Wait for Connected; ";
  script += "Load Parameterfile ../parms.ecog/SpectralSigProc.prm; ";

  script += "Set Parameter WSSpectralOutputServer *:20203; ";
  script += "Set Parameter WSConnectorServer *:20323; ";
  script += "Set Parameter WSSourceServer *:20100; ";

  script += "Wait for Connected; ";
  script += "Load Parameterfile ../parms.ecog/SpectralSigProc.prm; ";

  script += "Set Parameter WSSpectralOutputServer *:20203; ";
  script += "Set Parameter WSConnectorServer *:20323; ";
  script += "Set Parameter WSSourceServer *:20100; ";

  script += "Set Config; ";
  script += "Wait for Resting; ";
  script += "Start; ";

  bci.execute(script);
};

const getChannels = () => {
  bci.execute("List Parameter channelNames", function(result) {
    var totalChannels = result.output
      .substring(result.output.indexOf("="), result.output.indexOf("//") - 1)
      .split(" ")
      .slice(2);
    var channels = result.output
      .substring(result.output.indexOf("="), result.output.indexOf("//") - 1)
      .split(" ")
      .slice(2);

    let channelTable = document.getElementById("classTable");

    excludedChannels = [];

    channels.forEach(function(ch, index) {
      let checkbox = document.createElement("input");
      checkbox.type = "checkbox";
      checkbox.id = ch;

      checkbox.addEventListener("change", function() {
        if (this.checked) {
          document.getElementById(this.id).parentElement.style.background =
            "red";
          excludedChannels.push(document.getElementById(this.id).id);
        } else {
          document.getElementById(this.id).parentElement.style.background = "";
          excludedChannels.splice(
            excludedChannels.indexOf(document.getElementById(this.id).id),
            1
          );
        }
      });

      let newRow = channelTable.insertRow(index + 1);
      newRow.insertCell(0).innerHTML = ch;
      newRow.insertCell(1).appendChild(checkbox);
    });

    document.getElementById("channelSelector").modal("show");

    var textFile = null,
      makeTextFile = function(text) {
        var data = new Blob([text], { type: "text/plain" });
        if (textFile !== null) {
          window.URL.revokeObjectURL(textFile);
        }
        textFile = window.URL.createObjectURL(data);
        return textFile;
      };

    let saveButton = document.getElementById("saveButton");

    saveButton.addEventListener(
      "click",
      function() {
        var link = document.createElement("a");
        link.setAttribute("download", "CAR.prm");

        excludedChannels.forEach(exCh => {
          for (let i = channels.length; i--; ) {
            if (channels[i] === exCh) channels.splice(i, 1);
          }
        });
        _excludedChannels = excludedChannels.join(" ");
        let chBlock = [];
        let channelBlock_ = [];
        let channelBlock = [];
        channels.forEach(ch => {
          ch.split("").forEach(function(letter) {
            if (isNaN(parseInt(letter, 10))) {
              chBlock.push(letter);
            } else {
              if (chBlock.length != 0) {
                channelBlock_.push(chBlock.join(""));
                chBlock = [];
              }
            }
          });
        });

        _channels = channels.join(" ");
        _channelBlock_ = channelBlock_.join(" ");
        _totalChannels = totalChannels.join(" ");
        let carParameters = `Filtering:SimpleCAR:SimpleCAR:FilePlaybackADC int EnableSimpleCAR= 2 0 0 2
Filtering:SimpleCAR:SimpleCAR:FilePlaybackADC stringlist ExcludeChannels= ${
          excludedChannels.length
        } ${_excludedChannels}
Filtering:SimpleCAR:SimpleCAR stringlist CARChannels= ${
          channels.length
        } ${_channels}
Filtering:SimpleCAR:SimpleCAR stringlist CARBlocks= ${
          channelBlock_.length
        } ${_channelBlock_}
Filtering:SimpleCAR:SimpleCAR stringlist CAROutputChannels= ${
          totalChannels.length
        } ${_totalChannels}`;

        link.href = makeTextFile(carParameters);
        document.body.appendChild(link);
        window.requestAnimationFrame(function() {
          var event = new MouseEvent("click");
          link.dispatchEvent(event);
          document.body.removeChild(link);
        });
      },
      false
    );
  });
};

const onlyUnique = (value, index, self) => {
  return self.indexOf(value) === index;
};

const updateState = state => {
  document.getElementById(
    "state-label"
  ).innerHTML = `<strong>${state}</strong>`;

  let stateClasses = {
    Running: "text-success",
    Suspended: "text-warning",
    Idle: "text-info"
  };
  // Clear existing classes
  Object.keys(stateClasses).map(key => {
    document.getElementById("state-label").classList.remove(stateClasses[key]);
    document.getElementById("state-label").classList.remove("text-muted");
  });

  if (stateClasses[state])
    document.getElementById("state-label").classList.add(stateClasses[state]);
};
