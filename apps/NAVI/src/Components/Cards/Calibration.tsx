import React, { useContext, useEffect } from 'react';
import { Container, Row, Col, Button, Card } from 'react-bootstrap';
import { Context } from '../../Context';
import Metronome_Syllable from '../Tasks/Metronome_Syllable';
const Calibration = () => {
  const { setMenuState, menuState } = useContext(Context);
  useEffect(() => {
    console.log(menuState);
  }, [menuState]);

  let TaskDecider = () => {
    if (menuState == 'calibration') {
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
                    setMenuState('metronomespeech');
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
    } else if (menuState == 'metronomespeech') {
      return <h1>hifduhe</h1>;
    }
  };

  return (
    <Container>
      <TaskDecider></TaskDecider>
    </Container>
  );
};

export default Calibration;
