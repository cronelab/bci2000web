import React, { useEffect, useState } from 'react';
import { Container } from 'react-bootstrap';
import { setupBCI, connectToBCIOperator } from '../../Utilities/index';
import { Header, Footer } from '../../Header';
import '../../../App.scss';
//@ts-ignore
import * as config from './taskConfig.json';

const sleep = (ms = 0) => new Promise((resolve) => setTimeout(resolve, ms));

const GridScan1x3 = () => {
  const [textStimulus, setTextStimulus] = useState('');
  const [rect1Color, setRect1Color] = useState('white');
  const [rect2Color, setRect2Color] = useState('white');
  const [rect3Color, setRect3Color] = useState('white');
  const [textPosition, setTextPosition] = useState('50%')

  useEffect(() => {
      (async() =>{
        setTextStimulus('BAH')
        await sleep(1000)
        setRect1Color("blue")
        setRect2Color("white")
        setRect3Color("white")
        await sleep(1000)
        setRect1Color("white")
        setRect2Color("blue")
        setRect3Color("white")
        await sleep(1000)
        setRect1Color("white")
        setRect2Color("white")
        setRect3Color("blue")
        await sleep(1000)
        setTextPosition('25%')
        setRect1Color("white")
        setRect2Color("white")
        setRect3Color("blue")
        await sleep(1000)
        setRect1Color("blue")
        setRect2Color("white")
        setRect3Color("white")
        await sleep(1000)
        setRect1Color("white")
        setRect2Color("blue")
        setRect3Color("white")
        await sleep(1000)
        setRect1Color("white")
        setRect2Color("white")
        setRect3Color("blue")
        await sleep(1000)
        setTextPosition('25%')
        setRect1Color("white")
        setRect2Color("white")
        setRect3Color("blue")
      })();
  },[])

  return (
    <>
      <Header />
      <Container fluid style={{ height: window.innerHeight * 0.8, padding: 0 }}>
        <svg width="100%" height="100%">
        <rect
            id="resultBox"
            width="100"
            height="100"
            fill={rect1Color}
            stroke="rgb(0,0,0)"
            x="25%"
            y="50%"
            className="mx-auto"
            textAnchor="middle"
          />
          <rect
            id="resultBox"
            width="100"
            height="100"
            fill={rect2Color}
            stroke="rgb(0,0,0)"
            x="50%"
            y="50%"
            className="mx-auto"
            textAnchor="middle"
          />
          <rect
            id="resultBox"
            width="100"
            height="100"
            fill={rect3Color}
            stroke="rgb(0,0,0)"
            x="75%"
            y="50%"
            className="mx-auto"
            textAnchor="middle"
          />
          <text
            fontSize={48}
            x={textPosition}
            y="40%"
            fill="black"
            className="mx-auto"
            // textAnchor="middle"
          >
            {textStimulus}
          </text>
        </svg>
      </Container>
      <Footer />
    </>
  );
};

export default GridScan1x3;
