import React, { useState, useEffect, useContext } from "react";
import { ListGroup, Card, ListGroupItem } from "react-bootstrap";
import { Context } from "../MyProvider";

const Tasks = () => {
  const { task, setBciConfig, config, setBlock } = useContext(Context);
  const [ampConfig, setAmpConfig] = useState();

  useEffect(() => {
    (async () => {
      let ampReq = await fetch(`/amplifiers`);
      let ampRes = await ampReq.json();
      if (config) setAmpConfig(ampRes[config.source]);
    })();
  }, [config]);

  const blockSelect = async (task, currentBlock) => {
    setBlock({ title: task.title, block: currentBlock.block });
    //Startup
    let script = ``;
    script += `Reset System; `;
    script += `Startup System localhost; `;

    //Add task states/events
    if (task.addEvents.length >= 1)
      task.addEvents.forEach((e) => (script += `Add Event ${e}; `));
    if (task.addStates.length >= 1)
      task.addStates.forEach((state) => (script += `Add State ${state}; `));
    task.addParameters.map((tskPrm) => (script += `Add parameter ${tskPrm}; `));

    //Ask user if they want to log keyboard/mouse/etc and write that data to the source module
    //Start source module
    if (task.userPrompt.length > 0) {
      if (confirm(`${Object.keys(task.userPrompt[0])}`) == true) {
        script += `Start executable ${config.source} --local ${Object.values(task.userPrompt[0])}; `;
      } else {
        script += `Start executable ${config.source} --local; `;
      }
    }
    else {
      script += `Start executable ${config.source} --local; `;
    }
    //Start processing module
    if (task.executables.processing != null) {
      script += `Start executable ${task.executables.processing} --local; `;
    } else {
      script += `Start executable DummySignalProcessing --local; `;
    }
    //Start application module
    if (task.executables.application != null) {
      script += `Start executable ${task.executables.application} --local; `;
    } else {
      script += `Start executable DummyApplication --local; `;
    }

    console.log(`${config.subject}`)
    script += `Set parameter SubjectName ${config.subject}; `;

    script += "Wait for Connected; ";

    script += `Set parameter SubjectSession ${currentBlock.block}; `;
    script += `Set parameter DataFile ${config.subject}/${task.title.replace(
      /\s/g,
      "_"
    )}/${task.title.replace(/\s/g, "_")}_Block${
      currentBlock.block
    }_Run%24%7bSubjectRun%7d.dat; `;

    //Source parameters
    Object.keys(ampConfig.setParameters).map((par) => {
      script += `Set parameter ${par} ${ampConfig.setParameters[par]}; `;
    });

    //Load task parameters
    task.loadParameters.map(
      (tskPrm) => (script += `Load parameterfile ${tskPrm}; `)
    );

    //Load block parameters
    currentBlock.loadParameters.map(
      (tskPrm) => (script += `Load parameterfile ${tskPrm}; `)
    );

    //Set parameters
    Object.keys(task.setParameters).map(
      (tskPrm) =>
        (script += `Set parameter ${tskPrm} ${task.setParameters[tskPrm]}; `)
    );

    script += `Set parameter WSSourceServer *:20100; `;
    script += `Set parameter WSSpectralOutputServer *:20203; `;

    setBciConfig(script);
  };

  return (
    <Card className="text-center">
      {Object.values(task).map((x) => {
        return (
          <div key={x.title}>
            <Card.Title key={x.title}>{x.title}</Card.Title>
            <Card.Text key={x.description}>{x.description}</Card.Text>
            <Card.Body>
              <ListGroup key={x.Blocks}>
                {Object.values(x.Blocks).map((y) => {
                  return (
                    <ListGroupItem
                      action
                      onClick={() => blockSelect(x, y)}
                      key={y.title}
                    >
                      {y.title}
                    </ListGroupItem>
                  );
                })}
              </ListGroup>
            </Card.Body>
          </div>
        );
      })}
    </Card>
  );
};

export default Tasks;
