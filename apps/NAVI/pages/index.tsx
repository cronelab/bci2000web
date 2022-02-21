import type { NextPage } from "next";
import Image from "next/image";
import styles from "../styles/Home.module.css";
import { useStore } from "../components/store";
import { useEffect } from "react";
import { Row, Col, Navbar, Container, Form, Button } from "react-bootstrap";
import MainBody from "../components/MainBody";
import TextInput from "../components/TextInput";
import WebcamCapture from "../components/WebcamCapture";
const Home: NextPage = () => {
  useEffect(() => {}, []);
  const menuState = useStore.getState().menuState
  return (
    <div>
      <Container id="appbody" fluid style={{ height: "85%" }}>
        <Row style={{ height: "50%" }}>
          <Col>
            {menuState == "main" ? (
              <MainBody></MainBody>
             ) : // bciConnection.execute("SET STATE OPTIONNUMBERS 2")

            // menuState == "games" ? (
            //   <Games></Games>
            // ) : menuState == "calibration" ? (
            //   <Calibration></Calibration>
            // ) : menuState == "personal" ? (
            //   <Personal></Personal>
            // ) : // Send steve current context
            // // bciConnection.execute("SET STATE OPTIONNUMBERS 3")
            menuState == "camera" ? (
              <WebcamCapture></WebcamCapture>
            // ) : menuState == "snake" ? (
            //   <Snake></Snake>
            // ) : // tell steve i'm playing snake
            // menuState == "pong" ? (
            //   <Pong></Pong>
            // ) : menuState == "journal" ? (
            //   <Journal></Journal>
            // ) : menuState == "externalsite" ? (
            //   <ExternalSites></ExternalSites>
            // ) : menuState == "centipede" ? (
            //   <Centipede></Centipede>
            // ) : menuState == "iot" ? (
            //   <IoT></IoT>
            ) : (
              // ) : menuState == 'xr' ? (
              //   <XR></XR>
              // ) : menuState == 'wasmboy' ? (
              //   <WasmB2oy></WasmB2oy>
              <></>
            )}
          </Col>
        </Row>
        <Row style={{ height: "50%" }}>
          <Col style={{ alignSelf: "flex-end" }}>
            {useStore.getState().keyboardState != "none" ? <TextInput></TextInput> : <></>}
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default Home;

/* eslint-disable new-cap */
// /* eslint-disable no-await-in-loop */

// import React, { useEffect, useContext, useState, useRef } from 'react';
// import { Container, Row, Col } from 'react-bootstrap';
// import {Header, Footer} from './Components/Header';
// import MainBody from './Components/MainBody';
// import Games from './Components/Cards/Games';
// import Personal from './Components/Cards/Personal';
// import WebcamCapture from './Components/WebcamCapture';
// import Snake from './Components/Games/Snake';
// import Pong from './Components/Games/Pong';
// import Centipede from './Components/Games/Centipede';
// import Journal from './Components/Cards/Journal';
// import ExternalSites from './Components/Cards/ExternalSites';
// import Calibration from './Components/Cards/Calibration';
// import IoT from './Components/Cards/IoT';
// import TextInput from './Components/TextInput';
// import { Context } from './Context';
// import './App.scss';
// import { revertAllItems } from './Utilities/cssController';
// import {
//   bciMover,
//   virtualClick,
//   setupBCI,
//   connectToBCISource,
//   connectToBCIOperator,
//   getSelectableItems,
//   switchItem,
// } from './Utilities/index';

// const sleep = (ms = 0) => new Promise((resolve) => setTimeout(resolve, ms));

// const App = () => {
//   const {
//     numItems,
//     setNumItems,
//     selectableElements,
//     keyboardState,
//     setSelectableElements,
//     menuState,
//     setBciOperator,
//     bciOperator,
//     setBciSource,
//     bciSource,
//   } = useContext(Context);

//   useEffect(() => {
//     (async () => {
//       try {
//         let bciConnection = await connectToBCIOperator();
//         setupBCI(bciConnection);
//         setBciOperator(bciConnection);
//         await sleep(5000);
//         let sourceConnection = await connectToBCISource();
//         // setBciSource(sourceConnection);
//         // console.log(sourceConnection);
//         let clickOnce = false;
//         sourceConnection.onStateFormat = (a) => console.log(a);
//         let processBlock = true;
//         sourceConnection.onGenericSignal = async (x) => {
//           if (processBlock) {
//             processBlock = false;
//             if (Object.keys(sourceConnection.states).length != 0) {
//               if (
//                 sourceConnection.states?.ControlClick[0] == 1 &&
//                 clickOnce == false
//               ) {
//                 clickOnce = true;
//                 bciConnection.execute('Set State ControlClick 0');
//                 revertAllItems();
//                 currRefItem.current = true;
//                 await sleep(2000);

//                 let items = getSelectableItems();
//                 setSelectableElements(items);
//                 setNumItems(0);
//                 setNumItems(items.length);
//               }
//               if (
//                 sourceConnection.states?.ControlClick[0] == 0 &&
//                 clickOnce == true
//               ) {
//                 clickOnce = false;
//               }
//               if (
//                 sourceConnection.states?.CursorClick[0] == 1 &&
//                 clickOnce === false
//               ) {
//                 console.log(sourceConnection.states?.CursorClick[0]);
//                 clickOnce = true;
//                 bciConnection.execute('SET STATE CursorClick 0');
//                 bciConnection.execute('SET STATE CursorUp 0');
//                 bciConnection.execute('SET STATE CursorDown 0');
//                 bciConnection.execute('SET STATE CursorRight 0');
//                 bciConnection.execute('SET STATE CursorLeft 0');
//                 await sleep(1000);
//                 virtualClick();
//               }
//               // if (bciSource.states?.CursorClick[0] == 0 && clickOnce == true) {
//               // }
//               // if (sourceConnection.states?.EyetrackerLeftEyeGazeX[0] !== 0) {
//               //   let leftEyeX =
//               //     sourceConnection.states?.EyetrackerLeftEyeGazeX[0];
//               //   let leftEyeY =
//               //     sourceConnection.states?.EyetrackerLeftEyeGazeY[0];
//               //   let rightEyeX =
//               //     sourceConnection.states?.EyetrackerRightEyeGazeX[0];
//               //   let rightEyeY =
//               //     sourceConnection.states?.EyetrackerRightEyeGazeY[0];
//               //   let xPos = (leftEyeX + rightEyeX) / 2;
//               //   let xPosScaled = xPos / 1.5;
//               //   let yPos = (leftEyeY + rightEyeY) / 2;
//               //   let yPosScaled = yPos / 1.5;

//               //   var cursor = document.getElementById('cursor');
//               //   let currPos = {
//               //     x: xPosScaled,
//               //     y: yPosScaled,
//               //   };
//               //   cursor.style.left = `${currPos.x + 4}px`;
//               //   cursor.style.top = `${currPos.y - 4}px`;
//               // }
//               if (sourceConnection.states?.CursorLeft[0] == 1) {
//                 clickOnce = false;
//                 bciMover('left');
//               }
//               if (sourceConnection.states?.CursorRight[0] == 1) {
//                 clickOnce = false;
//                 bciMover('right');
//               }
//               if (sourceConnection.states?.CursorUp[0] == 1) {
//                 clickOnce = false;
//                 bciMover('up');
//               }
//               if (sourceConnection.states?.CursorDown[0] == 1) {
//                 clickOnce = false;
//                 bciMover('down');
//               }
//               if (sourceConnection.states?.ControlLeft[0] == 1) {
//                 bciConnection.execute('SET STATE ControlLeft 0');
//               }
//               if (sourceConnection.states?.ControlRight[0] == 1) {
//                 bciConnection.execute('SET STATE ControlRight 0');
//               }
//               if (sourceConnection.states?.ControlUp[0] == 1) {
//                 bciConnection.execute('SET STATE ControlUp 0');
//               }
//               if (sourceConnection.states?.ControlDown[0] == 1) {
//                 bciConnection.execute('SET STATE ControlDown 0');
//               }
//               // else if (bciSource.states?.CursorLeft[])
//             }
//             processBlock = true;
//           }
//         };
//       } catch (err) {
//         console.log(err);
//       }
//     })();
//   }, []);

//   const currRefItem = useRef(false);

//   useEffect(() => {
//     let items = getSelectableItems();
//     setSelectableElements(items);
//     setNumItems(items.length);
//     window.addEventListener('keydown', async (e) => {
//       if (e.key === 'Enter') {
//         revertAllItems();
//         currRefItem.current = true;
//         await sleep(1000);

//         let items = getSelectableItems();
//         setSelectableElements(items);
//         setNumItems(0);
//         setNumItems(items.length);
//       }
//       if (e.key === 'Escape') {
//         let items = getSelectableItems();
//         currRefItem.current = false;
//         setSelectableElements(items);
//         setNumItems(0);
//         setNumItems(items.length);
//       }
//     });
//   }, []);

//   // useEffect(() => {
//   //   if (bciSource?._socket.readyState == 1) {
//   //     let clickOnce = false;
//   //     console.log(bciSource);
//   //   }
//   // }, []);

//   useEffect(() => {
//     (async () => {
//       if (numItems != 0) {
//         let currentElementCount = 0;
//         for (let i = 0; i < selectableElements.length; i++) {
//           switchItem(selectableElements[currentElementCount], true);
//           await sleep(1000);
//           if (currRefItem.current == false) {
//             switchItem(selectableElements[currentElementCount], false);
//             currentElementCount++;
//           }
//           if (currRefItem.current == true) {
//             selectableElements[currentElementCount].click();
//             currRefItem.current = false;
//             break;
//           }
//           if (currentElementCount == numItems) {
//             let items = getSelectableItems();
//             setSelectableElements(items);
//             setNumItems(0);
//             setNumItems(items.length);
//           }
//         }
//       }
//     })();
//   }, [numItems]);

//   return (

//   );
// };

// export default App;
