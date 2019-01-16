import { bci } from "./index.js";

export const loadParadigms = async () => {
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

    let blocks = individualTaskKeys.Blocks;
    Object.keys(blocks).map(individualBlocks => {
      let individualBlock = blocks[`${individualBlocks}`];
      let blockButton = document.createElement("button");
      blockButton.classList.add("btn");
      blockButton.classList.add("btn-primary");
      blockButton.innerHTML = individualBlock.title;
      blockButton.onclick = async e => {
        console.log("RESET!");
        bci.resetSystem();
        await new Promise(resolve => setTimeout(resolve, 500));
        window.open(
          `/task.html?task=${taskName}&taskName=${individualTaskKeys.title.replace(
            /\s/g,
            ""
          )}&instance=${indTask}&block=${individualBlocks}`
        );
      };
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
  channels.forEach(function(ch, index) {
    let checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.id = ch;
    checkbox.addEventListener("change", function() {
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

      let _channels = channels.join(" ");
      let _channelBlock_ = channelBlock_.join(" ");
      let _totalChannels = totalChannels.join(" ");
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
};
