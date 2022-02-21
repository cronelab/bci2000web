import React, { useEffect, useState, useContext } from 'react';
import { Form, Pagination, Container, Row, Col } from 'react-bootstrap';
import { useStore } from '../store';
const Journal = () => {
  const currentJournalMessage = useStore.getState().currentJournalMessage
  const [entry, setEntry] = useState<{dates: any[], times: any[], messages: any[]}>({
    dates: [],
    times: [],
    messages: [],
  });

  let dt = new Date();


  useEffect(() => {
    (async () => {
      let journalEntriesReq = await fetch('/journalentries');
      let journalEntryDates: any[] = await journalEntriesReq.json();
      let journalEntries = await Promise.all(
        journalEntryDates.map(async (entry: any) => {
          let journalEntry = entry.split('.json')[0];
          let dataReq = await fetch(`/journal/${journalEntry}`);
          let dataRes = await dataReq.json();
          return dataRes;
        })
      );
      let entryTimes = journalEntries.map((entry) => entry['time']);
      let entryMessage = journalEntries.map((entry) => entry['entry']);

      console.log(journalEntryDates);
      setEntry({
        dates: journalEntryDates,
        times: entryTimes,
        messages: entryMessage,
      });
      console.log(journalEntries);
    })();
  }, []);

  let items = entry.dates.map((msg, index) => {
    return (
      // eslint-disable-next-line react/jsx-key
      <Col>
        <Form>
          <Form.Group controlId="exampleForm.ControlTextarea1">
            <Form.Label>{entry.dates[index].split('.json')[0]}</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              value={entry.messages[index]}
              readOnly
            />
          </Form.Group>
        </Form>
      </Col>
    );
  });

  return (
    <>
      <Row>{items}</Row>
      <Row>
        <Col>
          <Form>
            <Form.Group controlId="exampleForm.ControlTextarea1">
              <Form.Label>{`${(dt.getMonth() + 1)}_${dt.getDate()}_${dt.getFullYear()}`}</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                value={currentJournalMessage}
              />
            </Form.Group>
          </Form>
        </Col>
      </Row>
    </>
  );
};

export default Journal;
