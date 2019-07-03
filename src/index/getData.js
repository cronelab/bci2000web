import {
  bci
} from "./index.js";

export const loadParadigms = async () => {
  let res = await fetch("/paradigms");
  let paradigms = await res.json();
  paradigms.map(paradigm => {
    let paradigmList = document.createElement("li");
    paradigmList.classList.add("list-group-item");
    paradigmList.innerHTML = paradigm.name;
    paradigmList.onclick = function (e) {
      e.preventDefault();
      loadTask(e.target.innerHTML);
    };
    document.getElementById("paradigms").appendChild(paradigmList);
  });
};

export const loadTask = async taskName => {
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
    if(individualTaskKeys.uiInput){
      let stim1field = document.createElement("input");
      let stim2field = document.createElement("input");
      let stimintensityfield = document.createElement("input");
      let stimratefield = document.createElement("input");
      stim1field.setAttribute('type','text')
      stim1field.setAttribute('value','Stimulating channel 1 (index)')
      stim1field.setAttribute('id','stimChannel1')
      stim1field.style = "width: 90%"
      stim2field.setAttribute('type','text')
      stim2field.setAttribute('value','Stimulating channel 2 (index)')
      stim2field.setAttribute('id','stimChannel2')
      stim2field.style = "width: 90%"

      stimintensityfield.setAttribute('type','text')
      stimintensityfield.setAttribute('value','Stimulation intensity (microamps)')
      stimintensityfield.setAttribute('id','stimIntensity')
      stimintensityfield.style = "width: 90%"

      stimratefield.setAttribute('type','text')
      stimratefield.setAttribute('value','Stimulation rate (milliseconds)')
      stimratefield.setAttribute('id','stimRate')
      stimratefield.style = "width: 90%"

      cardBody.appendChild(stim1field);
      cardBody.appendChild(stim2field);
      cardBody.appendChild(stimintensityfield);
      cardBody.appendChild(stimratefield);
    }
    let blocks = individualTaskKeys.Blocks;
    Object.keys(blocks).map((individualBlocks, i) => {
      let individualBlock = blocks[`${individualBlocks}`];
      let blockButton = document.createElement("button");
      blockButton.classList.add("btn");
      blockButton.classList.add("btn-primary");
      blockButton.innerHTML = individualBlock.title;
      blockButton.onclick = async e => {
        let datComment = document.getElementById("datComment");
        localStorage.setItem("datComment", datComment.value);
        if(individualTaskKeys.uiInput){
          localStorage.setItem("hasInput", true);
          localStorage.setItem("stim1field", document.getElementById("stimChannel1").value);
          localStorage.setItem("stim2field", document.getElementById("stimChannel2").value);
          localStorage.setItem("stimintensityfield", document.getElementById("stimIntensity").value);
          localStorage.setItem("stimratefield", document.getElementById("stimRate").value); 
          sessionStorage.setItem("test","testinggg");
        }
        if(!document.getElementById('newBlock').checked){
          bci.resetSystem();
          await new Promise(resolve => setTimeout(resolve, 500));
          window.open(
            `/task.html?task=${taskName}&taskName=${individualTaskKeys.title.replace(
              /\s/g,
              ""
            )}&instance=${indTask}&block=${individualBlocks}`
          );
        }
        else{
          let script = ``;
          script += `Suspend; `;
          if(individualBlock.loadParameters[0]){
            script += `Load parameterfile ${individualBlock.loadParameters[0]}; `;
          }
          script += `Set parameter SubjectSession ${i+1}; `;
          script += "Set parameter DataFile ";
          script += '"%24%7bSubjectName%7d/' + individualTaskKeys.title.replace(
            /\s/g,
            ""
          ) + "/%24%7bSubjectName%7d_";
          script += `${individualTaskKeys.title.replace(
            /\s/g,
            ""
          )}_S%24%7bSubjectSession%7dR%24%7bSubjectRun%7d_${localStorage.getItem("datComment")}.`;
          script += '%24%7bFileFormat%7d"; ';
          script += `Set Config; `;
          bci.execute(script);
        }  
        }
      document.getElementById("task-card").appendChild(blockButton);
    });
  });
};

export const getChannels = chs => {
  let totalChannels = chs;
  let channels = chs;
  let channelTable = document.getElementById("classTable");
  let excludedChannels = [];
  let _excludedChannels = [];
  channels.forEach(function (ch, index) {
    let checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.id = ch;
    checkbox.addEventListener("change", function () {
      if (this.checked) {
        document.getElementById(this.id).parentElement.style.background = "red";
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

  var textFile = null,
    makeTextFile = function (text) {
      var data = new Blob([text], {
        type: "text/plain"
      });
      if (textFile !== null) {
        window.URL.revokeObjectURL(textFile);
      }
      textFile = window.URL.createObjectURL(data);
      return textFile;
    };

  let saveButton = document.getElementById("saveButton");

  saveButton.addEventListener(
    "click",
    function () {
      var link = document.createElement("a");
      link.setAttribute("download", "CAR.prm");

      excludedChannels.forEach(exCh => {
        for (let i = channels.length; i--;) {
          if (channels[i] === exCh) channels.splice(i, 1);
        }
      });
      _excludedChannels = excludedChannels.join(" ");
      let chBlock = [];
      let channelBlock_ = [];
      let channelBlock = [];
      channels.forEach(ch => {
        ch.split("").forEach(function (letter) {
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

      //TODO Reverse the order onexcludedChannels

      let _channels = channels.join(" ");
      let _channelBlock_ = channelBlock_.join(" ");
      let _totalChannels = totalChannels.join(" ");
      let carParameters = `Filtering:SimpleCAR:SimpleCAR:FilePlaybackADC int EnableSimpleCAR= 1 0 0 2
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
  excludedChannels.length + channels.length
      } ${_channels} ${_excludedChannels}`;

      link.href = makeTextFile(carParameters);
      document.body.appendChild(link);
      window.requestAnimationFrame(function () {
        var event = new MouseEvent("click");
        link.dispatchEvent(event);
        document.body.removeChild(link);
      });
    },
    false
  );
};