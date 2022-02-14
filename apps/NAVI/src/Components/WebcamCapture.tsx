import React, { useRef, useState, useCallback } from 'react';
import Webcam from 'react-webcam';
import { Container } from 'react-bootstrap';
const WebcamCapture = () => {
  const webcamRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const [capturing, setCapturing] = useState(false);
  const [recordedChunks, setRecordedChunks] = useState([]);

  // const handleStartCaptureClick = useCallback(() => {
  //   setCapturing(true);
  //   //@ts-ignore
  //   mediaRecorderRef.current = new MediaRecorder(webcamRef.current.stream, {
  //     mimeType: "video/webm"
  //   });
  //   //@ts-ignore
  //   mediaRecorderRef.current.addEventListener(
  //     "dataavailable",
  //     handleDataAvailable
  //   );
  //   //@ts-ignore
  //   mediaRecorderRef.current.start();
  // }, [webcamRef, setCapturing, mediaRecorderRef]);

  // const handleDataAvailable = React.useCallback(
  //   ({ data }) => {
  //     if (data.size > 0) {
  //       setRecordedChunks((prev) => prev.concat(data));
  //     }
  //   },
  //   [setRecordedChunks]
  // );

  // const handleStopCaptureClick = React.useCallback(() => {
  //   //@ts-ignore
  //   mediaRecorderRef.current.stop();
  //   setCapturing(false);
  // }, [mediaRecorderRef, webcamRef, setCapturing]);

  // const handleDownload = React.useCallback(() => {
  //   if (recordedChunks.length) {
  //     const blob = new Blob(recordedChunks, {
  //       type: "video/webm"
  //     });
  //     const url = URL.createObjectURL(blob);
  //     const a = document.createElement("a");
  //     document.body.appendChild(a);
  //   //@ts-ignore
  //   a.style = "display: none";
  //     a.href = url;
  //     a.download = "react-webcam-stream-capture.webm";
  //     a.click();
  //     window.URL.revokeObjectURL(url);
  //     setRecordedChunks([]);
  //   }
  // }, [recordedChunks]);

  return (
    <Container>
      <Webcam
        audio={false}
        ref={webcamRef}
        style={{ width: '100%', height: '100%' }}
      />
      {/* {capturing ? (
          <button onClick={handleStopCaptureClick}>Stop Capture</button>
        ) : (
          <button onClick={handleStartCaptureClick}>Start Capture</button>
        )}
        {recordedChunks.length > 0 && (
          <button onClick={handleDownload}>Download</button>
        )} */}
    </Container>
  );
};

export default WebcamCapture;
