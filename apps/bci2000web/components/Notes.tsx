import React from "react";
import { Form, Button } from "react-bootstrap";
import { useStore } from "./store";
const Notes = () => {
  const sendNotes = () => {
    let today = new Date();
    let time =
      today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
    let date =
      today.getFullYear() +
      "-" +
      (today.getMonth() + 1) +
      "-" +
      today.getDate();
    let data = {
      subject: useStore.getState().config.subject,
      task: useStore.getState().block.title,
      block: useStore.getState().block.block,
      comment: useStore.getState().comments,
      startTime: `${date} - ${time}`,
      user:useStore.getState().researcher,
      badChan:useStore.getState().badChannels,
    };
    fetch("/api/notes", {
      method: "POST",
      headers: {
        "Content-type": "application/json",
      },
      body: JSON.stringify(data),
    });
    //@ts-ignore
    useStore.getState().bci.execute(useStore.getState().bciConfig);
  };

  return (
    <>
      <Form>
        <Form.Group controlId="exampleForm.ControlTextarea1">
          <Form.Label>Researcher</Form.Label>
          <Form.Control
            type="text"
            placeholder="Place your name here"
            onChange={(e) => useStore.setState({ researcher: e.target.value })}
          />
          <Form.Label>Bad channels</Form.Label>
          <Form.Control
            as="textarea"
            placeholder="Enter bad channels"
            onChange={(e) => useStore.setState({ badChannels: e.target.value })}
          />
          <Form.Label>Comments</Form.Label>
          <Form.Control
            as="textarea"
            placeholder="You better write some comments"
            onChange={(e) => useStore.setState({ comments: e.target.value })}
          />
        </Form.Group>
      </Form>
      <Button variant="primary" type="submit" onClick={() => sendNotes()}>
        Submit
      </Button>
    </>
  );
};
export default Notes;
