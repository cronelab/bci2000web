import "./task.scss";
import BCI2K from "bci2k";
var bci = new BCI2K.bciOperator();
import { CreateConfig } from "./configLoader";

window.onload = () => {
  bci.connect("wss://127.0.0.1").then(() => {
    console.log("connected");

  //   bci.onStateChange = e =>{
  //     if(e.trim() == "Idle"){
  //       window.close();
  //     }
  // }
  });
  getParametersForParadigm();
  setInterval(() => {
    bci
      .execute("Get System State", result => result)
      .then(state => {
        if (state.trim() == "Idle") {
          window.close();
        }
      });
  }, 1000);
};

const getParametersForParadigm = async () => {
  const urlParams = new URLSearchParams(window.location.search);
  const task = urlParams.get("task");
  const instance = urlParams.get("instance");
  const block = urlParams.get("block");
  let configurer = new CreateConfig();
  let config = await configurer.creator(task);
  bci.execute(config);
  document.title = `${task}: ${instance}`;
  await new Promise(resolve => setTimeout(resolve, 3500));

  tapSockets(bci);
};

// window.addEventListener("unload", e => bci.resetSystem());