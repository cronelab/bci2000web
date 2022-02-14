import React, { useState } from "react";
export const Context = React.createContext({});

export const MyProvider = (props) => {
  const [tasks, setAllTasks] = useState([])
  const [subjects, setSubjects] = useState([])
  const [replaySubject, setReplaySubject] = useState([])
  const [task, setTask] = useState([])
  const [bci, setBCI] = useState();
  const [config, setConfig] = useState();
  const [block, setBlock] = useState({});
  const [bciConfig, setBciConfig] = useState('')
  const [replayMode, setReplayMode] = useState(false);
  const [replayTask, setReplayTask] = useState(null)
    return (
      <Context.Provider
        value={{
          tasks,
          setAllTasks,
          bci,
          setBCI,
          config,
          setConfig,
          task, 
          setTask,
          block,
          setBlock,
          bciConfig, setBciConfig,
          replayMode,
          setReplayMode,
          subjects, setSubjects,
          replaySubject, setReplaySubject,
          replayTask, setReplayTask
        }}>
        {props.children}
      </Context.Provider>
    );
  }
