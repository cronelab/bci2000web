import React, { useEffect, useState, useContext } from 'react';
import { Container, Image, Row, Col } from 'react-bootstrap';
import {Header, Footer} from '../../../Header';
import '../../../../App.scss';
import { setupBCI, connectToBCIOperator } from '../../../../Utilities/index';
import footExtensionLeft from './PRM/images/left/lower/footExtensionLeft.png'; 
import footFlexionLeft from './PRM/images/left/lower/footFlexionLeft.png'; 
import kneeExtensionLeft from './PRM/images/left/lower/kneeExtensionLeft.png'; 
import kneeFlexionLeft from './PRM/images/left/lower/kneeFlexionLeft.png'; 
import legAbductionLeft from './PRM/images/left/lower/legAbductionLeft.png'; 
import legAdductionLeft from './PRM/images/left/lower/legAdductionLeft.png'; 

import footExtensionRight from './PRM/images/left/lower/footExtensionRight.png'; 
import footFlexionRight from './PRM/images/left/lower/footFlexionRight.png'; 
import kneeExtensionRight from './PRM/images/left/lower/kneeExtensionRight.png'; 
import kneeFlexionRight from './PRM/images/left/lower/kneeFlexionRight.png'; 
import legAbductionRight from './PRM/images/left/lower/legAbductionRight.png'; 
import legAdductionRight from './PRM/images/left/lower/legAdductionRight.png'; 



const sleep = (ms = 0) => new Promise((resolve) => setTimeout(resolve, ms));
const LowerMovements = () => {
  const [presentedImage, setPresentedImage] = useState('')
  useEffect(() => {
    (async () => {
      let bciConnection = await connectToBCIOperator();       // Connect to BCI2000 Operator layer
      await setupBCI(bciConnection, '');                          // Load up parameters and start executables
      await sleep(5000);                                      // Wait for 5 seconds
      bciConnection.execute('SET STATE TrialStart 1');        // Set state TrialStart to be 1
      bciConnection.execute(`SET STATE StimulusCode 0`);      // Set state StimulusCode to be 0
      await sleep(1000);                                      // Wait for 1 second
      bciConnection.execute(`SET STATE StimulusCode 1`);      // Set state StimulusCode to be 1
      setPresentedImage(LeftThumb)                            // Display the LeftThumb image on NAVI
      await sleep(2000);                                      // Sleep for 2 seconds
      bciConnection.execute(`SET STATE StimulusCode 0`);      // ....
      // setPresentedImage('')
      // await sleep(1000);
      // bciConnection.execute(`SET STATE StimulusCode 2`);
      // setPresentedImage(LeftIndex)
      // await sleep(1000);
      // setPresentedImage('')
      // await sleep(1000);
      // bciConnection.execute(`SET STATE StimulusCode 3`);
      // setPresentedImage(LeftMiddle)
      // await sleep(1000);
      // setPresentedImage('')
      // await sleep(1000);
      // bciConnection.execute(`SET STATE StimulusCode 4`);
      // setPresentedImage(LeftRing)
      // await sleep(1000);
      // bciConnection.execute(`SET STATE StimulusCode 5`);
      // setPresentedImage(LeftPinky)
      // await sleep(1000);
      // bciConnection.execute(`SET STATE StimulusCode 0`);
      // setPresentedImage('')
      // await sleep(1000);
      // bciConnection.execute(`SET STATE StimulusCode 1`);
      // setPresentedImage(LeftThumb)
      // await sleep(1000);
      // bciConnection.execute(`SET STATE StimulusCode 2`);
      // setPresentedImage(LeftIndex)
      // await sleep(1000);
      // bciConnection.execute(`SET STATE StimulusCode 3`);
      // setPresentedImage(LeftMiddle)
      // await sleep(1000);
      // bciConnection.execute(`SET STATE StimulusCode 4`);
      // setPresentedImage(LeftRing)
      // await sleep(1000);
      // bciConnection.execute(`SET STATE StimulusCode 5`);
      // setPresentedImage(LeftPinky)
      // await sleep(2000);
      // bciConnection.execute(`SET STATE StimulusCode 0`);
      // setPresentedImage('')
      // await sleep(1000);
      // bciConnection.execute(`SET STATE StimulusCode 6`);
      // setPresentedImage(RightThumb)
      // await sleep(1000);
      // bciConnection.execute(`SET STATE StimulusCode 7`);
      // setPresentedImage(RightIndex)
      // await sleep(1000);
      // bciConnection.execute(`SET STATE StimulusCode 8`);
      // setPresentedImage(RightMiddle)
      // await sleep(1000);
      // bciConnection.execute(`SET STATE StimulusCode 9`);
      // setPresentedImage(RightRing)
      // await sleep(1000);
      // bciConnection.execute(`SET STATE StimulusCode 10`);
      // setPresentedImage(RightPinky)
      // await sleep(1000);
      // bciConnection.execute(`SET STATE StimulusCode 0`);
      // setPresentedImage('')
      // await sleep(1000);
      // bciConnection.execute(`SET STATE StimulusCode 6`);
      // setPresentedImage(RightThumb)
      // await sleep(1000);
      // bciConnection.execute(`SET STATE StimulusCode 7`);
      // setPresentedImage(RightIndex)
      // await sleep(1000);
      // bciConnection.execute(`SET STATE StimulusCode 8`);
      // setPresentedImage(RightMiddle)
      // await sleep(1000);
      // bciConnection.execute(`SET STATE StimulusCode 9`);
      // setPresentedImage(RightRing)
      // await sleep(1000);
      // bciConnection.execute(`SET STATE StimulusCode 10`);
      // setPresentedImage(RightPinky)
      // await sleep(1000);
      // bciConnection.execute(`SET STATE StimulusCode 0`);
      // bciConnection.execute('SET STATE TrialStart 0');
    })()
  },[])
  return (
    <>
      <Header />
      <Container
        style={{ height: window.innerHeight * 0.8, padding: 0 }}
        className="d-flex justify-content-center">
        <Image src={presentedImage} style={{paddingTop:'3%'}}></Image>
      </Container>
      <Footer />
    </>
  );
};

export default LowerMovements;
