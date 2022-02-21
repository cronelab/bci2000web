import React, { useEffect, useState } from 'react';
import { Container } from 'react-bootstrap';
import { setupBCI, connectToBCIOperator } from '../../Utilities/index';
import { Header, Footer } from '../../Header';
import '../../../App.scss';
//@ts-ignore
import * as config from './taskConfig.json';
import { BCI2K_OperatorConnection } from 'bci2k';

const sleep = (ms = 0) => new Promise((resolve) => setTimeout(resolve, ms));

const Word = (type: string) => {
  const [textStimulus, setTextStimulus] = useState('');
  const [pace, setPace] = useState('auto');
  useEffect(() => {
    let bciConnection: BCI2K_OperatorConnection;
    let i = 0;
    let searchParams = new URLSearchParams(window.location.search);
    let paceType = searchParams.get('pace')!;
    setPace(paceType);

    let words = config.stimuli.split(' ');
    let sequence = config.sequence;

    let ISImax = config.ISImax;
    let ISImin = config.ISImin;

    let speech: SpeechSynthesisUtterance[] = [];
    if (type == 'repetition') {
      words.forEach((word) => {
        speech.push(new SpeechSynthesisUtterance(word));
      });
    }
    (async () => {
      try {
        bciConnection = await connectToBCIOperator();
        if (type == 'repetition') {
          let otherCommands =
            'Set parameter DataFile CC1/WordRepetition/WordRepetition_Run%24%7bSubjectRun%7d.dat; ';
          setupBCI(bciConnection, otherCommands);
        } else if (type == 'reading') {
          let otherCommands =
            'Set parameter DataFile CC1/WordReading/WordReading_Run%24%7bSubjectRun%7d.dat; ';
          setupBCI(bciConnection, otherCommands);
        }
        await sleep(5000);
        bciConnection.execute('SET STATE TrialStart 1');

        setTextStimulus('+');

        if (paceType == 'auto') {
          while (i < sequence.length - 1) {
            let ISI = Math.random() * (ISImax - ISImin + 1) + ISImin;

            await sleep(ISI);
            if (type == 'repetition') {
              setTextStimulus(' ');
              speechSynthesis.speak(speech[sequence[i] - 1]);
            } else if (type == 'reading') {
              setTextStimulus(words[sequence[i] - 1]);
            }
            bciConnection.execute(`SET STATE StimulusCode ${sequence[i]}`);
            await sleep(config.stimulusDuration);
            setTextStimulus('+');
            bciConnection.execute('SET STATE StimulusCode 0');
            i++;
          }
        }
      } catch (err) {
        console.log(err);
      }
    })();

    const keyPress = async (e: KeyboardEvent) => {
      let resultBox: HTMLElement = document.getElementById('resultBox')!;
      if (e.key == 'ArrowLeft') {
        resultBox.style.fill = 'red';
        bciConnection.execute(`SET STATE ResultCode 1`);
        if (type == 'repetition') {
          setTextStimulus(' ');
          speechSynthesis.speak(speech[sequence[i] - 1]);
        } else if (type == 'reading') {
          setTextStimulus(words[sequence[i] - 1]);
        }
        bciConnection.execute(`SET STATE StimulusCode ${sequence[i]}`);
        await sleep(config.stimulusDuration);
        setTextStimulus('+');
        resultBox.style.fill = 'white';
        bciConnection.execute(`SET STATE StimulusCode 0`);
        i++;
      } else if (e.key == 'ArrowRight') {
        resultBox.style.fill = 'green';
        bciConnection.execute(`SET STATE ResultCode 2`);
        if (type == 'repetition') {
          setTextStimulus(' ');
          speechSynthesis.speak(speech[sequence[i] - 1]);
        } else if (type == 'reading') {
          setTextStimulus(words[sequence[i] - 1]);
        }
        bciConnection.execute(`SET STATE StimulusCode ${sequence[i]}`);
        await sleep(config.stimulusDuration);
        setTextStimulus('+');
        resultBox.style.fill = 'white';
        bciConnection.execute(`SET STATE StimulusCode 0`);
        bciConnection.execute(`SET STATE ResultCode 0`);
        i++;
      }
    };

    if (paceType == 'self') {
      document.addEventListener('keydown', keyPress);

      return () => {
        document.removeEventListener('keydown', keyPress);
      };
    }
  }, []);

  return (
    <>
      <Header />
      <Container fluid style={{ height: window.innerHeight * 0.8, padding: 0 }}>
        <svg width="100%" height="100%">
          <rect
            id="resultBox"
            width="100"
            height="100"
            fill="white"
            x="50%"
            y="20"
            className="mx-auto"
            textAnchor="middle"
          />
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
        </svg>
      </Container>
      <Footer />
    </>
  );
};

export default Word;