import React, { useContext, useEffect } from 'react';
import { Container, Row, Col, Button, Card } from 'react-bootstrap';
import {
  getSelectableItems,
  revertAllItems,
} from '../Utilities/cssController';
import { useStore } from '../store';
const Personal = () => {
  const setMenuState = (arg: any) => useStore.setState({menuState: arg})
  const menuState = useStore.getState().menuState
  return (
    <Container style={{ height: '100%', width: '40%' }}>
      <Row style={{ height: '50%' }}>
        <Col>
          <Card style={{ width: '18rem' }}>
            <Card.Body>
              <Card.Title>Journal</Card.Title>
              <Button
                variant="primary"
                className="selectableItem"
                onClick={() => {
                  setMenuState('journal');
                  revertAllItems();
                }}
              >
                Write in your journal
              </Button>
            </Card.Body>
          </Card>
        </Col>

        <Col>
          <Card style={{ width: '18rem' }}>
            <Card.Body>
              <Card.Title>Brain games</Card.Title>
              <Button
                variant="primary"
                className="selectableItem"
                onClick={() => {
                  setMenuState('games');
                  revertAllItems();
                }}
              >
                Train your brain
              </Button>
            </Card.Body>
          </Card>
        </Col>
        <Col>
          <Card style={{ width: '18rem' }}>
            <Card.Body>
              <Card.Title>IoT</Card.Title>
              <Button
                variant="primary"
                className="selectableItem"
                onClick={() => {
                  setMenuState('iot');
                  revertAllItems();
                }}
              >
                Control your home devices
              </Button>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Personal;
