//@ts-nocheck
import { useEffect, Suspense, useState, useRef } from 'react';
import '../App.scss';
import { initRenderer3D } from '../helpers/helpers';
// Import AMI (from TheBrainChain repo)
import { VolumeRenderingHelper, LutHelper } from 'ami.js';
import { loadVolume } from '../helpers/loadVolume';
import { loadBrainSurface } from '../helpers/loadSurfaces';
import { r0 } from '../helpers/renderers';
// import setGUIS from '../helpers/sliceGUI';
import { TextGeometry, MeshPhongMaterial, Mesh, FontLoader, Cache, Vector3 } from 'three';
import font from 'three/examples/fonts/helvetiker_regular.typeface.json';
import { Canvas, useFrame } from '@react-three/fiber';
import {
  OrthographicCamera,
  OrbitControls,
  PerspectiveCamera,
  TrackballControls,
  Box,
  RoundedBox,
} from '@react-three/drei';
import { stackHelperFactory, orthographicCameraFactory, trackballOrthoControlFactory } from 'ami.js';

const CamerasOrthographic = orthographicCameraFactory();
const ControlsOrthographic = trackballOrthoControlFactory();
const StackHelper = stackHelperFactory();

const Volume = () => {
  const cameraRef = useRef(null);
  const lightRef = useRef(null);

  const myStack = {
    lut: 'default',
    opacity: 'random',
    steps: 256,
    alphaCorrection: 0.5,
    interpolation: 1,
  };

  const [volume, setVolume] = useState(null);
  const [center, setCenter] = useState(null);

  useEffect(() => {
    (async () => {
      let stack = await loadVolume();
      stack.prepare();
      let vrHelper = new VolumeRenderingHelper(stack);
      let lut = new LutHelper('canvas');
      lut.luts = LutHelper.presetLuts();
      lut.lutsO = LutHelper.presetLutsO();
      vrHelper.uniforms.uTextureLUT.value = lut.texture;
      vrHelper.uniforms.uLut.value = 1;
      lut.lut = myStack.lut;
      vrHelper.uniforms.uTextureLUT.value.dispose();
      vrHelper.uniforms.uTextureLUT.value = lut.texture;

      setVolume(vrHelper);
      const worldCenter = stack.worldCenter();
      setCenter(worldCenter);
    })();
  }, []);
  useFrame(() => {
    // if (lightRef.current !== undefined) {
    //@ts-ignore
    //   lightRef.current.position.copy(cameraRef.current.position);
    // }
  });
  return (
    <group
      onPointerDown={() => {
        if (volume && volume.uniforms) {
          volume.uniforms.uSteps.value = Math.floor(myStack.steps / 2);
          volume.interpolation = 0;
        }
      }}
      onPointerUp={() => {
        if (volume && volume.uniforms) {
          volume.uniforms.uSteps.value = myStack.steps;
          volume.interpolation = myStack.interpolation;
        }
      }}
    >
      <PerspectiveCamera ref={cameraRef} makeDefault position={[20, 100, 255]} zoom={1} />
      <TrackballControls
        rotateSpeed={6}
        zoomSpeed={1.2}
        panSpeed={0.8}
        staticMoving={true}
        dynamicDampingFactor={0.3}
        target={center}
      />
      <directionalLight
        ref={lightRef}
        position={cameraRef.current != undefined ? cameraRef.current.position : [0, 0, 0]}
        color={0xffffff}
        intensity={1}
      />

      {volume ? (
        <mesh>
          <primitive object={volume} dispose={null} />
        </mesh>
      ) : (
        <></>
      )}
    </group>
  );
};

