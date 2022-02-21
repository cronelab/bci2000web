import React, { useEffect, useState, useContext } from 'react';
import { Container, Image, Row, Col } from 'react-bootstrap';
import { Header, Footer } from '../../../Header';
import '../../../../App.scss';
import { setupBCI, connectToBCIOperator } from '../../../Utilities/index';

import { images, sequence, stimulusDuration, ISI } from './images.js';

const sleep = (ms = 0) => new Promise((resolve) => setTimeout(resolve, ms));

const Hand = () => {
  const [presentedImage, setPresentedImage] = useState('');
  useEffect(() => {
    (async () => {
      let bciConnection = await connectToBCIOperator();
      let otherCommands =
        'Set parameter DataFile HandMovements/HandMovements%24%7bSubjectRun%7d.dat; ';
      await setupBCI(bciConnection, otherCommands);
      await sleep(5000);
      bciConnection.execute('SET STATE TrialStart 1');
      bciConnection.execute(`SET STATE StimulusCode 0`);
      await sleep(1000);
      let i = 0
      while (i < sequence.length -1) {
        bciConnection.execute(`SET STATE StimulusCode ${sequence[i]}`);
        setPresentedImage(images[sequence[i]]);
        await sleep(stimulusDuration);
        setPresentedImage('');
        await sleep(ISI);
        i++
      }

    })();
  }, []);
  return (
    <>
      <Header />
      <Container
        style={{ height: window.innerHeight * 0.8, padding: 0 }}
        className="d-flex justify-content-center"
      >
        <Image src={presentedImage} style={{ paddingTop: '3%' }}></Image>
      </Container>
      <Footer />
    </>
  );
};

export default Hand;
