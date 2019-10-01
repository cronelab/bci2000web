import "./task.scss";
import BCI2K from "bci2k";
let bci = new BCI2K.bciOperator();
let bciSourceData = new BCI2K.bciData();
import {
  CreateConfig
} from "./configLoader";

window.onload = () => {
  bci.connect("wss://127.0.0.1").then(() => {
    console.log("connected");
    getParametersForParadigm();
  });
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
  await new Promise(resolve => setTimeout(resolve, 7000));
  // /  tapSockets(bci);
};

// window.addEventListener("unload", e => bci.resetSystem());