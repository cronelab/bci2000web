import { ListGroupItem, ListGroup, Card } from "react-bootstrap";
import { BCI2K_OperatorConnection } from "bci2k";
import React, { useState, useEffect } from "react";
import localConfig from "../server/config/localconfig.json";
import { useStore } from "./store";
const ConnectionState = () => {
  const [connectionStatus, setConnectionStatus] = useState("Not Connected");


  useEffect(() => {
    (async () => {
      let bci = useStore.getState().bci;
      await bci.connect(`ws://localhost:3000`);

      bci.execute("Reset System");
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
            className="text-center text-muted bigger"
          >
            <strong>{connectionStatus}</strong>
          </ListGroupItem>
          <ListGroupItem
            id="subjectName"
            className="text-center text-muted bigger"
          >
            <strong>{useStore.getState().config.subject}</strong>
          </ListGroupItem>
          <ListGroupItem
            id="samplifierName"
            className="text-center text-muted bigger"
          >
            <strong>{useStore.getState().config.source}</strong>
          </ListGroupItem>
        </ListGroup>
      </Card>
    </div>
  );
};

export default ConnectionState;
