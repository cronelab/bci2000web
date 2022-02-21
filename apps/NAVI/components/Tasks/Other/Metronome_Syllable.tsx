import React, { useEffect, useState, useContext } from 'react';
import { Container } from 'react-bootstrap';
import { setupBCI, connectToBCIOperator } from '../../Utilities/index';
import '../../../App.scss';
import { BCI2K_OperatorConnection } from 'bci2k';
const sleep = (ms = 0) => new Promise((resolve) => setTimeout(resolve, ms));

const Metronome_Syllable = () => {
  let bciConnection: BCI2K_OperatorConnection;
  const [leftFill, setLeftFill] = useState('white');
  const [rightFill, setRightFill] = useState('white');
  const [textStimulus, setTextStimulus] = useState('BAH');
  const [showText, setShowText] = useState(false);
  let i = 0;
  const wordSwitch = async (newWord: SpeechSynthesisUtterance, synthesis: Boolean, code: Number) => {
    await sleep(1000);

    if (i == 0) {
      setShowText(true);
    }
    if (i % 2 == 0) {
      bciConnection.execute(`SET STATE StimulusCode ${code}`);
      setLeftFill('black');
      setRightFill('white');
      bciConnection.execute(`SET STATE StimulusCode 0`);
    } else {
      setShowText(false);
      bciConnection.execute(`SET STATE StimulusCode ${code}`);
      setLeftFill('white');
      setRightFill('black');
      bciConnection.execute(`SET STATE StimulusCode 0`);
    }
    if (synthesis) {
      speechSynthesis.speak(newWord);
      bciConnection.execute(`SET STATE CuePeriod 1`);
      bciConnection.execute(`SET STATE ResponsePeriod 0`);
    } else {
      bciConnection.execute(`SET STATE CuePeriod 0`);
      bciConnection.execute(`SET STATE ResponsePeriod 1`);
    }

    i++;
  };

  const nextStimSequence = async (word: SpeechSynthesisUtterance, code: Number) => {
    setTextStimulus(word.text);
    await wordSwitch(word, true, code);
    await wordSwitch(word, true, code);
    await wordSwitch(word, true, code);
    await wordSwitch(word, false, code);
    await wordSwitch(word, false, code);
    await wordSwitch(word, false, code);
    i = 0;
  };
  useEffect(() => {
    const BAH = new SpeechSynthesisUtterance('bah');
    const BOO = new SpeechSynthesisUtterance('boo');
    const BEE = new SpeechSynthesisUtterance('bee');
    const TAH = new SpeechSynthesisUtterance('tah');
    const TOO = new SpeechSynthesisUtterance('too');
    const TEE = new SpeechSynthesisUtterance('tee');
    const GAH = new SpeechSynthesisUtterance('gah');
    const GOO = new SpeechSynthesisUtterance('goo');
    const GEE = new SpeechSynthesisUtterance('gee');
    const SAH = new SpeechSynthesisUtterance('sah');
    const SOO = new SpeechSynthesisUtterance('soo');
    const SEE = new SpeechSynthesisUtterance('see');
    (async () => {
      try {
        bciConnection = await connectToBCIOperator();
        setupBCI(bciConnection, '');
        await sleep(5000);
        bciConnection.execute('SET STATE TrialStart 1');
        await nextStimSequence(BAH, 1);
        await nextStimSequence(BOO, 2);
        await nextStimSequence(BEE, 3);
        await nextStimSequence(TAH, 4);
        await nextStimSequence(TOO, 5);
        await nextStimSequence(TEE, 6);
        await nextStimSequence(GAH, 7);
        await nextStimSequence(GOO, 8);
        await nextStimSequence(GEE, 9);
        await nextStimSequence(SAH, 10);
        await nextStimSequence(SOO, 11);
        await nextStimSequence(SEE, 12);

        bciConnection.execute('SET STATE TrialStart 0');
      } catch (err) {
        console.log(err);
      }
    })();
  }, []);

  return (
    <>
      <Container fluid style={{ height: window.innerHeight * 0.8, padding: 0 }}>
        <svg width="100%" height="100%">
          <circle
            cx="25%"
            cy="40%"
            r="150"
            fill={leftFill}
            stroke="black"
            strokeWidth={1}
          />
          <circle
            cx="75%"
            cy="40%"
            r="150"
            fill={rightFill}
            stroke="black"
            strokeWidth={1}
          />
          <text fontSize={48} x="50%" y="50%" fill="black" textAnchor="middle">
            {showText ? textStimulus.toLocaleUpperCase() : ''}
          </text>
        </svg>
      </Container>
    </>
  );
};

export default Metronome_Syllable;
