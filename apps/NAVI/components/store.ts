import create from "zustand";
import { subscribeWithSelector } from "zustand/middleware";
import { persist } from "zustand/middleware";
import { mountStoreDevtool } from "simple-zustand-devtools";
import { BCI2K_DataConnection, BCI2K_OperatorConnection } from "bci2k";

export const useStore = create(
  // persist(
  subscribeWithSelector(() => ({

    keyboardState: 'none',
    menuState: 'main',
    bciOperator: new BCI2K_OperatorConnection(),
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
    comments: '',
    subject: '',
    record: '',
    brain: '',
    geometry: '',
    homonculusSelection: '',
    activeElectrodes: '',
    cortStimParams: '',
    notes: '',
    recordName: '',
    taskName: '',
    numItems: 0,
    selectableElements: [],
    bciSource: new BCI2K_DataConnection,
    selectableRefs: [],
    currentJournalMessage: ''

  }))

  // ,
  // {
  //   name: 'test',
  // }
  // )
);
//@ts-ignore
mountStoreDevtool("Store", useStore);
