import { ListGroup, Card, ListGroupItem, Button, Modal, Form, FloatingLabel, Row, Col, Accordion } from "react-bootstrap";
import React, { useState, useEffect, useContext } from "react";
import Parameter from "./Parameters"

const NewBlock = (data) => {
  let task = data.pState[0]
  let setNewTask = data.pState[1]
  const [blockName, setBlockName] = useState("");
  const [prms, setPrms] = useState([]);

  const handlePrms = (e) => {
    console.log(e.target.value)
    prms.push(e.target.value);
    setPrms(prms)
  }

  const setParadigmState = () => {
    //organize for task.json
    let thisP = {
      title: blockName,
      loadParameters: prms}
    task["Block_" + data.n] = thisP
    setNewTask(task)
  }

  return (
    <Accordion.Item eventKey={data.n.toString()} onChange={setParadigmState}>
      <Accordion.Header>Block {data.n}</Accordion.Header>
      <Accordion.Body>
      <FloatingLabel controlId="blockName" label="Block name">
          <Form.Control type="text" placeholder="New block name" onChange={(e) => setBlockName(e.target.value)}/>
      </FloatingLabel>
        <Parameter prmState={[prms, setPrms]}/>
      </Accordion.Body>
    </Accordion.Item>
  );
};
export default NewBlock;
