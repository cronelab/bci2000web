import React, { useContext } from 'react';
import { Container, Row, Col, Button, Card } from 'react-bootstrap';
import { revertAllItems } from '../Utilities/cssController';

const ExternalSites = () => {
  return (
    <Container style={{ height: '100%', width: '40%' }}>
      <Row style={{ height: '50%' }}>
        {/* <Col>
          <Card style={{ width: '18rem' }}>
            <Card.Body>
              <Card.Title>Reddit</Card.Title>
              <Button
                variant="primary"
                className="selectableItem"
                onClick={() => {
                  window.open('https://www.reddit.com');
                  revertAllItems();
                }}
              >
                Go
              </Button>
            </Card.Body>
          </Card>
        </Col>{' '} */}
        <Col>
          <Card style={{ width: '18rem' }}>
            <Card.Body>
              <Card.Title>Google</Card.Title>
              <Button
                variant="primary"
                className="selectableItem"
                onClick={() => {
                  window.open('https://google.com');
                  revertAllItems();
                }}
              >
                Go
              </Button>
            </Card.Body>
          </Card>
        </Col>
        <Col>
          <Card style={{ width: '18rem' }}>
            <Card.Body>
              <Card.Title>Spotify</Card.Title>
              <Button
                variant="primary"
                className="selectableItem"
                onClick={() => {
                  window.open(
                    'https://open.spotify.com/track/0C2h84xYY3IdSm13vNZOma?si=NhUbP1p5SXeMgIDS8p1VPA&nd=1'
                  );
                }}
              >
                Go
              </Button>
            </Card.Body>
          </Card>
        </Col>
        <Col>
          <Card style={{ width: '18rem' }}>
            <Card.Body>
              <Card.Title>Yahoo news</Card.Title>

              <Button
                variant="primary"
                className="selectableItem"
                onClick={() => {
                  window.open('https://news.yahoo.com');
                  revertAllItems();
                }}
              >
                Go
              </Button>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default ExternalSites;
