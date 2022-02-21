import { ListGroup, ListGroupItem } from "react-bootstrap";

import { useRouter } from "next/router";

export default function Post() {
  const router = useRouter();
  const { slug } = router.query;

  return (
    <ListGroup>
      <ListGroup.Item>Metronome_Finger</ListGroup.Item>
      <ListGroup.Item>Metronome_Syllable</ListGroup.Item>
      <ListGroup.Item>PacedSentence</ListGroup.Item>
      <ListGroup.Item>WordReading </ListGroup.Item>
      <ListGroup.Item>WordRepetition</ListGroup.Item>
      {/* //         <Route path="/wordreading" element={<Word type="reading" />} />
//         <Route path="/wordrepetition" element={<Word type="repetition" />} />
//         <Route path="/syllablereading" element={<Syllable type="reading" />} />
//         <Route path="/syllablerepetition" element={<Syllable type="repetition"/>} /> */}
      <ListGroup.Item>SyllableReading</ListGroup.Item>
      <ListGroup.Item>SyllableRepetition</ListGroup.Item>
      <ListGroup.Item>NonSpeechMovements</ListGroup.Item>
      <ListGroup.Item>Leg</ListGroup.Item>
      <ListGroup.Item>Finger</ListGroup.Item>
      <ListGroup.Item>Hand</ListGroup.Item>
      <ListGroup.Item>Arm</ListGroup.Item>
      <ListGroup.Item>ASL</ListGroup.Item>
      <ListGroup.Item>GridScan1x3</ListGroup.Item>
      <ListGroup.Item>GridScan3x3</ListGroup.Item>
    </ListGroup>
  );
}
