import { useState, useContext, useEffect } from "react";
import { Row, Col, Navbar, Container, Form, Button, Tabs, Tab } from "react-bootstrap";
import localconfig from "../server/config/localconfig.json";
import { useStore } from "../components/store";
import ExperimentConfiguration from "../components/ExperimentConfiguration";
import Head from "next/head";

export default function BCI2000Web() {
  useEffect(() => {
    useStore.setState({ config: localconfig });
    document.documentElement.setAttribute('data-bs-theme', theme ? "dark" : "light");
  }, []);

  const [theme, setTheme] = useState(useStore.getState().config.darkMode);
  return (
    <div className="App myContainer" data-bs-theme={theme ? "dark" : "light"} >
      <Head>
        <title>BCI2000Web</title>
      </Head>
      <Navbar fixed="top" className="justify-content-between">
        <Navbar.Brand className="title justify-content-between">
          <a 
            style={{
              fontSize: "32px", 
              //textDecoration: "none !important",
              color: "#070027",
            }}
          >
            BCI2000
          </a>
        </Navbar.Brand>
          <Button id="themeBtn" variant={theme ? "outline-light" : "outline-dark"} onClick={(e) => {
            setTheme(!theme);
            document.documentElement.setAttribute('data-bs-theme', !theme ? "dark" : "light")
            }}>{ theme ? "Light Mode": "Dark Mode"}</Button>
      </Navbar>

      <Tabs
        defaultActiveKey="home"
        id="tabs"
        className="mb-3"
      >
        <Tab eventKey="home" title="Configuration">
          <ExperimentConfiguration />
        </Tab>
      </Tabs>


      <Navbar fixed="bottom">
        <h4 style={{ margin: "0 auto" }}>
          {" "}
          Like what you see? Visit{" "}
          <a href="http://cronelab.github.io">our page</a> and check out our
          <a href="http://github.com/cronelab"> repos!</a>
        </h4>
      </Navbar>
    </div>
  );
}
