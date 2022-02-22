import { ListGroup, Card, ListGroupItem } from "react-bootstrap";
import React, { useState, useEffect, useContext } from "react";
import amplifiers from "../server/config/amplifiers.json";
import { useStore } from "./store";
const Paradigms = () => {
  const [paradigms, setParadigms] = useState([]);
  // const [ampConfig, setAmpConfig] = useState();

  useEffect(() => {
    (async () => {
      let paradigmsReq = await fetch("/api/paradigms");
      let paradigmsRes = await paradigmsReq.json();
      // if (useStore.getState().config) {
      // setAmpConfig(amplifiers[useStore.getState().config.source]);
      // }
      //use pubsub model to set the ListGroupItem tomorrow
      // useStore.setState({ tasks: paradigms });
      setParadigms(paradigmsRes);
      useStore;
    })();
  }, []);

  const taskSelect = async (e) => {
    let res = await fetch(`/api/paradigms/${e.target.innerHTML}`);
    let activeTask = await res.json();
    useStore.setState({ task: activeTask });
  };

  return (
    <Card className="text-center">
      <Card.Title>Paradigms</Card.Title>
      <Card.Body>
        <ListGroup>
          {paradigms.map((x) => {
            return (
              <ListGroupItem key={x.name} action onClick={taskSelect}>
                {x.name}
              </ListGroupItem>
            );
          })}
        </ListGroup>
      </Card.Body>
    </Card>
  );
};
export default Paradigms;
