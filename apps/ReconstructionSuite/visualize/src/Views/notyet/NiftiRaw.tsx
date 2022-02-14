//@ts-nocheck
import nifti from 'nifti-reader-js';
import { useEffect, useState, useRef } from 'react';
const NiftiRaw = () => {
  const [header, setHeader] = useState();
  const [image, setImage] = useState();
  var canvas = document.getElementById('myCanvas');

  const sliderRef = useRef();

  function drawCanvas(canvas, slice) {
    if (header != undefined) {
      var cols = header.dims[1];
      var rows = header.dims[2];

      // set canvas dimensions to nifti slice dimensions
      canvas.width = cols;
      canvas.height = rows;

      // make canvas image data
      var ctx = canvas.getContext('2d');
      var canvasImageData = ctx.createImageData(canvas.width, canvas.height);

      // convert raw data to typed array based on nifti datatype
      var typedData;

      if (header.datatypeCode === nifti.NIFTI1.TYPE_UINT8) {
        typedData = new Uint8Array(image);
      } else if (header.datatypeCode === nifti.NIFTI1.TYPE_INT16) {
        typedData = new Int16Array(image);
      } else if (header.datatypeCode === nifti.NIFTI1.TYPE_INT32) {
        typedData = new Int32Array(image);
      } else if (header.datatypeCode === nifti.NIFTI1.TYPE_FLOAT32) {
        typedData = new Float32Array(image);
      } else if (header.datatypeCode === nifti.NIFTI1.TYPE_FLOAT64) {
        typedData = new Float64Array(image);
      } else if (header.datatypeCode === nifti.NIFTI1.TYPE_INT8) {
        typedData = new Int8Array(image);
      } else if (header.datatypeCode === nifti.NIFTI1.TYPE_UINT16) {
        typedData = new Uint16Array(image);
      } else if (header.datatypeCode === nifti.NIFTI1.TYPE_UINT32) {
        typedData = new Uint32Array(image);
      } else {
        return;
      }
      // offset to specified slice
      var sliceSize = cols * rows;
      var sliceOffset = sliceSize * slice;

      // draw pixels
      for (var row = 0; row < rows; row++) {
        var rowOffset = row * cols;

        for (var col = 0; col < cols; col++) {
          var offset = sliceOffset + rowOffset + col;
          var value = typedData[offset];
          canvasImageData.data[(rowOffset + col) * 4] = value & 0xff;
          canvasImageData.data[(rowOffset + col) * 4 + 1] = value & 0xff;
          canvasImageData.data[(rowOffset + col) * 4 + 2] = value & 0xff;
          canvasImageData.data[(rowOffset + col) * 4 + 3] = 0xff;
        }
      }

      ctx.putImageData(canvasImageData, 0, 0);
    }
  }
  useEffect(() => {
    (async () => {
      const brainReq = await fetch(`/T1/PY20N012`);
      let data = await brainReq.arrayBuffer();

      if (nifti.isCompressed(data)) {
        data = nifti.decompress(data);
      }

      if (nifti.isNIFTI(data)) {
        let niftiHeader = nifti.readHeader(data);
        let niftiImage = nifti.readImage(niftiHeader, data);
        setHeader(niftiHeader);
        setImage(niftiImage);
      }

      // set up slider
      var slices = niftiHeader.dims[3];
      sliderRef.current.max = slices - 1;
      sliderRef.current.value = Math.round(slices / 2);
    })();
  }, []);
  useEffect(() => {
    drawCanvas(canvas, sliderRef.current.value);
  }, [header]);

  return (
    <>
      <div id="results">
        <canvas id="myCanvas" width="100" height="100"></canvas>
        <br />
        <input
          ref={sliderRef}
          type="range"
          min="1"
          max="100"
          value="50"
          className="slider"
          id="myRange"
          onInput={(e) => {
            drawCanvas(canvas, e.currentTarget.value);
          }}
        />
      </div>
    </>
  );
};
export default NiftiRaw;
