import React, { useEffect, useState, useContext, useRef, ReactSVGElement } from 'react';
import { Container } from 'react-bootstrap';
// import { Context } from '../../Context';
// import anime from 'animejs/lib/anime.es.js';

const sleep = (ms = 0) => new Promise((resolve) => setTimeout(resolve, ms));

const PacedSentence = () => {
  useEffect(() => {
    (async () => {
      await sleep(2000);
      console.log(rectangleRef.current)
    })();
  }, []);


  const rectangleRef = React.useRef() as React.MutableRefObject<SVGRectElement>;



  return (
    <>
      <Container fluid style={{ height: window.innerHeight * 0.8, padding: 0 }}>
        <svg width="100%" height="100%">
          <circle
            cx="25%"
            cy="45%"
            r="10"
            fill="red"
            stroke="black"
            strokeWidth={1}
          />
          <text x="20%" y="50%">
            There was an Old Man of Marseilles
          </text>

          <rect width="20" height="20" x="20%" y="50%" ref={rectangleRef}>
          </rect>
        </svg>
      </Container>
    </>
  );
};

export default PacedSentence;
