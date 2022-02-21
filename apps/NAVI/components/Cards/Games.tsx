import React, { useContext } from 'react';
import { Container, Row, Col, Button, Card } from 'react-bootstrap';
import { revertAllItems } from '../Utilities/cssController';
import { useStore } from '../store';
const Games = () => {
  const setMenuState = (args: string) => useStore.setState({menuState: args})
  return (
    <Container style={{ height: '100%', width: '40%' }}>
      <Row style={{ height: '50%' }}>
        <Col>
          <Card style={{ width: '18rem' }}>
            <Card.Body>
              <Card.Title>Snake</Card.Title>
              <Button
                variant="primary"
                className="selectableItem"
                onClick={() => {
                  setMenuState('snake');
                  revertAllItems();
                }}
              >
                Play snake
              </Button>
            </Card.Body>
          </Card>
        </Col>{' '}
        <Col>
          <Card style={{ width: '18rem' }}>
            <Card.Body>
              <Card.Title>Pong</Card.Title>
              <Button
                variant="primary"
                className="selectableItem"
                onClick={() => setMenuState('pong')}
              >
                Play pong
              </Button>
            </Card.Body>
          </Card>
        </Col>
        <Col>
          <Card style={{ width: '18rem' }}>
            <Card.Body>
              <Card.Title>Centipede</Card.Title>

              <Button
                variant="primary"
                className="selectableItem"
                onClick={() => {
                  setMenuState('centipede');
                  revertAllItems();
                }}
              >
                Play centipede
              </Button>
            </Card.Body>
          </Card>
        </Col>
        <Col>
          <Card style={{ width: '18rem' }}>
            <Card.Body>
              <Card.Title>Virtual Reality</Card.Title>

              <Button
                variant="primary"
                className="selectableItem"
                onClick={() => {
                  setMenuState('xr');
                  revertAllItems();
                }}
              >
                Move in a virtual 3D environment
              </Button>
            </Card.Body>
          </Card>
        </Col>
        <Col>
          <Card style={{ width: '18rem' }}>
            <Card.Body>
              <Card.Title>Biofeedback</Card.Title>

              <Button
                variant="primary"
                className="selectableItem"
                onClick={() => {
                  setMenuState('biofeedback');
                  revertAllItems();
                }}
              >
                See how your brain is reacting!
              </Button>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Games;
