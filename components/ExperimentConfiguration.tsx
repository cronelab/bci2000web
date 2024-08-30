import { useState, useContext, useEffect } from "react";
import { Row, Col, Navbar, Container, Form, Button } from "react-bootstrap";
import { ConnectionState } from "./ConnectionStatus/ConnectionState";
import Toolbox from "./Toolbox";
import {
  ReplayParadigms,
  ReplayTasks,
} from "./ToolboxComps/Replay";
import Paradigms from "./Paradigms";
import Tasks from "./Tasks";
import { useStore } from "./store";
import Notes from "./Notes";

export default function ExperimentConfiguration() {

  return (
      <Container fluid>
        <Row style={{ width: "100%" }}>
          <Col sm={3} md={3}>
            <ConnectionState />
            <Toolbox />
          </Col>
          <Col>
            {useStore.getState().replayMode ? (
              <ReplayParadigms />
            ) : (
              <Paradigms />
            )}
          </Col>
          <Col>
            {useStore.getState().replayMode &&
            useStore.getState().replayTask != null ? (
              <ReplayTasks />
            ) : (
              <Tasks />
            )}
          </Col>
          <Col>
            <Notes></Notes>
          </Col>
        </Row>
      </Container>
  );
}
