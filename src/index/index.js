import "./index.scss";
import BCI2K from "@cronelab/bci2k";
import "bootstrap";
import "@fortawesome/fontawesome-free/js/all";
import { launchSession } from "./replay.js";
import { loadParadigms, getChannels } from "./getData";
export const bci = new BCI2K.bciOperator();
export const bciData = new BCI2K.bciData();

window.onload = () => {
  sessionStorage.clear();

  bci.connect("ws://127.0.0.1");
  bci.onconnect = e => {
    bci.onStateChange = e => {
      updateState(e.trim());
    };
  };
  loadParadigms();

  document.getElementById("replay-subject").onclick = () => {
    fetchSubjects();
  };

  document.getElementById("queryChannels").onclick = () => {
    getChannelNames(bci);
  };
  document.getElementById("webFM").onclick = () => {
    window.open("http://zappa.neuro.jhu.edu:8080/map/?view=WebFM:%20Map");
  };
  document.getElementById("reset-button").onclick = e => {
    e.preventDefault();
    bci.execute("Reset System; ");
  };
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

const getChannelNames = async bci => {
  bciData.connect("127.0.0.1:20100").then(y => {
    bciData.onSignalProperties = x => {
      getChannels(x.channels);
    };
  });
};

const fetchSubjects = async () => {
  let ddMenu = document.getElementById("replay-dropdown");
  var arr = [].slice.call(ddMenu.children).map(x => x.remove());
  let res = await fetch("/subjects");
  let subjects = await res.json();

  let subjBtnGroup = document.createElement("div");
  subjects.map(subject => {
    let ddItem = document.createElement("button");
    ddItem.classList.add("btn");
    ddItem.classList.add("btn-secondary");
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
  let ddMenu = document.getElementById("paradigms");
  var arr = [].slice.call(ddMenu.children).map(x => x.remove());
  let res = await fetch(`api/${subj}`);
  let tasks = await res.json();
  tasks.map(task => {
    let taskList = document.createElement("li");
    taskList.classList.add("list-group-item");
    taskList.innerHTML = task;
    taskList.onclick = async e => {
      e.preventDefault();
      let res = await fetch(`/api/${subj}/${task}`);
      let dataFile = await res.json();
      var arr = [].slice
        .call(document.getElementById("data").children)
        .map(x => x.remove());
      dataFile.map(data => {
        let dataList = document.createElement("li");
        dataList.classList.add("list-group-item");
        dataList.innerHTML = data;
        dataList.onclick = event => {
          event.preventDefault();
          bci.execute(launchSession(subj, task, data));
          event.stopPropagation();
        };
        document.getElementById("data").appendChild(dataList);
      });
      e.stopPropagation();
    };
    document.getElementById("paradigms").appendChild(taskList);
  });
};

window.onbeforeunload = function(e) {
  bci.resetSystem();
};