const Slice = (props) => {
  const cameraRef = useRef(null);
  const lightRef = useRef(null);
  const controlsRef = useRef(null);
  const [center, setCenter] = useState();
  const [_camera, setCamera] = useState();
  const [_controls, setControls] = useState();
  const [_stackHelper, _setStackHelper] = useState();

  useFrame(({ gl, scene, camera }) => {
    gl.clear();
    gl.render(scene, camera);
    gl.clearDepth();
    if (_controls !== undefined) {
      //@ts-ignore
      _controls.update();
    }
  });

  useEffect(() => {
    (async () => {
      let stack = await loadVolume();
      stack.prepare();

      const worldbb = stack.worldBoundingBox();
      const lpsDims = new Vector3(
        (worldbb[1] - worldbb[0]) / 2,
        (worldbb[3] - worldbb[2]) / 2,
        (worldbb[5] - worldbb[4]) / 2
      );

      let _stackHelper = new StackHelper(stack);

      _stackHelper.bbox.visible = false;
      _stackHelper.borderColor = 0x000000; //rendererObj.sliceColor;
      _stackHelper.backgroundColor = 0x000000;
      _stackHelper._slice.borderColor = 0x000000;
      _stackHelper.slice.canvasWidth = '250px'; //rendererObj.domElement.clientWidth;
      _stackHelper.slice.canvasHeight = '250px'; //rendererObj.domElement.clientHeight;
      _stackHelper.orientation = props.orientation;
      //   _stackHelper.index = Math.floor(_stackHelper.orientationMaxIndex / 2);

      let camera = new CamerasOrthographic(
        document.getElementById(props.rendID).clientWidth / -2,
        document.getElementById(props.rendID).clientWidth / 2,
        document.getElementById(props.rendID).clientHeight / 2,
        document.getElementById(props.rendID).clientHeight / -2,
        1,
        1000
      );
      let controls = new ControlsOrthographic(camera, document.getElementById(props.rendID));
      controls.staticMoving = true;
      controls.noRotate = true;
      camera.controls = controls;

      camera.directions = [stack.xCosine, stack.yCosine, stack.zCosine];
      camera.box = {
        center: stack.worldCenter().clone(),
        halfDimensions: new Vector3(lpsDims.x, lpsDims.y, lpsDims.z),
      };
      camera.canvas = {
        width: document.getElementById(props.rendID).clientWidth,
        height: document.getElementById(props.rendID).clientHeight,
      };
      camera.orientation = props.orientation;
      camera.update();
      camera.fitBox(2, 1);

      _stackHelper.orientation = camera.stackOrientation;
      _stackHelper.index = Math.floor(_stackHelper.orientationMaxIndex / 2);

      _setStackHelper(_stackHelper);

      setCamera(camera);
      setControls(controls);
      const worldCenter = stack.worldCenter();
      setCenter(worldCenter);
    })();
  }, []);

  return (
    <>
      <group>
        {_camera ? <primitive object={_camera} dispose={null} /> : <></>}
        {_controls ? <primitive object={_controls} dispose={null} /> : <></>}

        {/* <OrthographicCamera ref={cameraRef} makeDefault position={[20, 100, 255]} zoom={1} />
        <TrackballControls
          rotateSpeed={6}
          zoomSpeed={1.2}
          panSpeed={0.8}
          staticMoving={true}
          dynamicDampingFactor={0.3}
          //   target={center}
        /> */}
        <directionalLight
          ref={lightRef}
          position={cameraRef.current != undefined ? cameraRef.current.position : [20, 100, 255]}
          color={0xffffff}
          intensity={1}
        />
        {_stackHelper ? (
          <mesh>
            <primitive object={_stackHelper} dispose={null} />
          </mesh>
        ) : (
          <></>
        )}
      </group>
    </>
  );
};

const CombinedView = () => {
  const [view, setView] = useState('slice');
  return (
    <>
      {view == 'volume' ? (
        <Canvas style={{ backgroundColor: 'white' }}>
          <Suspense fallback={null}>
            <Volume></Volume>
          </Suspense>
        </Canvas>
      ) : (
        <>
          <Canvas
            id="r1"
            className="renderer"
            style={{ backgroundColor: 'white', width: '50%', height: '50%' }}
            onCreated={({ gl }) => {
              gl.localClippingEnabled = true;
              gl.domElement.id = 'r1';
            }}
          >
            <Suspense fallback={null}>
              <Slice orientation="axial" rendID="r1"></Slice>
            </Suspense>
          </Canvas>
          <Canvas id="r2" className="renderer" style={{ backgroundColor: 'white', width: '50%', height: '50%' }}>
            <Suspense fallback={null}>
              <Slice orientation="sagittal" rendID="r2"></Slice>
            </Suspense>
          </Canvas>
          {/* <Canvas id="r3" className="renderer" style={{ backgroundColor: 'white', width: '50%', height: '50%' }}>
            <Suspense fallback={null}>
              <Slice orientation="coronal" rendID="r3"></Slice>
            </Suspense>
          </Canvas> */}
        </>
      )}
    </>
  );
};
export default CombinedView;
