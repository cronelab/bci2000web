import { ListGroup, Card, ListGroupItem, Button, Modal, Form, FloatingLabel, Row, Col, Accordion } from "react-bootstrap";
import React, { useState, useEffect, useContext } from "react";
import { useStore } from "./store";
import NewTask from "./NewParadigm/NewTask";

const Paradigms = () => {
  const [paradigms, setParadigms] = useState([]);

  const [taskNum, setTaskNum] = useState(1);
  const [pName, setPName] = useState("");
  const [newParadigm, setNewParadigm] = useState({});
  const handleAnotherTask = () => {
    setTaskNum(taskNum + 1)
  }

  //modal control
  const [createParadigm, setShow] = useState(false);
  const handleClose = () => {
    setShow(false);
    setTaskNum(0);
  }
  const handleShow = () => {
    setTaskNum(1);
    setNewParadigm({});
    setShow(true);
  }
  const handleCancel = () => {
    if (Object.keys(newParadigm).length === 0 ) {
      handleClose();
    }
    else if (confirm("Close and lose all progress?") == true) {
      handleClose();
    }
  }
  async function postJSON(data) {
    console.log("creating json")
    console.log(newParadigm)
    try {
    const paradigmsReq = await fetch(`/api/paradigms/newParadigm?name=${pName}`, {method: "POST", 
                                                                  headers: {
                                                                    "Content-Type": "application/json",
                                                                  },
                                                                  body: JSON.stringify(newParadigm)});
    console.log("created json")
    console.log(paradigmsReq);
    const result = await paradigmsReq.json();
    console.log("success:", result);
    } catch (error) {
      console.error(`error: ${error}`);
    }
  }
  const handleSubmit = () => {
    postJSON(newParadigm);
    handleClose();
  }

  //child states for json population

useEffect(() => {
    (async () => {
      let paradigmsReq = await fetch("/api/paradigms");
      let paradigmsRes = await paradigmsReq.json();

      setParadigms(paradigmsRes);
      useStore;
    })();
  }, []);

  const taskSelect = async (e) => {
    let res = await fetch(`/api/paradigms/${e.target.innerHTML}`);
    let activeTask = await res.json();
    useStore.setState({ task: activeTask });
  };

  return (
    <>
    <Card className="text-center">
      <Card.Title><h3 className="text-center">Paradigms</h3></Card.Title>
      <Card.Body>
        <ListGroup>
          {paradigms.map((x) => {
            return (
              <ListGroupItem key={x.name} action onClick={taskSelect}>
                {x.name}
              </ListGroupItem>
            );
          })}
        </ListGroup>
        <Row className="justify-content-center" md="auto" style={{paddingTop: 5, display: useStore.getState().config.editable ? "flex" : "none"}}>
        <Button variant="primary" onClick={handleShow} >
            Create new Paradigm
        </Button>
        </Row>
      </Card.Body>
    </Card>
    
    <Modal show={createParadigm} onHide={handleCancel}>
        <Modal.Header closeButton>
          <Modal.Title>Create a new Paradigm!</Modal.Title>
        </Modal.Header>
        <Modal.Body>
            <FloatingLabel controlId="paradigmName" label="Paradigm name">
                <Form.Control type="text" placeholder="New paradigm name" onChange={(e) => setPName(e.target.value)}/>
            </FloatingLabel>
        <Accordion defaultActiveKey="1">
            {Array(taskNum)
            .fill(0)
            .map((x, idx) => (
              <NewTask key={idx} n={idx+1} pState={[newParadigm, setNewParadigm]} pName={pName}></NewTask>
            ))}
        </Accordion>
        <Button variant="secondary" onClick={handleAnotherTask}>
            Add another Task
        </Button>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCancel}>
            Close
          </Button>
          <Button  onClick={handleSubmit}>
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};
export default Paradigms;
