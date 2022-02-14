import React from 'react';
import * as ReactDOM from 'react-dom';
import App from './App';
import { Provider } from './Context';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
// import 'bootstrap/scss/bootstrap.scss'
import '@fortawesome/fontawesome-free/scss/fontawesome.scss';
import '@fortawesome/fontawesome-free/scss/solid.scss';
import Metronome_Syllable from './Components/Tasks/Other/Metronome_Syllable';
// import Metronome_Finger from './Components/Tasks/Other/Metronome_Finger';
import PacedSentence from './Components/Tasks/Other/PacedSentence'
import Word from './Components/Tasks/Word/Word';
import Syllable from './Components/Tasks/Syllable/Syllable';

import Finger from './Components/Tasks/Movements/Finger/Finger'
import Leg from './Components/Tasks/Movements/Leg/Leg'
import Hand from './Components/Tasks/Movements/Hand/Hand'
import Arm from './Components/Tasks/Movements/Arm/Arm'
import NonSpeechMovements from './Components/Tasks/NonSpeechMovements/NonSpeechMovements';
import ASL from './Components/Tasks/Movements/ASL/ASL';

ReactDOM.render(
  <Provider>
    <Router>
      <Routes>
        <Route exact path='/' element={<App></App>}/>
        <Route path="/metronome_syllable" element={<Metronome_Syllable />} />
        {/* <Route path="/metronome_finger" element={<Metronome_Finger />} /> */}
        <Route path="/pacedsentence" element={<PacedSentence />} />
        <Route path="/wordreading" element={<Word type="reading" />} />
        <Route path="/wordrepetition" element={<Word type="repetition" />} />
        <Route path="/syllablereading" element={<Syllable type="reading" />} />
        <Route path="/syllablerepetition" element={<Syllable type="repetition"/>} />
        <Route path="/nonspeechmovements" element={<NonSpeechMovements/>} />
        <Route path="/leg" element={<Leg />} />
        <Route path="/finger" element={<Finger />} />
        <Route path="/hand" element={<Hand />} />
        <Route path="/arm" element={<Arm />} />
        <Route path="/asl" element={<ASL />} />
        
      </Routes>
    </Router>
  </Provider>,
  document.getElementById('root')
);
