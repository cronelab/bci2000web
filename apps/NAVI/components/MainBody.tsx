import React, { useContext, useRef, useEffect } from 'react';
import { Container, Row, Col, Button, Card } from 'react-bootstrap';
import Calendar from 'react-calendar'
import 'react-calendar/dist/Calendar.css';
import { useStore } from './store';
const MainBody = () => {
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
                // ref={personalRef}
                className="selectableItem"
                onClick={() => {
                  useStore.setState({menuState: 'personal'})
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
                // ref={calibrationRef}
                id="calibrationButton"
                className="selectableItem"
                onClick={() => {
                  useStore.setState({menuState: 'calibration'})
                }}
              >
                Go to calibration apps
              </Button>
            </Card.Body>
          </Card>
        </Col>
      </Row>
      <Row>
        <Calendar></Calendar>
      </Row>
    </Container>
  );
};

export default MainBody;
