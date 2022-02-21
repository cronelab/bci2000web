import React, { useEffect, useState } from 'react';
import { Container, Image } from 'react-bootstrap';
import { setupBCI, connectToBCIOperator } from '../../Utilities/index';
import { Header, Footer } from '../../Header';
import '../../../App.scss';
import config from './ASL/images.js';

const sleep = (ms = 0) => new Promise((resolve) => setTimeout(resolve, ms));

const MovementTasks = (type: string) => {
  const [textStimulus, setTextStimulus] = useState('');
  const [presentedImage, setPresentedImage] = useState('');
  const [pace, setPace] = useState('auto');
  useEffect(() => {
    let bciConnection;
    let searchParams = new URLSearchParams(window.location.search);
    let paceType = searchParams.get('pace')!;
    setPace(paceType);

    let stimuli = config.stimuli;
    let sequence = config.sequence;
    


    // (async () => {
    //   try {
    //     bciConnection = await connectToBCIOperator();
    //     if (type == 'asl'){
    //       let otherCommands =
    //       'Set parameter DataFile CC1/SyllableRepetition/SyllableRepetition_Run%24%7bSubjectRun%7d.dat; ';
    //     setupBCI(bciConnection, otherCommands);
    //     await sleep(5000);
    //     bciConnection.execute('SET STATE TrialStart 1');
          
    //     setTextStimulus('+');
        
    //     if (paceType == 'auto') {
    //       let i: number = 0;
    //       while (i < sequence.length - 1) {

    //         await sleep(config.ISI);
    //         if (type == 'repetition') {
    //           setTextStimulus(' ');
    //           // speechSynthesis.speak(speech[sequence[i] - 1]);
    //         } else if (type == 'reading') {
    //           setTextStimulus(stimuli[sequence[i] - 1]);
    //         }
    //         bciConnection.execute(`SET STATE StimulusCode ${sequence[i]}`);
    //         await sleep(config.stimulusDuration);
    //         setTextStimulus('+');
    //         bciConnection.execute('SET STATE StimulusCode 0');
    //         i++;
    //       }
    //   bciConnection.execute(`SET STATE StimulusCode 0`);
    //   await sleep(1000);
    //   let j = 0
    //   while (j < sequence.length -1) {
    //     bciConnection.execute(`SET STATE StimulusCode ${sequence[i]}`);
    //     setPresentedImage(images[sequence[i]]);
    //     await sleep(stimulusDuration);
    //     setPresentedImage('');
    //     await sleep(config.ISI);
    //     i++
    //   }

    // })();
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

export default MovementTasks;
