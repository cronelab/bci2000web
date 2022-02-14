import { VolumeLoader, stackHelperFactory } from '../../node_modules/ami.js/build/ami';
import { activeSubject, modality, onDoubleClick, onScroll } from './renderers';
import pako from 'pako';
import { Vector3 } from 'three';
export const loadVolume = async (r0, r1, r2, r3, specificImage?) => {
  const volumeLoader = new VolumeLoader();

  let newModality = modality
  // If a T1 or CT exists, load it.
  if(specificImage == 'cerebellumRemoved'){
    newModality = 'cerebellumRemoved'
  }
  const brainReq = await fetch(`/${newModality}/${activeSubject}`);
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
  await volumeLoader.load(objectURL);

  const series = volumeLoader.data[0].mergeSeries(volumeLoader.data)[0];
  volumeLoader.free();

  stack = series.stack[0];
  stack.prepare();
  console.log(stack)

  return {
    stack,
  };
};
