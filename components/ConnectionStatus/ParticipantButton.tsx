import { Container, Card, ListGroupItem, Button, Modal, Form, FloatingLabel, Row, Col, ToggleButton, ToggleButtonGroup } from "react-bootstrap";
import React, { useState, useEffect, useContext } from "react";
import { useStore } from "../store";
import { updateLocalConfig } from "./ConnectionState";

const SourceButton = (settings) => {
  const [show, setShow] = useState(false);
  const [subject, setParticipant] = useState(useStore.getState().config.subject);

  const handleClose = () => {
    setShow(false);
  }
  const handleShow = async () => {
    console.log(useStore.getState().config.subject);
    setParticipant(useStore.getState().config.subject)
    setShow(true);
  }
  const handleChange = (e) => {
    let newSourceName = e.target.value;
    setParticipant(newSourceName)
  }
  const handleSubmit = () => {
    let newConfig = useStore.getState().config;
    newConfig.subject = subject;
    useStore.setState({config : newConfig})
    updateLocalConfig();
    setShow(false);
  }

  return (
    <>
    <Button variant="primary" onClick={handleShow} className="systemButtons">Change Participant</Button>   
    <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Change your participant!</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3" controlId="exampleForm.ControlTextarea1">
              <Form.Label>New participant name:</Form.Label>
              <Form.Control onChange={handleChange}/>
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleSubmit}>
            Change Name
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};
export default SourceButton;
