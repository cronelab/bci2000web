import React, { useContext, useRef, useEffect } from 'react';
import {
  Navbar,
  Nav,
  Button,
  Container,
  Popover,
  OverlayTrigger,
  ButtonGroup,
  DropdownButton,
} from 'react-bootstrap';
import { Context } from '../Context';
import {
  AlertButton,
  ExternalSiteButton,
  HomeButton,
  LightButton,
  BookmarkButton,
  KeyboardButton,
  SettingsButton,
  CameraButton,
} from '../svgButtons';


const Header = () => {
  const { setMenuState, selectableRefs, setSelectableRefs } =
    useContext(Context);
  const settingsRef = useRef();
  const alarmRef = useRef();
  const homeRef = useRef();
  const lightRef = useRef();
  return (
    <Navbar expand="lg" style={{ backgroundColor: '#1e90ff' }}>
      <Button
        className="selectableItem"
        ref={settingsRef}
        onClick={() => {
          setMenuState('externalsite');
        }}
      >
        <ExternalSiteButton></ExternalSiteButton>
      </Button>

      <Navbar.Brand>Neurally Augmented Virtual Interface</Navbar.Brand>

      <Navbar.Collapse id="basic-navbar-nav" className="justify-content-end">
        <Nav>
          <Button
            className="selectableItem"
            ref={alarmRef}
            onClick={async () => {
              const utterance = new SpeechSynthesisUtterance(
                'Alert! Alert! Alert!'
              );
              speechSynthesis.speak(utterance);
              let req = await fetch('/textCaregiver');
              let res = await req.text();
            }}
          >
            <AlertButton />
          </Button>

          <Button
            className="selectableItem"
            onClick={() => {
              setMenuState('main');
            }}
            ref={homeRef}
          >
            <HomeButton></HomeButton>
          </Button>
          {/* <Button
            ref={lightRef}
            className="selectableItem"
            onClick={() => {
              console.log(document.getElementById('overlay'));
              document.getElementById('overlay').style.opacity = '1';
              // .animate({
              //   opacity: 1,
              // });
            }}
          >
              <LightButton/>
          </Button> */}
        </Nav>
      </Navbar.Collapse>
    </Navbar>
  );
};

