import { ListGroup, Card, ListGroupItem, Button, Modal, Form, InputGroup, Tooltip, OverlayTrigger} from "react-bootstrap";
import React, { useState, useEffect, useContext } from "react";

const Parameter = (data) => {
  let pName = data.pName;
  let prms = data.prmState[0]
  let setPrms = data.prmState[1]
  let pTitle = "Choose parameter files (relative from prog folder or full path)"
  if (data.title != null)
    pTitle = data.title;
  const [paramNum, setParamNum] = useState(1);

  const handlePrms = (e) => {
    prms[e.target.id] = e.target.value;
    setPrms(prms)
  }
  //button tooltip
  const renderTooltip = (props) => (
    <Tooltip id="button-tooltip" {...props}>
      Click to add another parameter file
    </Tooltip>
  );
  return (
    <>
    <Form.Label>{pTitle}</Form.Label>
        {Array(paramNum)
          .fill(0)
          .map((x, idx) => (
            <InputGroup key={idx} className="mb-3">
              <Form.Control id={idx.toString()} placeholder="Parameter file path" onChange={handlePrms}/>
              
              <OverlayTrigger
                placement="top"
                delay={{ show: 250, hide: 150 }}
                overlay={renderTooltip}
              >
                <Button variant="secondary" onClick={() => setParamNum(paramNum + 1)} hidden={idx<paramNum-1}>
                  +
                </Button>
              </OverlayTrigger>
            </InputGroup>
          ))}
    </>
  );
};
export default Parameter;
