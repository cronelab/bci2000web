import {
  VolumeLoader,
  VolumeRenderingHelper,
  LutHelper,
  TrackballControl,
  stackHelperFactory,
} from 'ami.js/build/ami';
import pako from 'pako';

const StackHelper = stackHelperFactory();

export const loadVolume = async (activeSubject, modality) => {
  // If a T1 or CT exists, load it.
  const brainReq = await fetch(`/${modality}/${activeSubject}`);
  if (!brainReq.ok) {
    alert('Error: Subject not found');
    return;
  }
  let brain;
  let objectURL;

  if (brainReq.headers.get('content-type') == 'application/gzip') {
    brain = await brainReq.arrayBuffer();
    objectURL = URL.createObjectURL(new Blob([pako.inflate(brain).buffer]));
  } else {
    brain = await brainReq.blob();
    objectURL = URL.createObjectURL(brain);
  }
  let stack;

  // Use AMI to parse, processes, and display the scan
  const volumeLoader = new VolumeLoader();
  await volumeLoader.load(objectURL);
  const series = volumeLoader.data[0].mergeSeries(volumeLoader.data)[0];
  // console.log(volumeLoader);
  // console.log(series);
  volumeLoader.free();

  stack = series.stack[0];
  return stack;
};

self.onmessage = ({ data: stack }) => {
  (async () => {
    let stack = await loadVolume('PY21N029', 'CT');

    stack.prepare();
    const worldCenter = stack.worldCenter();
    let stackHelper = new StackHelper(stack);
    self.postMessage(stackHelper)
  })();
};
