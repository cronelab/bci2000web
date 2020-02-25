import { Button, Card, Dropdown } from "react-bootstrap";
import React, { useContext, useEffect } from "react";
import { Context } from "../MyProvider";
import { useState } from "react";
import CAR from '../Components/ToolboxComps/CAR'
const Toolbox = () => {
  const { subjects, setSubjects, setReplayMode, bci,replaySubject, setReplaySubject } = useContext(Context);
  const [showModal, setShowModal] = useState()

  const resetBCI = () => {
    bci.resetSystem();
  };


  useEffect(() => {
    (async () => {
      let subjReq = await fetch("/subjects");
      let subjRes = await subjReq.json();
      setSubjects(subjRes);
    })();
  }, []);

  const selectReplaySubject = (actSubj) => {
    setReplayMode(true);
    setReplaySubject(actSubj)
  }

  return (
    <>
        {showModal ? <CAR/> : 
      <Card>
        <Card.Header>
          <Card.Title>
            <h3 className="text-center">Toolbox</h3>
          </Card.Title>
        </Card.Header>
        <Button onClick={() => resetBCI()}>Reset</Button>
        <Button onClick={() => setShowModal(true)}>CAR</Button>
        <Dropdown>
          <Dropdown.Toggle style={{"width":"100%"}}>Replay</Dropdown.Toggle>
          <Dropdown.Menu>
            {subjects.map(x => (
              <Dropdown.Item as="button"
              key={x} 
              id={x}
              onClick={() => selectReplaySubject(x)}
              >
                {x}
              </Dropdown.Item>
            ))}
          </Dropdown.Menu>
        </Dropdown>
      </Card>
        }

    </>
  );
};

export default Toolbox;
