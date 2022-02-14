import { Vector3, WebGLRenderer, PerspectiveCamera, Scene, DirectionalLight } from 'three';
import { TrackballControls } from 'three/examples/jsm/controls/TrackballControls';
import { orthographicCameraFactory, trackballOrthoControlFactory } from '../../node_modules/ami.js/build/ami';

// Instantiate AMI factories
const CamerasOrthographic = orthographicCameraFactory();
const ControlsOrthographic = trackballOrthoControlFactory();

export const initHelpersStack = async (rendererObj, stack,lpsDims,stackHelper) => {


  rendererObj.domElement = document.getElementById(rendererObj.domId);
  rendererObj.renderer = new WebGLRenderer({
    antialias: true,
  });

  
  rendererObj.renderer.autoClear = false;
  rendererObj.renderer.localClippingEnabled = true;
  rendererObj.renderer.setSize(rendererObj.domElement.clientWidth, rendererObj.domElement.clientHeight);
  rendererObj.renderer.setClearColor(0x000000, 1);
  rendererObj.renderer.domElement.id = rendererObj.targetID;

  rendererObj.domElement.appendChild(rendererObj.renderer.domElement);
  // camera
  rendererObj.camera = new CamerasOrthographic(
    rendererObj.domElement.clientWidth / -2,
    rendererObj.domElement.clientWidth / 2,
    rendererObj.domElement.clientHeight / 2,
    rendererObj.domElement.clientHeight / -2,
    1,
    1000
  );

  // controls
  rendererObj.controls = new ControlsOrthographic(rendererObj.camera, rendererObj.domElement);
  rendererObj.controls.staticMoving = true;
  rendererObj.controls.noRotate = true;
  rendererObj.camera.controls = rendererObj.controls;

  // scene
  rendererObj.scene = new Scene();

  rendererObj.stackHelper= stackHelper
  rendererObj.stackHelper.bbox.visible = false;
  rendererObj.stackHelper.borderColor = 0x000000; //rendererObj.sliceColor;
  rendererObj.stackHelper.backgroundColor = 0x000000;
  rendererObj.stackHelper._slice.borderColor = 0x000000;
  rendererObj.stackHelper.slice.canvasWidth = rendererObj.domElement.clientWidth;
  rendererObj.stackHelper.slice.canvasHeight = rendererObj.domElement.clientHeight;
  // set camera

  rendererObj.camera.directions = [stack.xCosine, stack.yCosine, stack.zCosine];
  rendererObj.camera.box = {
    center: stack.worldCenter().clone(),
    halfDimensions: new Vector3(lpsDims.x, lpsDims.y, lpsDims.z),
  };
  rendererObj.camera.canvas = {
    width: rendererObj.domElement.clientWidth,
    height: rendererObj.domElement.clientHeight,
  };
  rendererObj.camera.orientation = rendererObj.sliceOrientation;
  rendererObj.camera.update();
  rendererObj.camera.fitBox(2, 1);

  rendererObj.stackHelper.orientation = rendererObj.camera.stackOrientation;
  rendererObj.stackHelper.index = Math.floor(rendererObj.stackHelper.orientationMaxIndex / 2);
  rendererObj.scene.add(rendererObj.stackHelper);
}

export function initRenderer3D(r0, stack) {

  const worldbb = stack.worldBoundingBox();
  const lpsDims = new Vector3(
    (worldbb[1] - worldbb[0]) / 1,
    (worldbb[3] - worldbb[2]) / 1,
    (worldbb[5] - worldbb[4]) / 1
  );

  // renderer
  r0.domElement = document.getElementById(r0.domId);
  r0.renderer = new WebGLRenderer({
    antialias: true,
    alpha: true,
  });

  r0.renderer.setSize(r0.domElement.clientWidth, r0.domElement.clientHeight);
  r0.renderer.setClearColor(r0.color, 1);
  r0.renderer.domElement.id = r0.targetID;
  r0.domElement.appendChild(r0.renderer.domElement);

  // camera
  // r0.camera = new PerspectiveCamera(45, r0.domElement.clientWidth / r0.domElement.clientHeight, 0.1, 100000);
  r0.camera = new CamerasOrthographic(
    r0.renderer.domElement.clientWidth / -2,
    r0.renderer.domElement.clientWidth / 2,
    r0.renderer.domElement.clientHeight / 2,
    r0.renderer.domElement.clientHeight / -2,
    .1,
    1000
  );
  // Axial+ = -22,-110,-255

  r0.camera.position.x = 20;
  r0.camera.position.y = 100;
  r0.camera.position.z = 255;

  // // controls
  // r0.controls = new ControlsOrthographic(r0.camera, r0.domElement);
  // r0.controls.staticMoving = false;
  // r0.controls.noRotate = false;

  r0.controls = new TrackballControls(r0.camera, r0.domElement);
  r0.controls.rotateSpeed = 5.5;
  r0.controls.zoomSpeed = 1.2;
  r0.controls.panSpeed = 0.8;
  r0.controls.staticMoving = true;
  r0.controls.dynamicDampingFactor = 0.3;  
  r0.camera.controls = r0.controls;

  r0.scene = new Scene();

  r0.light = new DirectionalLight(0xffffff, 1);
  r0.light.position.copy(r0.camera.position);
  r0.scene.add(r0.light);

  r0.camera.directions = [stack.xCosine, stack.yCosine, stack.zCosine];
  r0.camera.box = {
    center: stack.worldCenter().clone(),
    halfDimensions: new Vector3(lpsDims.x, lpsDims.y, lpsDims.z),
  };
  r0.camera.canvas = {
    width: r0.domElement.clientWidth,
    height: r0.domElement.clientHeight,
  };
  r0.camera.orientation = 'axial';
  r0.camera.update();
  // r0.camera.fitBox(2, 1);

}
