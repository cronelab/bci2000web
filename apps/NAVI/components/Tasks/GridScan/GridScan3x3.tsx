//@ts-nocheck
import React, { useEffect, useState, useRef } from 'react';
import { Container } from 'react-bootstrap';
import { setupBCI, connectToBCIOperator } from '../../../Utilities/index';
import { Header, Footer } from '../../Header';
import '../../../App.scss';
//@ts-ignore
import * as config from './taskConfig.json';
import {
  images,
  sequence,
  stimulusDuration,
  ISI,
} from '../Movements/Arm/images.js';

const sleep = (ms = 0) => new Promise((resolve) => setTimeout(resolve, ms));

const GridScan3x3 = () => {
  const [textStimulus, setTextStimulus] = useState('');
  const rectRef1 = useRef();
  const rectRef2 = useRef();
  const rectRef3 = useRef();
  const rectRef4 = useRef();
  const rectRef5 = useRef();
  const rectRef6 = useRef();
  const rectRef7 = useRef();
  const rectRef8 = useRef();
  const rectRef9 = useRef();
  const imageRef1 = useRef();
  const imageRef2 = useRef();
  const imageRef3 = useRef();
  const imageRef4 = useRef();
  const imageRef5 = useRef();
  const imageRef6 = useRef();
  const imageRef7 = useRef();
  const imageRef8 = useRef();
  const imageRef9 = useRef();

  const [selectionMade, setSelectionMade] = useState(false);

  let searchParams = new URLSearchParams(window.location.search);
  let taskType = searchParams.get('task');

  useEffect(() => {
    (async () => {
      await sleep(1000);
      if (taskType == 'motor') {
        if (selectionMade == false) {
          imageRef1.current.style.outline = '12px solid blue';
          imageRef2.current.style.outline = '';
          imageRef3.current.style.outline = '';
          imageRef4.current.style.outline = '';
          imageRef5.current.style.outline = '';
          imageRef6.current.style.outline = '';
          imageRef7.current.style.outline = '';
          imageRef8.current.style.outline = '';
          imageRef9.current.style.outline = '';
        }
        await sleep(1000);
        if (selectionMade == false) {
          imageRef1.current.style.outline = '';
          imageRef2.current.style.outline = '';
          imageRef3.current.style.outline = '';
          imageRef4.current.style.outline = '';
          imageRef5.current.style.outline = '12px solid blue';
          imageRef6.current.style.outline = '';
          imageRef7.current.style.outline = '';
          imageRef8.current.style.outline = '';
          imageRef9.current.style.outline = '';
        }
        await sleep(1000);
        if (selectionMade == false) {
          imageRef1.current.style.outline = '';
          imageRef2.current.style.outline = '';
          imageRef3.current.style.outline = '';
          imageRef4.current.style.outline = '';
          imageRef5.current.style.outline = '';
          imageRef6.current.style.outline = '';
          imageRef7.current.style.outline = '';
          imageRef8.current.style.outline = '12px solid blue';
          imageRef9.current.style.outline = '';
        }
      } else if (taskType == 'language') {
        // setTextStimulus('BAH')
        rectRef1.current.style.fill = 'blue';
        rectRef1.current.style.fill = 'white';
        rectRef2.current.style.fill = 'white';
        rectRef3.current.style.fill = 'white';
        rectRef4.current.style.fill = 'white';
        rectRef5.current.style.fill = 'white';
        rectRef6.current.style.fill = 'white';
        rectRef7.current.style.fill = 'white';
        rectRef8.current.style.fill = 'white';
        rectRef9.current.style.fill = 'white';
        await sleep(1000);
        // setTextStimulus('BAH')
        rectRef1.current.style.fill = 'white';
        rectRef1.current.style.fill = 'white';
        rectRef2.current.style.fill = 'white';
        rectRef3.current.style.fill = 'white';
        rectRef4.current.style.fill = 'white';
        rectRef5.current.style.fill = 'white';
        rectRef6.current.style.fill = 'white';
        rectRef7.current.style.fill = 'blue';
        rectRef8.current.style.fill = 'white';
        rectRef9.current.style.fill = 'white';
        await sleep(1000);
        // setTextStimulus('BAH')
        rectRef1.current.style.fill = 'white';
        rectRef1.current.style.fill = 'white';
        rectRef2.current.style.fill = 'white';
        rectRef3.current.style.fill = 'blue';
        rectRef4.current.style.fill = 'white';
        rectRef5.current.style.fill = 'white';
        rectRef6.current.style.fill = 'white';
        rectRef7.current.style.fill = 'white';
        rectRef8.current.style.fill = 'white';
        rectRef9.current.style.fill = 'white';
      }
    })();

    document.addEventListener('keydown', keyPress);

    return () => {
      document.removeEventListener('keydown', keyPress);
    };
  }, []);
  const keyPress = async (e) => {
    console.log(selectionMade);
    if (e.key == 'ArrowLeft') {
      setSelectionMade(true);
    }
  };

  const TypeOfStim = () => {
    if (taskType == 'motor') {
      return (
        <>
          {' '}
          <image ref={imageRef1} href={images[0]} width="400" x="25%" y="25%" />
          <image ref={imageRef2} href={images[1]} width="400" x="50%" y="25%" />
          <image ref={imageRef3} href={images[2]} width="400" x="75%" y="25%" />
          <image ref={imageRef4} href={images[3]} width="400" x="25%" y="50%" />
          <image ref={imageRef5} href={images[4]} width="400" x="50%" y="50%" />
          <image ref={imageRef6} href={images[5]} width="400" x="75%" y="50%" />
          <image ref={imageRef7} href={images[6]} width="400" x="25%" y="75%" />
          <image ref={imageRef8} href={images[7]} width="400" x="50%" y="75%" />
          <image ref={imageRef9} href={images[8]} width="400" x="75%" y="75%" />
        </>
      );
    } else if (taskType == 'language') {
      return (
        <>
          <g>
            <rect
              ref={rectRef1}
              id="resultBox"
              width="100"
              height="100"
              fill="white"
              stroke="rgb(0,0,0)"
              x={'25%'}
              y={'25%'}
              alignmentBaseline="middle"
            
            />
            <text
              x="26%"
              y="28%"
              fontSize={'48px'}
              alignmentBaseline="middle"
              textAnchor="middle"
              baseli
            >
              BAH
            </text>
          </g>
          <g>

            <rect
              ref={rectRef2}
              id="resultBox"
              width="100"
              height="100"
              fill="white"
              stroke="rgb(0,0,0)"
              x="50%"
              y="25%"
              className="mx-auto"
              textAnchor="middle"
            />
            <text
              x="51%"
              y="28%"
              fontSize={'48px'}
              alignmentBaseline="middle"
              textAnchor="middle"
            >
              TAH 
            </text>
          </g>
          <g>
            <rect
              ref={rectRef3}
              id="resultBox"
              width="100"
              height="100"
              fill="white"
              stroke="rgb(0,0,0)"
              x="75%"
              y="25%"
              className="mx-auto"
              textAnchor="middle"
            />
            <text
              x="76%"
              y="28%"
              fontSize={'48px'}
              alignmentBaseline="middle"
              textAnchor="middle"
            >
              TEE 
            </text>
          </g>
          <g>
            <rect
              ref={rectRef4}
              id="resultBox"
              width="100"
              height="100"
              fill="white"
              stroke="rgb(0,0,0)"
              x="25%"
              y="50%"
              className="mx-auto"
              textAnchor="middle"
            />
            <text
              x="26%"
              y="53%"
              fontSize={'48px'}
              alignmentBaseline="middle"
              textAnchor="middle"
            >
              SAH 
            </text>
          </g>
          <g>
            <rect
              ref={rectRef5}
              id="resultBox"
              width="100"
              height="100"
              fill="white"
              stroke="rgb(0,0,0)"
              x="50%"
              y="50%"
              className="mx-auto"
              textAnchor="middle"
            />
            <text
              x="51%"
              y="53%"
              fontSize={'48px'}
              alignmentBaseline="middle"
              textAnchor="middle"
            >
              SEE
            </text>
          </g>
          <g>
            <rect
              ref={rectRef6}
              id="resultBox"
              width="100"
              height="100"
              fill="white"
              stroke="rgb(0,0,0)"
              x="75%"
              y="50%"
              className="mx-auto"
              textAnchor="middle"
            />
            <text
              x="76%"
              y="53%"
              fontSize={'48px'}
              alignmentBaseline="middle"
              textAnchor="middle"
            >
               VAH
            </text>
          </g>
          <g>
            <rect
              ref={rectRef7}
              id="resultBox"
              width="100"
              height="100"
              fill="white"
              stroke="rgb(0,0,0)"
              x="25%"
              y="75%"
              className="mx-auto"
              textAnchor="middle"
            />
            <text
              x="26%"
              y="78%"
              fontSize={'48px'}
              alignmentBaseline="middle"
              textAnchor="middle"
            >
               VEE 
            </text>
          </g>
          <g>
            {' '}
            <rect
              ref={rectRef8}
              id="resultBox"
              width="100"
              height="100"
              fill="white"
              stroke="rgb(0,0,0)"
              x="50%"
              y="75%"
              className="mx-auto"
              textAnchor="middle"
            />
            <text
              x="51%"
              y="78%"
              fontSize={'48px'}
              alignmentBaseline="middle"
              textAnchor="middle"
            >
              YAH 
            </text>
          </g>
          <g>
            {' '}
            <rect
              ref={rectRef9}
              id="resultBox"
              width="100"
              height="100"
              fill="white"
              stroke="rgb(0,0,0)"
              x="75%"
              y="75%"
              className="mx-auto"
              textAnchor="middle"
            />
            <text
              x="76%"
              y="78%"
              fontSize={'48px'}
              alignmentBaseline="middle"
              textAnchor="middle"
            >
              YEE
            </text>
          </g>
          <text
            fontSize={48}
            x="50%"
            y="50%"
            fill="black"
            className="mx-auto"
            textAnchor="middle"
          >
            {textStimulus}
          </text>
        </>
      );
    }
  };

  return (
    <>
      <Header />
      <Container fluid style={{ height: window.innerHeight * 0.8, padding: 0 }}>
        <svg width="100%" height="100%">
          <TypeOfStim></TypeOfStim>
        </svg>
      </Container>
      <Footer />
    </>
  );
};

export default GridScan3x3;
