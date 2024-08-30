import { ListGroupItem, ListGroup, Card, Button, Row, Col } from "react-bootstrap";
import React, { useState, useEffect } from "react";
import localConfig from "../../server/config/localconfig.json";
import { useStore } from "../store";
import SourceButton from "./SourceButton";
import ParticipantButton from "./ParticipantButton";
const ConnectionState = () => {
  const [connectionStatus, setConnectionStatus] = useState("Not Connected");
  const [subj, setSubj] = useState(useStore.getState().config.subject);
  useStore.subscribe((state) => state.config.subject, (st) => setSubj(st));

  const [amp, setAmp] = useState(useStore.getState().config.source);
  useStore.subscribe((state) => state.config.source, (st) => setAmp(st));

  //present buttons to use based on localconfig setting
  const showButtons = useStore.getState().config.editable ? "flex" : "none";
  //const [vis, setVis] = useState(useStore.getState().config.editable);

  useEffect(() => {
    (async () => {
      let bci = useStore.getState().bci;
      await bci.connect(`ws://localhost:3000`);

      //bci.execute("Reset System");
      console.log("Connected!")
      bci.stateListen();
      bci.onStateChange = (e) => setConnectionStatus(e);
    })();
  }, []);

  return (
    <div>
      <Card className="text-center">
        <Card.Header>
          <Card.Title>
            <h3 className="text-center">System</h3>
          </Card.Title>
        </Card.Header>

        <ListGroup>
          <ListGroupItem
            id="state-label"
            className="text-start text-muted bigger"
          >
            <Row>
              <Col><strong>Status: </strong>
              </Col>
              <Col>{connectionStatus}
              </Col>
            </Row>
            <Row className="justify-content-center" md="auto" style={{paddingTop: 5, display: showButtons}}>
              <Button variant="primary" onClick={() => useStore.getState().bci.resetSystem()} className="systemButtons">
                Reset
              </Button>
            </Row>
          </ListGroupItem>
          <ListGroupItem
            id="subjectName"
            className="text-start text-muted bigger"
          >
            <Row>
              <Col><strong>Participant: </strong>
              </Col>
              <Col>{subj}
              </Col>
            </Row>
            <Row className="justify-content-center" md="auto" style={{paddingTop: 5, display: showButtons}}>
              <ParticipantButton/>
            </Row>
          </ListGroupItem>
          <ListGroupItem
            id="samplifierName"
            className="text-start text-muted bigger"
          >
            <Row>
              <Col className="justify-content-start"><strong>Amplifier: </strong>
              </Col>
              <Col>{amp}
              </Col>
            </Row>
            <Row className="justify-content-center" md="auto" style={{paddingTop: 5, display: showButtons}}>
              <SourceButton/>
            </Row>
          </ListGroupItem>
        </ListGroup>
      </Card>
    </div>
  );
};
const updateLocalConfig = async () => {
  try {
    const paradigmsReq = await fetch(`/api/saveLocalConfig`, {method: "POST", 
                                                                  headers: {
                                                                    "Content-Type": "application/json",
                                                                  },
                                                                  body: JSON.stringify(useStore.getState().config)});
    //let pReq = await fetch("/api/paradigms/newGo");
    console.log("created json")
    console.log(paradigmsReq);
    const result = await paradigmsReq.json();
    console.log("success:", result);
    } catch (error) {
      console.error(`error: ${error}`);
    }
}
const UpdateLocalConfig = () => {
  return (
    <div>

    </div>
  );
}

export { ConnectionState, updateLocalConfig };
