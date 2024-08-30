import { ListGroup, Card, InputGroup, Button, Modal, Form, FloatingLabel, Row, Col, Accordion } from "react-bootstrap";
import React, { useState, useEffect, useContext } from "react";
import NewBlock from "./NewBlock";
import Parameter from "./Parameters";
import { useStore } from "../store";

const NewTask = (data) => {
  let pName = data.pName
  let paradigm = data.pState[0]
  let setNewParadigm = data.pState[1]
  const [procEnabled, setProcMod] = useState(false);
  const [procValid, setProcValid] = useState(true);
  const [appEnabled, setAppMod] = useState(false);
  const [appValid, setAppValid] = useState(true);
  const [prms, setPrms] = useState([]);
  //task control
  const exeProc = "procID";
  const exeApp = "appID";
  let defaultTask = {
    name: "",
    description: "",
    [exeProc]: "",
    [exeApp]: "",
    nBlocks: 1
  }
  const [task, setTask] = useState(defaultTask);
  //task name control
  const handleTaskNameChange = async (e) => {
    let t = e.target.value;
    if (t.length === 0)
      setTask({
        ...task,
        name: ""
      });
    else
      setTask({
        ...task,
        name: "(" + t + ")"
      });
    
    //setParadigmState();
  }

  const setParadigmState = () => {
    //organize for task.json
    let thisP = {
                  title: task.name.replace(new RegExp("\\(|\\)", "g"), ""),
                  description: task.description,
                  executables: {
                    processing: task[exeProc],
                    application: task[exeApp]
                  },
                  setParameters: {},
                  loadParameters: prms,
                  Blocks: newTask
                }
    paradigm["Task_" + data.n] = thisP
    setNewParadigm(paradigm)
  }
  const handleFileInput = (e) => {
    if (e.target.files.length != 0) {
      let newFile = e.target.files[0].name
      useStore.getState().bci.execute(`Categorize Executable ${newFile}`).then((value) => {
        console.log(value);
        let enabled = false;
        switch (e.target.id) {
          case exeProc:
            if (value === 'SignalProcessing') {
              enabled = true;
              setProcValid(true);
              console.log(newFile)
              if (newFile === 'DummySignalProcessing.exe') {
                setProcMod(false);
              }
            }
            else {
              setProcValid(false);
            }
            break;
          case exeApp:
            if (value === 'Application') {
              enabled = true;
              setAppValid(true);
              if (newFile === 'DummyApplication.exe') {
                setAppMod(false);
              }
            }
            else {
              setAppValid(false);
            }
            //setAppMod(enabled);
            break;
        }
        if (enabled === true) {
        setTask({...task, [e.target.id]: newFile})
        }
      });
    }
    else {
      switch (e.target.id) {
        case exeProc:
          setProcMod(false);
          break;
        case exeApp:
          setAppMod(false);
          break;
      }
    }
  }

  const handleDefaultModuleClick= (e) => {
    console.log(e)
  }
  
  const [newTask, setNewTask] = useState({});

  return (
    <Accordion.Item key={data.n} eventKey={data.n.toString()}>
        <Accordion.Header>Task {data.n} {task.name}</Accordion.Header>
        <Accordion.Body>
        <Form onChange={setParadigmState} >
            <FloatingLabel controlId="taskName" label="Task name">
                <Form.Control type="text" placeholder="New task name" onChange={(e) => handleTaskNameChange(e)}/>
            </FloatingLabel>
            
            <FloatingLabel controlId="taskDesc" label="Task description">
                <Form.Control type="text" placeholder="New task description" onChange={(e) => setTask({...task, description: e.target.value})} />
            </FloatingLabel>

            <Form.Group as={Row} key="exeProc" className="align-items-center" controlId={exeProc} validated={procValid.toString()}>
              <Form.Label column>Signal Processing Module</Form.Label>
              <Col xs="auto">
                <Form.Switch
                  reverse
                  id="procModule"
                  label="Use Default"
                  //onClick={handleDefaultModuleClick}
                  onChange={(e) => setProcMod(!procEnabled)}
                  //defaultChecked
                  checked={!procEnabled}
                />
              </Col>
              <Col xs="auto">
                <Form.Control accept=".exe" type="file" onChange={handleFileInput} disabled={!procEnabled} isInvalid={!procValid}/>
                <Form.Control.Feedback type="invalid">
                  Please choose a Signal Processing module.
                </Form.Control.Feedback>
              </Col>
            </Form.Group>

            <Form.Group as={Row} className="align-items-center" controlId={exeApp}>
              <Form.Label column>Application Module</Form.Label>
              <Col xs="auto">
                <Form.Switch
                  reverse
                  id="appModule"
                  label="Use Default"
                  //onClick={() => setAppMod(!appEnabled)}
                  onChange={(e) => setAppMod(!appEnabled)}
                  //defaultChecked
                  checked={!appEnabled}
                />
              </Col>
              <Col xs="auto" >
                <Form.Control accept=".exe" type="file" onChange={handleFileInput} disabled={!appEnabled} isInvalid={!appValid}/>
                <Form.Control.Feedback type="invalid">
                  Please choose an Application module.
                </Form.Control.Feedback>
              </Col>
            </Form.Group>
            <Parameter pName={pName} prmState={[prms, setPrms]} title="Choose parameter files (applied to every block)"/>
            <Accordion defaultActiveKey="1">
              {Array(task.nBlocks)
              .fill(0)
              .map((x, idx) => (
                  <NewBlock key={idx} n={idx+1} pState={[newTask, setNewTask]}></NewBlock>
              ))}
            </Accordion>
            <Button variant="secondary" onClick={() => setTask({...task, nBlocks: task.nBlocks + 1})}>
                Add another Block
            </Button>
        </Form>
        </Accordion.Body>
    </Accordion.Item>
  );
};
export default NewTask;
