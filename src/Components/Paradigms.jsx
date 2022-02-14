import { ListGroup, Card, ListGroupItem } from "react-bootstrap";
import React, { useState, useEffect, useContext } from "react";
import { Context } from "../MyProvider";

const Paradigms = () => {
  const [] = useState([]);
  const [ampConfig, setAmpConfig] = useState();
  const { tasks, setAllTasks, bci, config, task, setTask } = useContext(Context);

  useEffect(() => {
    (async () => {
      let res = await fetch("/paradigms");
      let paradigms = await res.json();
      let ampReq = await fetch(`/amplifiers`);
      let ampRes = await ampReq.json();
      if (config) setAmpConfig(ampRes[config.source])
      setAllTasks(paradigms);
    })();
  }, [config]);

  const taskSelect = async e => {
    let res = await fetch(`/paradigms/${e.target.innerHTML}`);
    let activeTask = await res.json();
    setTask(activeTask);
  };

  return (
        <Card className="text-center">
          <Card.Title>Paradigms</Card.Title>
          <Card.Body>
            <ListGroup>
              {tasks.map(x => {
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
