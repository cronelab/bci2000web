import React, { useState } from 'react';
import { Container, Card, Button, Row, Col } from 'react-bootstrap';
//@ts-ignore
import keys from './keys.json';
const IoT = () => {
  const [tvState, setTvState] = useState('pause');
  return (
    <Container style={{ height: '100%', width: '40%' }}>
      <Row style={{ height: '50%' }}>
        <Col>
          <Card style={{ width: '18rem' }}>
            <Card.Body>
              <Card.Title>Control lights</Card.Title>
              <Button
                variant="primary"
                className="selectableItem"
                onClick={async () => {
                  //                   3
                  // 7
                  // 8
                  // 12
                  if (keys.PHILIPS_HUE_API_KEY !== '') {
                    await fetch(
                      `http://192.168.1.134/api/${keys.PHILIPS_HUE_API_KEY}/lights/8/state`,
                      {
                        method: 'PUT',
                        body: JSON.stringify({
                          on: true,
                          sat: 78,
                          bri: 254,
                          hue: 41491,
                        }),
                      }
                    );
                  }
                }}
              >
                On
              </Button>
              <Button
                variant="primary"
                className="selectableItem"
                onClick={async () => {
                  if (keys.PHILIPS_HUE_API_KEY !== '') {
                    await fetch(
                      `http://192.168.1.134/api/${keys.PHILIPS_HUE_API_KEY}/lights/8/state`,
                      {
                        method: 'PUT',
                        body: JSON.stringify({
                          on: false,
                        }),
                      }
                    );
                  }
                }}
              >
                Off
              </Button>
            </Card.Body>
          </Card>
        </Col>

        <Col>
          <Card style={{ width: '18rem' }}>
            <Card.Body>
              <Card.Title>Watch some TV</Card.Title>
              <Button
                variant="primary"
                className="selectableItem"
                onClick={async () => {
                  if (tvState == 'play') {
                    setTvState('pause');
                  } else {
                    setTvState('play');
                  }
                  await fetch('http://192.168.1.44:8060/keypress/play', {
                    method: 'POST',
                  });
                }}
              >
                {tvState == 'pause' ? 'Play' : 'Pause'}
              </Button>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default IoT;
