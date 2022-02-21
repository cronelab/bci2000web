import React, { useContext, useEffect } from 'react';
import { Container, Row, Col, Button, Card } from 'react-bootstrap';
import Metronome_Syllable from '../Tasks/Other/Metronome_Syllable';
import { useStore } from '../store';
const Calibration = () => {
  // useEffect(() => {
  //   console.log(menuState);
  // }, [menuState]);

  let TaskDecider = (): JSX.Element => {
    if (useStore.getState().menuState == 'calibration') {
      return (
        <Row style={{ height: '50%' }}>
          <Col>
            <Card style={{ width: '18rem' }}>
              <Card.Body>
                <Card.Title>Metronome tasks</Card.Title>
                <Button
                  variant="primary"
                  className="selectableItem"
                  id="cursorButton"
                  onClick={() => {
                    useStore.setState({menuState: "metronomespeech"})
                    console.log('metronome');
                  }}
                >
                  Speech
                </Button>
                <Button
                  variant="primary"
                  className="selectableItem"
                  id="cursorButton"
                  // onClick={() => history.push('/metronomemotor')}
                >
                  Motor
                </Button>
              </Card.Body>
            </Card>
          </Col>
          <Col>
            <Card style={{ width: '18rem' }}>
              <Card.Body>
                <Card.Title>Other tasks</Card.Title>
                <Button
                  variant="primary"
                  className="selectableItem"
                  id="cursorButton"
                  // onClick={() => history.push('/pacedsentence')}
                >
                  Paced Verse Task
                </Button>
                <Button
                  variant="primary"
                  className="selectableItem"
                  id="cursorButton"
                  // onClick={() => history.push('/motorbci')}
                >
                  Visual_Motor
                </Button>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      );
    } 
    else if (useStore.getState().menuState == 'metronomespeech') {
      return <h1>hifduhe</h1>;
    }
    else {
      return <h1>d</h1>
    }
  };

  return (
    <Container>
      <TaskDecider></TaskDecider>
    </Container>
  );
};

export default Calibration;
