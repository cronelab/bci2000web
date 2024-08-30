import { Container, Card, ListGroupItem, Button, Modal, Form, FloatingLabel, Row, Col, ToggleButton, ToggleButtonGroup } from "react-bootstrap";
import React, { useState, useEffect, useContext } from "react";
import { useStore } from "../store";
import { updateLocalConfig } from "./ConnectionState";
//import fs from "fs";
const ParameterDescription = (input) => {
  const prm = input.prm;
  const checkPrm = (prm) => {
    //recursively print object
    if (prm.constructor === ({}).constructor) {
      return (<><ParameterDescription prm={prm}/></>)
    }
    else {
      return (<>{prm}</>);
    }
  }
  return (
    <ul>
    {Object.values(prm).map((x: any, idx) => (
      <li key={idx}><strong>{Object.keys(prm)[idx]}: </strong> {checkPrm(x)}</li>
      ))}
    </ul>
  );
}

const SourceButton = (settings) => {
  //let setDispTxt = settings.dispSt;
  const [show, setShow] = useState(false);
  const [amps, setAmps] = useState({});
  const [source, setLocalSource] = useState(useStore.getState().config.source);

  const handleClose = () => {
    setShow(false);
  }
  const handleShow = async () => {
    let ampsReq = await fetch("/api/amplifiers");
    let ampsRes = await ampsReq.json();
    setAmps(ampsRes);
    console.log(useStore.getState().config.source);
    setLocalSource(useStore.getState().config.source)
    setShow(true);
  }
  const handleClick = (e) => {
    let newSourceName = e.target.innerHTML;
    setLocalSource(newSourceName)
  }
  // const updateLocalConfig = async () => {
  //   try {
  //     const paradigmsReq = await fetch(`/api/saveLocalConfig`, {method: "POST", 
  //                                                                   headers: {
  //                                                                     "Content-Type": "application/json",
  //                                                                   },
  //                                                                   body: JSON.stringify(useStore.getState().config)});
  //     //let pReq = await fetch("/api/paradigms/newGo");
  //     console.log("created json")
  //     console.log(paradigmsReq);
  //     const result = await paradigmsReq.json();
  //     console.log("success:", result);
  //     } catch (error) {
  //       console.error(`error: ${error}`);
  //     }
  // }
  const handleSubmit = () => {
    let newConfig = useStore.getState().config;
    newConfig.source = source;
    useStore.setState({config : newConfig})
    updateLocalConfig();
    setShow(false);
  }

  return (
    <>
    <Button variant="primary" onClick={handleShow} className="systemButtons">Change Source</Button>   
    <Modal show={show} onHide={handleClose} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Choose from available amplifiers</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Container>
            <Row style={{ width: "100%" }}>
              <Col md="auto">
                <ToggleButtonGroup type="radio" name="options" defaultValue={source} vertical>
                  {Array(Object.keys(amps).length)
                      .fill(0)
                      .map((x, idx) => (
                        <ToggleButton 
                            variant={(useStore.getState().config.source === Object.keys(amps)[idx]) ? "primary": "secondary"} 
                            onClick={handleClick} key={idx} id={idx.toString()} 
                            value={Object.keys(amps)[idx]}>
                          {Object.keys(amps)[idx]}
                        </ToggleButton>
                  ))}
                </ToggleButtonGroup>
              </Col>
              <Col>
                <ParameterDescription id="wrapWords" key="parentPRM" prm={amps[source]}/>
              </Col>
            </Row>
          </Container>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleSubmit}>
            Change Amplifier
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};
export default SourceButton;
