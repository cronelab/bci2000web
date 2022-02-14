import create from "zustand";
import { subscribeWithSelector } from "zustand/middleware";
import { persist } from "zustand/middleware";
import { mountStoreDevtool } from "simple-zustand-devtools";
import { BCI2K_OperatorConnection } from "bci2k";

export const useStore = create(
  // persist(
  subscribeWithSelector(() => ({
    task: {
      title: '',
      description: '',
      Blocks: ''
    },
    tasks: [],
    bci: new BCI2K_OperatorConnection(),
    config: {
      source: '',
      subject: '',
      dataDirectory: '',
      setParameters: {},
      operatorPath: '',
      HostIP: '',
      webPort: 80,

    },
    block: {
      title: '',
      block: ''
    },
    bciConfig: '',
    replayMode: false,
    subjects: [],
    replaySubject: "",
    replayTask: "",
    subjectSelected: "",
    researcher: '',
    badChannels: '',
    comments: ''
  }))

  // ,
  // {
  //   name: 'test',
  // }
  // )
);
mountStoreDevtool("Store", useStore);
