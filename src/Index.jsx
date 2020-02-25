import * as React from "react";
import * as ReactDOM from "react-dom";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import "./index.scss";
import { Container } from "react-bootstrap";
import Home from "../src/Components/Home";
import { MyProvider } from "./MyProvider";
ReactDOM.render(
  <Router>
    <MyProvider>
      <Switch>
        <Route exact path="/">
          <Container style={{ marginTop: 5 }} fluid={true}>
            <Home />
          </Container>
        </Route>
      </Switch>
    </MyProvider>
  </Router>,
  document.getElementById("root")
);
