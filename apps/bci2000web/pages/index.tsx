import { useState, useContext, useEffect } from "react";
import { Row, Col, Navbar, Container, Form, Button } from "react-bootstrap";
import ConnectionState from "../components/ConnectionState";
import Toolbox from "../components/Toolbox";
import {
  ReplayParadigms,
  ReplayTasks,
} from "../components/ToolboxComps/Replay";
import Paradigms from "../components/Paradigms";
import Tasks from "../components/Tasks";
import localconfig from "../server/config/localconfig.json";
import { useStore } from '../components/store'
import Notes from '../components/Notes'
import Head from 'next/head'

export default function BCI2000Web() {
  useEffect(() =>{
    useStore.setState({config: localconfig})
  },[])



  

  return (
    <div className="App" style={{ width: "85%" }}>
      <Head>
        <title>BCI2000Web</title>
      </Head>
      <Navbar variant="light" fixed="top">
        <Navbar.Brand>
          <a
            style={{
              fontSize: "28px",
              textDecoration: "none !important",
              color: "#f9ebee",
            }}
          >
            BCI2000
          </a>
        </Navbar.Brand>
      </Navbar>
      <Container fluid>
        <Row style={{ width: "100%" }}>
          <Col sm={3} md={3}>
            <ConnectionState />
            <Toolbox />
          </Col>
          <Col>{useStore.getState().replayMode ? <ReplayParadigms /> : <Paradigms />}</Col>
          <Col>
            {useStore.getState().replayMode && useStore.getState().replayTask != null ? <ReplayTasks /> : <Tasks />}
          </Col>
          <Col>
            <Notes></Notes>
          </Col>
        </Row>
      </Container>

      <Navbar fixed="bottom">
        <h4 style={{ margin: "0 auto" }}>
          {" "}
          Like what you see? Visit{" "}
          <a href="http://cronelab.github.io">our page</a> and check out our
          <a href="http://github.com/cronelab"> repos!</a>
        </h4>
      </Navbar>
    </div>
  );
}
