import create from "zustand";
import { subscribeWithSelector } from "zustand/middleware";
import { BCI2K_OperatorConnection } from "bci2k";

export const useStore = create(
  // persist(
  subscribeWithSelector(() => ({
    task: {
      title: "",
      description: "",
      Blocks: ""
    },
    tasks: [],
    bci: new BCI2K_OperatorConnection(),
    config: {
      source: "",
      subject: "",
      dataDirectory: "",
      setParameters: {},
      operatorPath: "",
      HostIP: "",
      webPort: 80,
      editable: false,
      darkMode: true
    },
    block: {
      title: "",
      block: "",
    },
    bciConfig: "",
    replayMode: false,
    subjects: [],
    replaySubject: "",
    replayTask: "",
    subjectSelected: "",
    researcher: "",
    badChannels: "",
    comments: "",

  }))
);
