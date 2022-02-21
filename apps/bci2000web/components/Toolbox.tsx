import { Button, Card, Dropdown } from "react-bootstrap";
import React, { useContext, useEffect } from "react";
import { useState } from "react";
import CAR from "./ToolboxComps/CAR";
import { useStore } from "./store";
const Toolbox = () => {
  const [showModal, setShowModal] = useState(false);
  const [subjects, setSubjects] = useState([])

  useEffect(() => {
    (async () => {
      let subjReq = await fetch("/api/subjects");
      let subjRes = await subjReq.json();
      setSubjects(subjRes)
      useStore.setState({ subjects: subjRes });
    })();
  }, []);

  const selectReplaySubject = (actSubj) => {
    useStore.setState({ replayMode: true });
    useStore.setState({ replaySubject: actSubj });
  };

  return (
    <>
      {showModal ? (
        <CAR />
      ) : (
        <Card>
          <Card.Header>
            <Card.Title>
              <h3 className="text-center">Toolbox</h3>
            </Card.Title>
          </Card.Header>
          <Button onClick={() => useStore.getState().bci.resetSystem()}>
            Reset
          </Button>
          <Button onClick={() => setShowModal(true)}>CAR</Button>
          <Dropdown>
            <Dropdown.Toggle style={{ width: "100%" }}>Replay</Dropdown.Toggle>
            <Dropdown.Menu>
              {subjects.map((x) => (
                <Dropdown.Item
                  as="button"
                  key={x}
                  onClick={() => selectReplaySubject(x)}
                >
                  {x}
                </Dropdown.Item>
              ))}
            </Dropdown.Menu>
          </Dropdown>
        </Card>
      )}
    </>
  );
};

export default Toolbox;
