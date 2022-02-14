import React, { useContext, useRef, useEffect } from 'react';
import { Container, Row, Col, Button, Card } from 'react-bootstrap';
import { Context } from '../Context';
import Calendar from 'react-calendar'
import 'react-calendar/dist/Calendar.css';

const MainBody = () => {
  const { setMenuState } = useContext(Context);
  const personalRef = useRef();
  const calibrationRef = useRef();

  return (
    <Container style={{ height: '100%', width: '40%' }}>
      <Row
        className="align-items-center justify-content-center"
        style={{ height: '50%' }}
      >
        <Col style={{ display: 'flex', justifyContent: 'center' }}>
          <Card style={{ width: '18rem' }}>
            <Card.Body>
              <Card.Title>Personal</Card.Title>
              <Button
                ref={personalRef}
                className="selectableItem"
                onClick={() => {
                  setMenuState('personal');
                }}
              >
                Go to personal apps
              </Button>
            </Card.Body>
          </Card>
        </Col>
        <Col style={{ display: 'flex', justifyContent: 'center' }}>
          <Card style={{ width: '18rem' }}>
            <Card.Body>
              <Card.Title>Calibration</Card.Title>
              <Button
                ref={calibrationRef}
                id="calibrationButton"
                className="selectableItem"
                onClick={() => {
                  setMenuState('calibration');
                }}
              >
                Go to calibration apps
              </Button>
            </Card.Body>
          </Card>
        </Col>
      </Row>
      {/* <Row> */}
        {/* <Calendar></Calendar> */}
      {/* </Row> */}
    </Container>
  );
};

export default MainBody;
