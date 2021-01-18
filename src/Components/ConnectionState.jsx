import { ListGroupItem, ListGroup, Card } from "react-bootstrap";
import BCI2K from "bci2k";
import React, { useState, useEffect, useContext } from "react";
import { Context } from "../MyProvider";

const ConnectionState = () => {

  const [connection, setConnection] = useState("Not Connected");
  const [subjName, setSubjName] = useState("");
  const [ampName, setAmpName] = useState("");
  const {bci, setBCI, setConfig} = useContext(Context)
  const _bci = new BCI2K.bciOperator(`ws://${window.location.hostname}`);

  useEffect(() => {
    _bci.connect().then(e => {
      setBCI(_bci)
      setConnection("Connected");
      _bci.stateListen();
      _bci.onStateChange = e => {
        setConnection(e.trim());
      };
    _bci.execute('Reset System');

    });
  }, []);

useEffect(() => {
  (async () => {
    let res = await fetch('/localconfig');
    let config = await res.json()
    setConfig(config)
      setSubjName(config.subject);
      setAmpName(config.source);
      // dataDirectory = config.dataDirectory;
  })()
},[])


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
            className="text-center text-muted bigger">
            <strong>{connection}</strong>
          </ListGroupItem>
          <ListGroupItem
            id="subjectName"
            className="text-center text-muted bigger">
            <strong>{subjName}</strong>
          </ListGroupItem>
          <ListGroupItem
            id="samplifierName"
            className="text-center text-muted bigger">
            <strong>{ampName}</strong>
          </ListGroupItem>

        </ListGroup>
      </Card>
    </div>
  );
};

export default ConnectionState;
