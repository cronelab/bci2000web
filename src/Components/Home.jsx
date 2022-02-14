import React, { useState, useContext } from "react";
import { Row, Col, Navbar, Container, Form, Button } from "react-bootstrap";
import Toolbox from "./Toolbox";
import Paradigms from "./Paradigms";
import ConnectionState from "./ConnectionState";
import Tasks from "./Tasks";
import { Context } from "../MyProvider";
import { ReplayParadigms, ReplayTasks } from "./ToolboxComps/Replay";
const Home = () => {
  const [comments, setComments] = useState("");
  const [user, setUser] = useState("");
  const [badChan, setBadChan] = useState("");
  const { config, block, bci, bciConfig, replayMode,replayTask } = useContext(Context);

  const sendNotes = () => {
    let today = new Date();
    let time =
      today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
    let date =
      today.getFullYear() +
      "-" +
      (today.getMonth() + 1) +
      "-" +
      today.getDate();
    let data = {
      subject: config.subject,
      task: block.title,
      block: block.block,
      comment: comments,
      startTime: `${date} - ${time}`,
      user,
      badChan
    };
    fetch("/notes", {
      method: "POST",
      headers: {
        "Content-type": "application/json"
      },
      body: JSON.stringify(data)
    });
    bci.execute(bciConfig);
  };

  return (
    <div className="App" style={{ width: "85%" }}>
      <Navbar variant="light" fixed="top">
        <Navbar.Brand>
          <a
            style={{
              fontSize: "28px",
              textDecoration: "none !important",
              color: "#f9ebee"
            }}
          >
            BCI2000
          </a>
        </Navbar.Brand>
      </Navbar>
      <Container fluid>
        <Row style={{"width":"100%"}}>
          <Col sm={3} md={3}>
            <ConnectionState />
            <Toolbox />
          </Col>
          <Col>{replayMode ? <ReplayParadigms /> : <Paradigms />}</Col>
          <Col>{(replayMode && replayTask != null) ? <ReplayTasks /> : <Tasks />}</Col>
          <Col>
            <Form>
              <Form.Group controlId="exampleForm.ControlTextarea1">
                <Form.Label>Researcher</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Place your name here"
                  onChange={e => setUser(e.target.value)}
                />
                <Form.Label>Bad channels</Form.Label>
                <Form.Control
                  as="textarea"
                  placeholder="Enter bad channels"
                  onChange={e => setBadChan(e.target.value)}
                />
                <Form.Label>Comments</Form.Label>
                <Form.Control
                  as="textarea"
                  placeholder="You better write some comments"
                  onChange={e => setComments(e.target.value)}
                />
              </Form.Group>
            </Form>
            <Button variant="primary" type="submit" onClick={() => sendNotes()}>
              Submit
            </Button>
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
};

export default Home;