const Footer = () => {
  const favoriteRef = useRef();
  const textRef = useRef();
  const cameraRef = useRef();
  const {
    setNumItems,
    setMenuState,
    setKeyboardState,
    keyboardState,
    bciOperator,
    menuState,
  } = useContext(Context);

  const popover = (
    <Popover id="stateSimulator">
      <Popover.Header as="h3">BCI2000 State Simulator</Popover.Header>
      <Popover.Header as="p" style={{ fontSize: 'smaller' }}>
        (Interchangable with neural decoder)
      </Popover.Header>
      <Popover.Body>
        <DropdownButton as={ButtonGroup} title="Continuous control" drop="up">
          <Button
            onClick={() => {
              bciOperator.execute('SET STATE CursorUp 1');
              bciOperator.execute('SET STATE CursorDown 0');
              bciOperator.execute('SET STATE CursorLeft 0');
              bciOperator.execute('SET STATE CursorRight 0');
            }}
          >
            Cursor Up
          </Button>
          <Button
            onClick={() => {
              bciOperator.execute('SET STATE CursorDown 1');
              bciOperator.execute('SET STATE CursorUp 0');
              bciOperator.execute('SET STATE CursorLeft 0');
              bciOperator.execute('SET STATE CursorRight 0');
            }}
          >
            Cursor Down
          </Button>
          <Button
            onClick={() => {
              bciOperator.execute('SET STATE CursorLeft 1');
              bciOperator.execute('SET STATE CursorUp 0');
              bciOperator.execute('SET STATE CursorDown 0');
              bciOperator.execute('SET STATE CursorRight 0');
            }}
          >
            Cursor Left
          </Button>
          <Button
            onClick={() => {
              bciOperator.execute('SET STATE CursorRight 1');
              bciOperator.execute('SET STATE CursorUp 0');
              bciOperator.execute('SET STATE CursorDown 0');
              bciOperator.execute('SET STATE CursorLeft 0');
            }}
          >
            Cursor Right
          </Button>
          <Button
            onClick={() => {
              bciOperator.execute('SET STATE CursorUp 0');
              bciOperator.execute('SET STATE CursorDown 0');
              bciOperator.execute('SET STATE CursorLeft 0');
              bciOperator.execute('SET STATE CursorRight 0');
            }}
          >
            Stop
          </Button>
          <Button
            onClick={() => {
              bciOperator.execute('SET STATE CursorClick 1');
              bciOperator.execute('SET STATE CursorUp 0');
              bciOperator.execute('SET STATE CursorDown 0');
              bciOperator.execute('SET STATE CursorLeft 0');
              bciOperator.execute('SET STATE CursorRight 0');
            }}
          >
            Cursor click
          </Button>
        </DropdownButton>
        <DropdownButton
          as={ButtonGroup}
          title="Discrete/Scanning control"
          drop="up"
        >
          <Button
            onClick={() => {
              bciOperator.execute('SET STATE ControlUp 1');
              bciOperator.execute('SET STATE ControlDown 0');
              bciOperator.execute('SET STATE ControlLeft 0');
              bciOperator.execute('SET STATE ControlRight 0');
            }}
          >
            Control up
          </Button>
          <Button
            onClick={() => {
              bciOperator.execute('SET STATE ControlUp 0');
              bciOperator.execute('SET STATE ControlDown 1');
              bciOperator.execute('SET STATE ControlLeft 0');
              bciOperator.execute('SET STATE ControlRight 0');
            }}
          >
            Control down
          </Button>
          <Button
            onClick={() => {
              bciOperator.execute('SET STATE ControlUp 0');
              bciOperator.execute('SET STATE ControlDown 0');
              bciOperator.execute('SET STATE ControlLeft 1');
              bciOperator.execute('SET STATE ControlRight 0');
            }}
          >
            Control left
          </Button>
          <Button
            onClick={() => {
              bciOperator.execute('SET STATE ControlUp 0');
              bciOperator.execute('SET STATE ControlDown 0');
              bciOperator.execute('SET STATE ControlLeft 0');
              bciOperator.execute('SET STATE ControlRight 1');
            }}
          >
            Control right
          </Button>
          <Button
            onClick={() => {
              bciOperator.execute('SET STATE ControlClick 1');
              bciOperator.execute('SET STATE ControlUp 0');
              bciOperator.execute('SET STATE ControlDown 0');
              bciOperator.execute('SET STATE ControlLeft 0');
              bciOperator.execute('SET STATE ControlRight 0');
            }}
          >
            Mental click
          </Button>
        </DropdownButton>

        <Button
          onClick={async () => {
            let req = await fetch('/moverobot');
            let rs = await req.json();
          }}
        >
          Robotic arm controller
        </Button>
      </Popover.Body>
    </Popover>
  );
  return (
    <Navbar style={{ backgroundColor: '#1e90ff' }} expand="lg" fixed="bottom">
      <Navbar.Toggle aria-controls="basic-navbar-nav" />
      <Navbar.Collapse
        id="basic-navbar-nav"
        style={{ display: 'flex', justifyContent: 'center' }}
      >
        <Nav>
          <Button
            ref={textRef}
            className="selectableItem"
            onClick={() => {
              if (keyboardState === 'none') {
                setKeyboardState('block');
              } else {
                setKeyboardState('none');
              }
            }}
          >
            <KeyboardButton />
          </Button>
          <Button className="selectableItem" ref={favoriteRef}>
            <BookmarkButton />
          </Button>
          <Button
            ref={cameraRef}
            className="selectableItem"
            onClick={() => setMenuState('camera')}
          >
            <CameraButton />
          </Button>
          <OverlayTrigger trigger="click" placement="right" overlay={popover}>
            <Button onClick={() => {}} style={{ marginRight: 'auto' }}>
              <SettingsButton />
            </Button>
          </OverlayTrigger>
        </Nav>
      </Navbar.Collapse>
    </Navbar>
  );
};

export {Header, Footer}