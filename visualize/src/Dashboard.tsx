import React from 'react'
import { useEffect, useState } from 'react';
import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Card from 'react-bootstrap/Card';
import ButtonGroup from 'react-bootstrap/ButtonGroup';
import './App.scss';
const Dashboard = () => {
  const [subjects, setSubjects] = useState([]);

  useEffect(() => {
    (async () => {
      let req = await fetch('/api/list');
      let res = await req.json();
      setSubjects(res);
    })();
  }, []);

  return (
    <>
      <Container fluid>
        <Row>
          {subjects.map((subj) => {
            return (
              <Col>
                <Card className="text-center" style={{ width: '18rem' }}>
                  <Card.Body>
                    <Card.Title>{subj}</Card.Title>
                    <ButtonGroup vertical>
                      <Button
                        onClick={() => {
                          window.location.href = `/volume?subject=${subj}`;
                        }}
                        variant="primary"
                      >
                        Volumetric view
                      </Button>
                      <Button
                        onClick={() => {
                          window.location.href = `/slice?subject=${subj}&modality=T1`;
                        }}
                        variant="primary"
                      >
                        Sliced view
                      </Button>

                      <Button
                        onClick={() => {
                          window.location.href = `/surface?subject=${subj}`;
                        }}
                        variant="primary"
                      >
                        Surface view
                      </Button>
                      <Button
                        onClick={() => {
                          window.location.href = `/slice?subject=${subj}&modality=CT`;
                        }}
                        variant="primary"
                      >
                        Localize electrodes
                      </Button>
                    </ButtonGroup>
                  </Card.Body>
                </Card>
              </Col>
            );
          })}
        </Row>
      </Container>
    </>
  );
};

export default Dashboard;
